const vscode = require('vscode');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const url = require('url');
const os = require('os');
const FormData = require('form-data');
const sizeOf = require('image-size');
const tmp = require('tmp');

// import * as vscode from 'vscode';
// import axios from 'axios';
// import fs from 'fs';
// import path from 'path';
// import url from 'url';
// import os from 'os';
// import FormData from 'form-data';
// import sizeOf from 'image-size';
// import tmp from 'tmp';
// import {filesize} from 'filesize';

const tempDir = os.tmpdir();
const tempPath = path.join(tempDir, `./img2cdntemp`);
if (!fs.existsSync(tempPath)) {
  fs.mkdirSync(tempPath, { recursive: true });
}``

const imageCache = new Map();
tmp.setGracefulCleanup();

let language = 'en'; // en zh

function activate(context) {
  const config = vscode.workspace.getConfiguration('img2cdn');
  language = config.get('language');
  context.subscriptions.push(
    vscode.languages.registerCodeLensProvider('*', new ImageCodeLensProvider())
  );
  context.subscriptions.push(
    vscode.languages.registerHoverProvider('*', new ImageHoverProvider())
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('extension.uploadImage', async (imagePath, document, range, importRangeArr) => {
      const res = isUrl(imagePath);
      if (res) {
        await downloadAndUpload(imagePath, document, range, importRangeArr);
      } else {
        const editor = vscode.window.activeTextEditor;
        const document = editor.document;
        const absolutePath = path.resolve(document.uri.fsPath, '..', imagePath);
        await upload(absolutePath, document, range, importRangeArr, true);
      }
    })
  );
}

class ImageCodeLensProvider {
  provideCodeLenses(document, token) {
    try {
      const imageRegex = /(import\s*([^\s]+)\s*from\s*)?(['"`]|url\(['"`]?|src=['"`])(.*\.(?:png|jpg|jpeg|gif|bmp|svg))/g;
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
          document.positionAt(end)
        );
        const command = {
          title: language === 'zh' ? '上传到CDN' : 'Upload to CDN',
          command: 'extension.uploadImage',
          arguments: [imagePath, document, range, importRangeArr],
        };
        codeLenses.push(new vscode.CodeLens(range, command));
      }
  
      return codeLenses;
    } catch (err) {
      console.error(err);
      vscode.window.showErrorMessage(language === 'zh' ? `创建 code lens 对象失败: ${err}` : `Failed to provide code lenses: ${err}`);
    }
  }
}

class ImageHoverProvider {
  async provideHover(document, position, token) {
    const imageRegex = /(import\s*([^\s]+)\s*from\s*)?(['"`]|url\(['"`]?|src=['"`])(.*\.(?:png|jpg|jpeg|gif|bmp|svg))/g;
    const range = document.getWordRangeAtPosition(position, imageRegex);

    if (range) {
      let imagePath = document.getText(range);
      imagePath = imagePath.replace(/^import\s*([^\s]+)\s*from\s*|['"`]|url\(['"`]?|src=['"`]/g, '');
      const absoluteImagePath = imagePath.startsWith('http') ? imagePath : vscode.Uri.file(path.resolve(document.uri.fsPath, '..', imagePath)).toString().replace(/file:\/*/g, '');
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

function getFileDimensions (source) {
  try {
    console.log(sizeOf, 'sizeOf 看看');
    const dimensions = sizeOf(source);
    console.log(dimensions.width, dimensions.height)
    return dimensions;
  } catch (err) {
    console.error(`Failed to get file dimensions: ${source}`, err);
    vscode.window.showErrorMessage(language === 'zh' ? `获取图片宽高失败: ${source}` : `Failed to get file dimensions: ${source}`);
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
function getBasenameFormUrl(urlStr)  {
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

async function downloadAndUpload(imageUrl, document, range, importRangeArr) {
  try {
    const resFilePath = await download(imageUrl);

    await upload(resFilePath, document, range, importRangeArr);
  } catch (error) {
    console.error(`Failed to download and upload image: ${imageUrl}`, error);
    vscode.window.showErrorMessage(language === 'zh' ? `下载并上传图片失败: ${imageUrl}` : `Failed to download and upload image: ${imageUrl}`);
  }
}

async function upload(imagePath, document, range, importRangeArr, isLocal) {
  try {
    const config = vscode.workspace.getConfiguration('img2cdn');
    const uploadUrl = config.get('uploadApiUrl');
    const resKey = config.get('uploadApiResKey').split('.');
    resKey.shift();

    const extension = path.extname(imagePath);
    const form = new FormData();
    form.append('file', fs.createReadStream(imagePath));
    form.append('extension', extension);

    const res = await axios.post(uploadUrl, form, {
      headers: form.getHeaders()
    });
    let data;
    resKey.forEach((key) => {
      data = data ? data[key] : res[key];
    });

    console.log(`Image uploaded: ${data}`);

    await replaceImage(data, document, range, imagePath, importRangeArr, isLocal);
  } catch (error) {
    console.error(`Failed to upload image: ${imagePath}`, error);
    vscode.window.showErrorMessage(language === 'zh' ? `上传图片失败: ${imagePath}` : `Failed to upload image: ${imagePath}`);
  }
}

async function replaceImage(cdnUrl, document, range, originalImagePath, importRangeArr, isLocal) {
  try {
    const name = getBasenameFormUrl(originalImagePath);
    const edit = new vscode.WorkspaceEdit();
    edit.replace(document.uri, range, `'${cdnUrl}'`);
    await vscode.workspace.applyEdit(edit);

    if (importRangeArr.length > 0) {
      const importLineRange = importRangeArr.shift();

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


    // if (isLocal) {
    //   vscode.window.showInformationMessage(
    //     // `The replacement of the image URL with the CDN URL was successful. Do you agree to delete the local image: ${name}?`,
    //     `替换 cdn 地址成功，是否将本地图片 ${name} 删除?`,
    //     { modal: true },
    //     'Yes',
    //     'No',
    //   ).then(result => {
    //     if (result === 'Yes') {
    //       fs.unlinkSync(originalImagePath);
    //       vscode.window.showInformationMessage(`本地图片删除成功: ${name}`);
    //     }
    //   });
    // }
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