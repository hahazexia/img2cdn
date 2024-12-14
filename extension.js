const vscode = require('vscode');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const url = require('url');
const os = require('os');
const FormData = require('form-data');
const sizeOf = require('image-size');
const tmp = require('tmp');
const chokidar = require('chokidar');

const tinify = require("tinify");
const config = vscode.workspace.getConfiguration('img2cdn');
const apiKey = config.get('tinypngApiKey') || 'yv06NdJfZ79WjWTtyKgcZq6dVdCVY4nk';
tinify.key = apiKey;

const tempDir = os.tmpdir();
const tempPath = path.join(tempDir, `./img2cdntemp`);
if (!fs.existsSync(tempPath)) {
  fs.mkdirSync(tempPath, { recursive: true });
} ``

const imageCache = new Map();
tmp.setGracefulCleanup();

let language = 'en'; // en zh
let format = 'png|jpg|jpeg|gif|bmp|svg';

function activate(context) {
  const config = vscode.workspace.getConfiguration('img2cdn');
  language = config.get('language');
  format = config.get('format');
  const resourceRoot = vscode.Uri.joinPath(context.extensionUri, 'dist');

  context.subscriptions.push(
    vscode.languages.registerCodeLensProvider('*', new ImageCodeLensProvider())
  );
  context.subscriptions.push(
    vscode.languages.registerHoverProvider('*', new ImageHoverProvider())
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('extension.uploadImage', async (imagePath, document, range, importRangeArr, compress) => {
      const res = isUrl(imagePath);
      if (res) {
        await downloadAndUpload({
          imagePath,
          document,
          range,
          importRangeArr,
          compress,
        });
      } else {
        const editor = vscode.window.activeTextEditor;
        const document = editor.document;
        const absolutePath = path.resolve(document.uri.fsPath, '..', imagePath);
        await upload({
          imagePath: absolutePath,
          document,
          range,
          importRangeArr,
          isLocal: true,
          compress,
        });
      }
    }),
  );
  context.subscriptions.push(vscode.commands.registerCommand('extension.img2cdn', async (uri) => {
    console.log(uri, 'uri');
    const filePath = uri.fsPath;
    console.log(`filePath: ${filePath}`);
    const imgExtReg = new RegExp(`\\.(${format})$`, 'g');
    const isImgFile = imgExtReg.test(filePath);
    let resImg = [];

    if (isImgFile) {
      const imgUrl = await uploadImgFromLocal(filePath);
      const size = await getFilesize(filePath);
      console.log(imgUrl, '看看 imgUrl');
      resImg = [
        {
          local: filePath,
          url: imgUrl,
          size,
        },
      ];
    } else {
      const files = await fs.promises.readdir(filePath);
      const fileArray = files.map(file => path.join(filePath, file));
      resImg = await uploadImgFromLocalMulti(fileArray);
    }

    const panel = vscode.window.createWebviewPanel(
      'img2cdn',
      'img2cdn',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
      }
    );
    let html = fs.readFileSync(path.resolve(__dirname, './index.html'), {
      encoding: 'utf-8',
    });
    const webviewResourceRoot = panel.webview.asWebviewUri(resourceRoot);
    html = html.replace(/\/VSCODE_WEBVIEW_BASE/g, webviewResourceRoot.toString());

    panel.webview.html = html;
    panel.webview.postMessage({
      command: 'img',
      data: {
        img: resImg.map(i => ({
          ...i,
          webviewUrl: handleWebviewImagesUri(i.local, panel)
        })),
      },
    });

    panel.webview.onDidReceiveMessage(
      message => {
        try {
          switch (message.command) {
            case 'openFile':
              openFile(JSON.parse(message.data));
              break;
            case 'copySuccess':
              vscode.window.showInformationMessage(language === 'zh' ? `图片 url 复制成功！` : `image url copy success!`);
              break;
          }
        } catch (err) {
          console.log(err, 'onDidReceiveMessage err');
        }

      },
      undefined,
      context.subscriptions
    );
  }));
}

function handleWebviewImagesUri(imgPath, panel) {
  const imageUri = vscode.Uri.file(imgPath);
  const webviewImageUri = panel.webview.asWebviewUri(imageUri).toString();
  return webviewImageUri;
}

async function openFile(filePath) {
  try {
    const fileUri = vscode.Uri.file(filePath);
    await vscode.commands.executeCommand('vscode.open', fileUri);
  } catch (error) {
    vscode.window.showErrorMessage(`Error opening file: ${error.message}`);
  }
}

class ImageCodeLensProvider {
  provideCodeLenses(document, token) {
    try {
      const imageRegex = new RegExp(`(import\\s*([^\\s]+)\\s*from\\s*)?(['"\`]|url\\(['"\`]?|src=['"\`])(.*\\.(?:${format}))`, 'g');
      const content = document.getText();
      const codeLenses = [];

      const config = vscode.workspace.getConfiguration('img2cdn');
      const imagePathWhitelist = config.get('imagePathWhitelist');
      const imagePathWhitelistArr = imagePathWhitelist ? imagePathWhitelist.split(',') : [];

      let match;
      while ((match = imageRegex.exec(content)) !== null) {
        const imagePath = match[4];
        if (imagePathWhitelistArr.some((i) => imagePath.includes(i))) continue;
        const prefix = match[3];
        const importModuleName = match[2];
        const importPrefix = match[1];
        const isQuotation = prefix.startsWith('"') || prefix.startsWith("'") || prefix.startsWith('`');
        const isUrl = prefix.startsWith('url');
        const isSrc = prefix.startsWith('src');
        const isUrlSrcQuotation = (isUrl || isSrc) && (prefix.endsWith('"') || prefix.endsWith("'") || prefix.endsWith('`'));
        const isImport = Boolean(importModuleName);

        let start = match.index;
        let end = match.index + imagePath.length;

        if (isQuotation) {
          end += 2;
        }
        if (isUrl) {
          start += 4;
          if (isUrlSrcQuotation) {
            end += (4 + 2);
          } else {
            end += (4);
          }
        }
        if (isSrc) {
          start += 4;
          end += (4 + 2);
        }
        if (isImport) {
          start += importPrefix.length;
          end += importPrefix.length;
        }


        let importRangeArr = [];
        if (isImport) {
          let importModuleMatch = new RegExp(`[^a-zA-Z$_0-9]${importModuleName}(?=[\\s;.,(){}[\\]])`, 'g');
          const matches = document.getText().matchAll(importModuleMatch);
          for (const match of matches) {
            const tempStart = match.index + 1;
            const tempEnd = tempStart + importModuleName.length;
            const temp = new vscode.Range(
              document.positionAt(tempStart),
              document.positionAt(tempEnd)
            );
            importRangeArr.push(temp);
          }
        }

        const range = new vscode.Range(
          document.positionAt(start),
          document.positionAt(end),
        );
        const command = {
          title: language === 'zh' ? '上传到CDN' : 'Upload to CDN',
          command: 'extension.uploadImage',
          arguments: [imagePath, document, range, importRangeArr, false],
        };
        const command2 = {
          title: language === 'zh' ? '压缩并上传到CDN' : 'Compress and upload to CDN',
          command: 'extension.uploadImage',
          arguments: [imagePath, document, range, importRangeArr, true],
        };
        codeLenses.push(new vscode.CodeLens(range, command));
        codeLenses.push(new vscode.CodeLens(range, command2));
      }

      return codeLenses;
    } catch (err) {
      console.error(err);
      vscode.window.showErrorMessage(language === 'zh' ? `创建 codelens 对象失败: ${err}` : `Failed to provide codelenses: ${err}`);
    }
  }
}

class ImageHoverProvider {
  async provideHover(document, position, token) {
    const imageRegex = new RegExp(`(import\\s*([^\\s]+)\\s*from\\s*)?(['"\`]|url\\(['"\`]?|src=['"\`])(.*\\.(?:${format}))`, 'g');
    const range = document.getWordRangeAtPosition(position, imageRegex);

    if (range) {
      let imagePath = document.getText(range);
      imagePath = imagePath.replace(/^import\s*([^\s]+)\s*from\s*|['"`]|url\(['"`]?|src=['"`]|.*\:\s*['"`]/g, '');
      const absoluteImagePath = imagePath.startsWith('http') ? imagePath : vscode.Uri.file(path.resolve(path.dirname(document.uri.fsPath), imagePath)).toString().replace(/file:\/*/g, '');
      let localImagePath = absoluteImagePath.startsWith('http') ? await download(absoluteImagePath) : absoluteImagePath;
      const dimensions = getFileDimensions(localImagePath);
      const filesize = await getFilesize(localImagePath);
      let maxSizeConfig;
      if (dimensions.width > dimensions.height) {
        maxSizeConfig = `|width=${dimensions.width > 500 ? 500 : dimensions.width}`;
      } else {
        maxSizeConfig = `|height=${dimensions.height > 500 ? 500 : dimensions.height}`;
      }
      let mdString = `\r\n\r\n  ${language === 'zh' ? '图片尺寸' : 'Intrinsic Size'}: ${dimensions.width}x${dimensions.height}`;
      mdString += `\r\n\r\n  ${language === 'zh' ? '文件大小' : 'File Size'}: ${filesize}`;
      mdString += `\r\n\r\n  ![Image Preview](${absoluteImagePath}${maxSizeConfig})`;
      const markdownImage = new vscode.MarkdownString(mdString);
      markdownImage.isTrusted = true;
      return new vscode.Hover(markdownImage);
    }
  }
}

function getFileDimensions(source) {
  try {
    console.log(source, 'source 看看');
    const dimensions = sizeOf(source);
    console.log(dimensions.width, dimensions.height)
    return dimensions;
  } catch (err) {
    console.error(`Failed to get file dimensions: ${source}`, err);
    // vscode.window.showErrorMessage(language === 'zh' ? `获取图片宽高失败: ${source}` : `Failed to get file dimensions: ${source}`);
    return null;
  }
}

async function getFilesize(source) {
  try {
    const fsStat = fs.statSync(source);
    const { filesize } = await import('filesize');
    return filesize(fsStat.size, { standard: 'jedec' });
  } catch (err) {
    console.error(`Failed to get filesize: ${source}`, err);
    vscode.window.showErrorMessage(language === 'zh' ? `获取图片大小失败: ${source}` : `Failed to get filesize: ${source}`);
    return '';
  }
}

function isUrl(string) {
  try {
    new url.URL(string);
    return true;
  } catch (e) {
    return false;
  }
}
function getBasenameFormUrl(urlStr) {
  return urlStr.split('/').pop();
}

async function download(imageUrl) {
  try {
    if (imageCache.has(imageUrl)) {
      return imageCache.get(imageUrl);
    }
    const response = await axios({
      method: 'get',
      url: imageUrl,
      responseType: 'stream',
    });

    const tempFile = tmp.fileSync({
      tmpdir: tempPath,
      postfix: imageUrl ? path.parse(imageUrl).ext : '.png',
    });
    const filePath = tempFile.name;
    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    imageCache.set(imageUrl, filePath);

    return filePath;
  } catch (err) {
    console.error(`Failed to download image: ${imageUrl}`, err);
    vscode.window.showErrorMessage(language === 'zh' ? `下载图片失败: ${imageUrl}` : `Failed to download image: ${imageUrl}`);
  }
}

async function downloadAndUpload({
  imagePath,
  document,
  range,
  importRangeArr,
  compress,
}) {
  try {
    const resFilePath = await download(imagePath);

    await upload({
      imagePath: resFilePath,
      document,
      range,
      importRangeArr,
      isLocal: false,
      compress,
    });
  } catch (error) {
    console.error(`Failed to download and upload image: ${imagePath}`, error);
    vscode.window.showErrorMessage(language === 'zh' ? `下载并上传图片失败: ${imagePath}` : `Failed to download and upload image: ${imagePath}`);
  }
}

async function uploadImgNoProgress(imgPath) {
  return new Promise(async (resolve) => {
    try {
      const config = vscode.workspace.getConfiguration('img2cdn');
      const uploadUrl = config.get('uploadApiUrl');
      const resKey = config.get('uploadApiResKey').split('.');
      resKey.shift();

      const extension = path.extname(imgPath);
      const form = new FormData();
      form.append('file', fs.createReadStream(imgPath));
      form.append('extension', extension);

      const res = await axios.post(uploadUrl, form, {
        headers: form.getHeaders()
      });
      const size = await getFilesize(imgPath);
      let data;
      resKey.forEach((key) => {
        data = data ? data[key] : res[key];
      });
      console.log(`Image uploaded: ${data}`);
      resolve({
        local: imgPath,
        url: data,
        size,
      });
    } catch (error) {
      console.error(`Failed to upload image: ${imgPath}`, error);
      vscode.window.showErrorMessage(language === 'zh' ? `上传图片失败: ${imgPath}` : `Failed to upload image: ${imgPath}`);
      vscode.window.showErrorMessage(`${JSON.stringify({
        name: error.name,
        message: error.message,
        stack: error.stack
      })}`);
      console.log(`uploadImgNoProgress error`);
      resolve({
        local: imgPath,
        url: 'upload error',
        size: 0,
      });
    }
  });
}

async function uploadImgFromLocalMulti(pathArr) {
  const config = vscode.workspace.getConfiguration('img2cdn');
  const parallelism = config.get('parallelism');
  const len = pathArr.length;
  console.log(len, 'len 看看');
  let resUrl = [];
  const tasks = pathArr.reduce((acc, i) => {
    const index = acc.length > 0 ? acc.length - 1 : acc.length;
    if (!acc[index]) {
      acc[index] = [];
    }
    if (acc[index].length < parallelism) {
      acc[index].push(uploadImgNoProgress(i));
    } else {
      acc.push([uploadImgNoProgress(i)]);
    }
    return acc;
  }, []);
  console.log(tasks, 'tasks看看');
  return new Promise((resolve) => {
    vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: language === 'zh' ? '正在上传图片' : 'Uploading image',
      cancellable: true
    }, async (progress, token) => {
      try {
        token.onCancellationRequested(() => {
          console.log("User canceled the long running operation");
        });

        let count = 0;

        progress.report({ increment: 0, message: language === 'zh' ? '上传中...' : 'Uploading...' });

        for (const arr of tasks) {
          const res = await Promise.all(arr);
          resUrl = [...resUrl, ...res];

          count += arr.length;
          const inc = Math.floor(1 / len * arr.length * 100);
          console.log(inc, 'inc');
          progress.report({ increment: inc, message: language === 'zh' ? `上传中，${count}/${len}` : `Uploading, ${count}/${len}` });
          await new Promise((resolve) => setTimeout(() => resolve(''), 1000));
        }

        resolve(resUrl);
      } catch (error) {
        console.error(`Failed to upload image: ${pathArr.join('||')}`, error);
        vscode.window.showErrorMessage(language === 'zh' ? `上传图片失败: ${pathArr.join('||')}` : `Failed to upload image: ${pathArr.join('||')}`);
        vscode.window.showErrorMessage(`${JSON.stringify({
          name: error.name,
          message: error.message,
          stack: error.stack
        })}`);
        console.log(`uploadImgFromLocalMulti error resUrl: ${resUrl}`);
        resolve(resUrl);
      }
    });
  });
}

async function uploadImgFromLocal(localImgPath) {
  return new Promise((resolve, reject) => {
    try {
      vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: language === 'zh' ? '正在上传图片' : 'Uploading image',
        cancellable: true
      }, async (progress, token) => {
        token.onCancellationRequested(() => {
          console.log("User canceled the long running operation");
        });

        progress.report({ increment: 0, message: language === 'zh' ? '上传中...' : 'Uploading...' });

        // let compressFile = null;
        // if (compress) {
        //   compressFile = await compressImage({
        //     imagePath,
        //   });
        // }

        progress.report({ increment: 50, message: language === 'zh' ? '上传中...' : 'Uploading...' });

        const config = vscode.workspace.getConfiguration('img2cdn');
        const uploadUrl = config.get('uploadApiUrl');
        const resKey = config.get('uploadApiResKey').split('.');
        resKey.shift();

        const extension = path.extname(localImgPath);
        const form = new FormData();
        form.append('file', fs.createReadStream(localImgPath));
        form.append('extension', extension);

        const res = await axios.post(uploadUrl, form, {
          headers: form.getHeaders()
        });
        let data;
        resKey.forEach((key) => {
          data = data ? data[key] : res[key];
        });
        progress.report({ increment: 80, message: language === 'zh' ? '上传中，快好了...' : 'Uploading, almost there...' });
        console.log(`Image uploaded: ${data}`);

        resolve(data);
      });

    } catch (error) {
      console.error(`Failed to upload image: ${localImgPath}`, error);
      vscode.window.showErrorMessage(language === 'zh' ? `上传图片失败: ${localImgPath}` : `Failed to upload image: ${localImgPath}`);
      vscode.window.showErrorMessage(`${JSON.stringify({
        name: error.name,
        message: error.message,
        stack: error.stack
      })}`);
      resolve(`Error`);
    }
  });
}

async function upload({
  imagePath,
  document,
  range,
  importRangeArr,
  isLocal,
  compress,
}) {
  try {
    vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: language === 'zh' ? '正在上传图片' : 'Uploading image',
      cancellable: true
    }, async (progress, token) => {
      token.onCancellationRequested(() => {
        console.log("User canceled the long running operation");
      });

      progress.report({ increment: 0, message: language === 'zh' ? '上传中...' : 'Uploading...' });

      let compressFile = null;
      if (compress) {
        compressFile = await compressImage({
          imagePath,
        });
      }

      progress.report({ increment: 50, message: language === 'zh' ? '上传中...' : 'Uploading...' });

      const config = vscode.workspace.getConfiguration('img2cdn');
      const uploadUrl = config.get('uploadApiUrl');
      const resKey = config.get('uploadApiResKey').split('.');
      resKey.shift();

      const extension = path.extname(imagePath);
      const form = new FormData();
      form.append('file', fs.createReadStream(compressFile ? compressFile : imagePath));
      form.append('extension', extension);

      const res = await axios.post(uploadUrl, form, {
        headers: form.getHeaders()
      });
      let data;
      resKey.forEach((key) => {
        data = data ? data[key] : res[key];
      });
      progress.report({ increment: 80, message: language === 'zh' ? '上传中，快好了...' : 'Uploading, almost there...' });
      console.log(`Image uploaded: ${data}`);

      await replaceImage({
        cdnUrl: data,
        document,
        range,
        originalImagePath: imagePath,
        importRangeArr,
        isLocal,
      });

      const p = new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, 200);
      });

      return p;
    });
  } catch (error) {
    console.error(`Failed to upload image: ${imagePath}`, error);
    vscode.window.showErrorMessage(language === 'zh' ? `上传图片失败: ${imagePath}` : `Failed to upload image: ${imagePath}`);
    vscode.window.showErrorMessage(`${JSON.stringify({
      name: error.name,
      message: error.message,
      stack: error.stack
    })}`);
  }
}

async function compressImage({
  imagePath,
}) {
  return new Promise((resolve, reject) => {

    try {
      const tempFile = tmp.fileSync({
        tmpdir: tempPath,
        postfix: imagePath ? path.parse(imagePath).ext : '.png',
      });
      const compressImgPath = tempFile.name;
      console.log(`compressImgPath: ${compressImgPath}`);


      const config = vscode.workspace.getConfiguration('img2cdn');
      const tinypngTimeout = config.get('tinypngTimeout')
      const timeout = setTimeout(() => {
        vscode.window.showErrorMessage(language === 'zh' ? `tinypng压缩图片超时: ${imagePath}` : `Tinypng compress timeout: ${imagePath}`);
        resolve(null);
      }, tinypngTimeout);

      chokidar.watch(compressImgPath).on('all', (event, path) => {
        console.log(`chokidar event: ${event}, path: ${path}`);
        const dimensions = getFileDimensions(path);
        if (dimensions?.width) {
          clearTimeout(timeout);
          resolve(path);
        }
      });

      tinify.fromFile(imagePath).toFile(compressImgPath, (error) => {
        console.log(`tinify err: ${JSON.stringify({
          name: error.name,
          message: error.message,
          stack: error.stack
        })}`);
        vscode.window.showErrorMessage(`tinify err: ${JSON.stringify({
          name: error.name,
          message: error.message,
          stack: error.stack
        })}`);
        clearTimeout(timeout);
        resolve(null)
      });
    } catch (error) {
      console.error(`Failed to compress image: ${imagePath}`, error);
      vscode.window.showErrorMessage(language === 'zh' ? `压缩图片失败: ${imagePath}` : `Failed to compress image: ${imagePath}`);
      vscode.window.showErrorMessage(`${JSON.stringify({
        name: error.name,
        message: error.message,
        stack: error.stack
      })}`);
      return resolve(null);
    }
  });
}

async function replaceImage({
  cdnUrl,
  document,
  range,
  originalImagePath,
  importRangeArr,
  isLocal,
}) {
  try {
    const name = getBasenameFormUrl(originalImagePath);
    const edit = new vscode.WorkspaceEdit();
    edit.replace(document.uri, range, `'${cdnUrl}'`);
    await vscode.workspace.applyEdit(edit);

    if (importRangeArr.length > 0) {
      const importLineRange = importRangeArr.shift();
      if (importRangeArr[0].start.line === importLineRange.start.line) {
        importRangeArr.shift();
      }

      const edit = new vscode.WorkspaceEdit();
      importRangeArr.forEach(item => {
        edit.replace(document.uri, item, `'${cdnUrl}'`);
      });
      await vscode.workspace.applyEdit(edit);

      const lineNumber = importLineRange.start.line;
      const line = document.lineAt(lineNumber);
      const startPosition = new vscode.Position(lineNumber, 0);
      const endPosition = line.range.end;
      const range = new vscode.Range(startPosition, endPosition);

      const commentText =
        '// '
        + document.getText(range)
        + ` ${language === 'zh' ? '替换import图片位置(第几行)' : 'Replace imported image at(which line)'}: ${importRangeArr.reduce((acc, i) => (acc += `${i.start.line + 1},`, acc), '')}`;
      const textEdit = vscode.TextEdit.replace(range, commentText);

      const workspaceEdit = new vscode.WorkspaceEdit();
      workspaceEdit.set(document.uri, [textEdit]);
      vscode.workspace.applyEdit(workspaceEdit);
    }

    if (!isLocal) {
      vscode.window.showInformationMessage(language === 'zh' ? `本地图片${name} 替换 cdn 地址成功` : `Replace the CDN URL with the local image URL successfully: ${name}`);
    }

    const refs = await vscode.workspace.findFiles(name, '**​/node_modules/**', Infinity);
    console.log(refs, '看看refs');


    const config = vscode.workspace.getConfiguration('img2cdn');
    const deleteLocalImage = config.get('deleteLocalImage');

    if (isLocal && deleteLocalImage) {
      vscode.window.showInformationMessage(
        language === 'zh'
          ? `替换 cdn 地址成功，是否将本地图片 ${name} 删除?`
          : `The replacement of the image URL with the CDN URL was successful. Do you agree to delete the local image: ${name}?`,
        { modal: true },
        'Yes',
        'No',
      ).then(result => {
        if (result === 'Yes') {
          fs.unlinkSync(originalImagePath);
          vscode.window.showInformationMessage(`本地图片删除成功: ${name}`);
        }
      });
    }
  } catch (error) {
    console.error(`Failed to replace CDN URL: ${cdnUrl}`, error);
    vscode.window.showErrorMessage(language === 'zh' ? `${getBasenameFormUrl(originalImagePath)} 替换 cdn 地址失败: ${cdnUrl}` : `Failed to replace CDN URL: ${cdnUrl}`);
  }
}

function deactivate() { }

module.exports = {
  activate,
  deactivate,
};