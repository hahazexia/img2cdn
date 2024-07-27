# img2cdn

Upload image to cdn, Visual Studio Code Extension

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `img2cdn.uploadApiUrl`: backend api url for upload image.
* `img2cdn.uploadApiResKey`: After the plugin sends a request to upload an image and receives a response, it will obtain the image URL according to the format of the `uploadApiResKey` field, such as `res.data.data`.
* `img2cdn.language`: default message language, `en` or `zh`.
* `img2cdn.imagePathWhitelist`: string array, if image url includes some string in imagePathWhitelist, there will not show upload btn.

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
