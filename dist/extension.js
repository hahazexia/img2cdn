'use strict';

function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function asyncGeneratorStep(n, t, e, r, o, a, c) {
  try {
    var i = n[a](c),
      u = i.value;
  } catch (n) {
    return void e(n);
  }
  i.done ? t(u) : Promise.resolve(u).then(r, o);
}
function _asyncToGenerator(n) {
  return function () {
    var t = this,
      e = arguments;
    return new Promise(function (r, o) {
      var a = n.apply(t, e);
      function _next(n) {
        asyncGeneratorStep(a, r, o, _next, _throw, "next", n);
      }
      function _throw(n) {
        asyncGeneratorStep(a, r, o, _next, _throw, "throw", n);
      }
      _next(void 0);
    });
  };
}
function _classCallCheck(a, n) {
  if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o);
  }
}
function _createClass(e, r, t) {
  return r && _defineProperties(e.prototype, r), Object.defineProperty(e, "prototype", {
    writable: !1
  }), e;
}
function _createForOfIteratorHelper(r, e) {
  var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (!t) {
    if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e) {
      t && (r = t);
      var n = 0,
        F = function () {};
      return {
        s: F,
        n: function () {
          return n >= r.length ? {
            done: !0
          } : {
            done: !1,
            value: r[n++]
          };
        },
        e: function (r) {
          throw r;
        },
        f: F
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var o,
    a = !0,
    u = !1;
  return {
    s: function () {
      t = t.call(r);
    },
    n: function () {
      var r = t.next();
      return a = r.done, r;
    },
    e: function (r) {
      u = !0, o = r;
    },
    f: function () {
      try {
        a || null == t.return || t.return();
      } finally {
        if (u) throw o;
      }
    }
  };
}
function _regeneratorRuntime() {
  _regeneratorRuntime = function () {
    return e;
  };
  var t,
    e = {},
    r = Object.prototype,
    n = r.hasOwnProperty,
    o = Object.defineProperty || function (t, e, r) {
      t[e] = r.value;
    },
    i = "function" == typeof Symbol ? Symbol : {},
    a = i.iterator || "@@iterator",
    c = i.asyncIterator || "@@asyncIterator",
    u = i.toStringTag || "@@toStringTag";
  function define(t, e, r) {
    return Object.defineProperty(t, e, {
      value: r,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }), t[e];
  }
  try {
    define({}, "");
  } catch (t) {
    define = function (t, e, r) {
      return t[e] = r;
    };
  }
  function wrap(t, e, r, n) {
    var i = e && e.prototype instanceof Generator ? e : Generator,
      a = Object.create(i.prototype),
      c = new Context(n || []);
    return o(a, "_invoke", {
      value: makeInvokeMethod(t, r, c)
    }), a;
  }
  function tryCatch(t, e, r) {
    try {
      return {
        type: "normal",
        arg: t.call(e, r)
      };
    } catch (t) {
      return {
        type: "throw",
        arg: t
      };
    }
  }
  e.wrap = wrap;
  var h = "suspendedStart",
    l = "suspendedYield",
    f = "executing",
    s = "completed",
    y = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  var p = {};
  define(p, a, function () {
    return this;
  });
  var d = Object.getPrototypeOf,
    v = d && d(d(values([])));
  v && v !== r && n.call(v, a) && (p = v);
  var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p);
  function defineIteratorMethods(t) {
    ["next", "throw", "return"].forEach(function (e) {
      define(t, e, function (t) {
        return this._invoke(e, t);
      });
    });
  }
  function AsyncIterator(t, e) {
    function invoke(r, o, i, a) {
      var c = tryCatch(t[r], t, o);
      if ("throw" !== c.type) {
        var u = c.arg,
          h = u.value;
        return h && "object" == typeof h && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) {
          invoke("next", t, i, a);
        }, function (t) {
          invoke("throw", t, i, a);
        }) : e.resolve(h).then(function (t) {
          u.value = t, i(u);
        }, function (t) {
          return invoke("throw", t, i, a);
        });
      }
      a(c.arg);
    }
    var r;
    o(this, "_invoke", {
      value: function (t, n) {
        function callInvokeWithMethodAndArg() {
          return new e(function (e, r) {
            invoke(t, n, e, r);
          });
        }
        return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      }
    });
  }
  function makeInvokeMethod(e, r, n) {
    var o = h;
    return function (i, a) {
      if (o === f) throw Error("Generator is already running");
      if (o === s) {
        if ("throw" === i) throw a;
        return {
          value: t,
          done: !0
        };
      }
      for (n.method = i, n.arg = a;;) {
        var c = n.delegate;
        if (c) {
          var u = maybeInvokeDelegate(c, n);
          if (u) {
            if (u === y) continue;
            return u;
          }
        }
        if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) {
          if (o === h) throw o = s, n.arg;
          n.dispatchException(n.arg);
        } else "return" === n.method && n.abrupt("return", n.arg);
        o = f;
        var p = tryCatch(e, r, n);
        if ("normal" === p.type) {
          if (o = n.done ? s : l, p.arg === y) continue;
          return {
            value: p.arg,
            done: n.done
          };
        }
        "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg);
      }
    };
  }
  function maybeInvokeDelegate(e, r) {
    var n = r.method,
      o = e.iterator[n];
    if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y;
    var i = tryCatch(o, e.iterator, r.arg);
    if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y;
    var a = i.arg;
    return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y);
  }
  function pushTryEntry(t) {
    var e = {
      tryLoc: t[0]
    };
    1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e);
  }
  function resetTryEntry(t) {
    var e = t.completion || {};
    e.type = "normal", delete e.arg, t.completion = e;
  }
  function Context(t) {
    this.tryEntries = [{
      tryLoc: "root"
    }], t.forEach(pushTryEntry, this), this.reset(!0);
  }
  function values(e) {
    if (e || "" === e) {
      var r = e[a];
      if (r) return r.call(e);
      if ("function" == typeof e.next) return e;
      if (!isNaN(e.length)) {
        var o = -1,
          i = function next() {
            for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next;
            return next.value = t, next.done = !0, next;
          };
        return i.next = i;
      }
    }
    throw new TypeError(typeof e + " is not iterable");
  }
  return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", {
    value: GeneratorFunctionPrototype,
    configurable: !0
  }), o(GeneratorFunctionPrototype, "constructor", {
    value: GeneratorFunction,
    configurable: !0
  }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) {
    var e = "function" == typeof t && t.constructor;
    return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name));
  }, e.mark = function (t) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t;
  }, e.awrap = function (t) {
    return {
      __await: t
    };
  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () {
    return this;
  }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) {
    void 0 === i && (i = Promise);
    var a = new AsyncIterator(wrap(t, r, n, o), i);
    return e.isGeneratorFunction(r) ? a : a.next().then(function (t) {
      return t.done ? t.value : a.next();
    });
  }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () {
    return this;
  }), define(g, "toString", function () {
    return "[object Generator]";
  }), e.keys = function (t) {
    var e = Object(t),
      r = [];
    for (var n in e) r.push(n);
    return r.reverse(), function next() {
      for (; r.length;) {
        var t = r.pop();
        if (t in e) return next.value = t, next.done = !1, next;
      }
      return next.done = !0, next;
    };
  }, e.values = values, Context.prototype = {
    constructor: Context,
    reset: function (e) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t);
    },
    stop: function () {
      this.done = !0;
      var t = this.tryEntries[0].completion;
      if ("throw" === t.type) throw t.arg;
      return this.rval;
    },
    dispatchException: function (e) {
      if (this.done) throw e;
      var r = this;
      function handle(n, o) {
        return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o;
      }
      for (var o = this.tryEntries.length - 1; o >= 0; --o) {
        var i = this.tryEntries[o],
          a = i.completion;
        if ("root" === i.tryLoc) return handle("end");
        if (i.tryLoc <= this.prev) {
          var c = n.call(i, "catchLoc"),
            u = n.call(i, "finallyLoc");
          if (c && u) {
            if (this.prev < i.catchLoc) return handle(i.catchLoc, !0);
            if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
          } else if (c) {
            if (this.prev < i.catchLoc) return handle(i.catchLoc, !0);
          } else {
            if (!u) throw Error("try statement without catch or finally");
            if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
          }
        }
      }
    },
    abrupt: function (t, e) {
      for (var r = this.tryEntries.length - 1; r >= 0; --r) {
        var o = this.tryEntries[r];
        if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) {
          var i = o;
          break;
        }
      }
      i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null);
      var a = i ? i.completion : {};
      return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a);
    },
    complete: function (t, e) {
      if ("throw" === t.type) throw t.arg;
      return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y;
    },
    finish: function (t) {
      for (var e = this.tryEntries.length - 1; e >= 0; --e) {
        var r = this.tryEntries[e];
        if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y;
      }
    },
    catch: function (t) {
      for (var e = this.tryEntries.length - 1; e >= 0; --e) {
        var r = this.tryEntries[e];
        if (r.tryLoc === t) {
          var n = r.completion;
          if ("throw" === n.type) {
            var o = n.arg;
            resetTryEntry(r);
          }
          return o;
        }
      }
      throw Error("illegal catch attempt");
    },
    delegateYield: function (e, r, n) {
      return this.delegate = {
        iterator: values(e),
        resultName: r,
        nextLoc: n
      }, "next" === this.method && (this.arg = t), y;
    }
  }, e;
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (String )(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}

var vscode = require('vscode');
var axios = require('axios');
var fs = require('fs');
var path = require('path');
var url = require('url');
var os = require('os');
var FormData = require('form-data');
var sizeOf = require('image-size');
var tmp = require('tmp');

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

var tempDir = os.tmpdir();
var tempPath = path.join(tempDir, "./img2cdntemp");
if (!fs.existsSync(tempPath)) {
  fs.mkdirSync(tempPath, {
    recursive: true
  });
}
var imageCache = new Map();
tmp.setGracefulCleanup();
var language = 'en'; // en zh

function activate(context) {
  var config = vscode.workspace.getConfiguration('img2cdn');
  language = config.get('language');
  context.subscriptions.push(vscode.languages.registerCodeLensProvider('*', new ImageCodeLensProvider()));
  context.subscriptions.push(vscode.languages.registerHoverProvider('*', new ImageHoverProvider()));
  context.subscriptions.push(vscode.commands.registerCommand('extension.uploadImage', /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(imagePath, document, range, importRangeArr) {
      var res, editor, _document, absolutePath;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            res = isUrl(imagePath);
            if (!res) {
              _context.next = 6;
              break;
            }
            _context.next = 4;
            return downloadAndUpload(imagePath, document, range, importRangeArr);
          case 4:
            _context.next = 11;
            break;
          case 6:
            editor = vscode.window.activeTextEditor;
            _document = editor.document;
            absolutePath = path.resolve(_document.uri.fsPath, '..', imagePath);
            _context.next = 11;
            return upload(absolutePath, _document, range, importRangeArr, true);
          case 11:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function (_x, _x2, _x3, _x4) {
      return _ref.apply(this, arguments);
    };
  }()));
}
var ImageCodeLensProvider = /*#__PURE__*/function () {
  function ImageCodeLensProvider() {
    _classCallCheck(this, ImageCodeLensProvider);
  }
  return _createClass(ImageCodeLensProvider, [{
    key: "provideCodeLenses",
    value: function provideCodeLenses(document, token) {
      try {
        var imageRegex = /(import\s*([^\s]+)\s*from\s*)?(['"`]|url\(['"`]?|src=['"`])(.*\.(?:png|jpg|jpeg|gif|bmp|svg))/g;
        var content = document.getText();
        var codeLenses = [];
        var config = vscode.workspace.getConfiguration('img2cdn');
        var imagePathWhitelist = JSON.parse(config.get('imagePathWhitelist'));
        var match;
        var _loop = function _loop() {
          var imagePath = match[4];
          if (imagePathWhitelist.some(function (i) {
            return imagePath.includes(i);
          })) return 1; // continue
          var prefix = match[3];
          var importModuleName = match[2];
          var importPrefix = match[1];
          var isQuotation = prefix.startsWith('"') || prefix.startsWith("'") || prefix.startsWith('`');
          var isUrl = prefix.startsWith('url');
          var isSrc = prefix.startsWith('src');
          var isUrlSrcQuotation = (isUrl || isSrc) && (prefix.endsWith('"') || prefix.endsWith("'") || prefix.endsWith('`'));
          var isImport = Boolean(importModuleName);
          var start = match.index;
          var end = match.index + imagePath.length;
          if (isQuotation) {
            end += 2;
          }
          if (isUrl) {
            start += 4;
            if (isUrlSrcQuotation) {
              end += 4 + 2;
            } else {
              end += 4;
            }
          }
          if (isSrc) {
            start += 4;
            end += 4 + 2;
          }
          if (isImport) {
            start += importPrefix.length;
            end += importPrefix.length;
          }
          var importRangeArr = [];
          if (isImport) {
            var importModuleMatch = new RegExp("[^a-zA-Z$_0-9]".concat(importModuleName, "(?=[\\s;.,(){}[\\]])"), 'g');
            var matches = document.getText().matchAll(importModuleMatch);
            var _iterator = _createForOfIteratorHelper(matches),
              _step;
            try {
              for (_iterator.s(); !(_step = _iterator.n()).done;) {
                var _match = _step.value;
                var tempStart = _match.index + 1;
                var tempEnd = tempStart + importModuleName.length;
                var temp = new vscode.Range(document.positionAt(tempStart), document.positionAt(tempEnd));
                importRangeArr.push(temp);
              }
            } catch (err) {
              _iterator.e(err);
            } finally {
              _iterator.f();
            }
          }
          var range = new vscode.Range(document.positionAt(start), document.positionAt(end));
          var command = {
            title: language === 'zh' ? '上传到CDN' : 'Upload to CDN',
            command: 'extension.uploadImage',
            arguments: [imagePath, document, range, importRangeArr]
          };
          codeLenses.push(new vscode.CodeLens(range, command));
        };
        while ((match = imageRegex.exec(content)) !== null) {
          if (_loop()) continue;
        }
        return codeLenses;
      } catch (err) {
        console.error(err);
        vscode.window.showErrorMessage(language === 'zh' ? "\u521B\u5EFA code lens \u5BF9\u8C61\u5931\u8D25: ".concat(err) : "Failed to provide code lenses: ".concat(err));
      }
    }
  }]);
}();
var ImageHoverProvider = /*#__PURE__*/function () {
  function ImageHoverProvider() {
    _classCallCheck(this, ImageHoverProvider);
  }
  return _createClass(ImageHoverProvider, [{
    key: "provideHover",
    value: function () {
      var _provideHover = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(document, position, token) {
        var imageRegex, range, imagePath, absoluteImagePath, localImagePath, dimensions, filesize, maxSizeConfig, mdString, markdownImage;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              imageRegex = /(import\s*([^\s]+)\s*from\s*)?(['"`]|url\(['"`]?|src=['"`])(.*\.(?:png|jpg|jpeg|gif|bmp|svg))/g;
              range = document.getWordRangeAtPosition(position, imageRegex);
              if (!range) {
                _context2.next = 25;
                break;
              }
              imagePath = document.getText(range);
              imagePath = imagePath.replace(/^import\s*([^\s]+)\s*from\s*|['"`]|url\(['"`]?|src=['"`]/g, '');
              absoluteImagePath = imagePath.startsWith('http') ? imagePath : vscode.Uri.file(path.resolve(document.uri.fsPath, '..', imagePath)).toString().replace(/file:\/*/g, '');
              if (!absoluteImagePath.startsWith('http')) {
                _context2.next = 12;
                break;
              }
              _context2.next = 9;
              return download(absoluteImagePath);
            case 9:
              _context2.t0 = _context2.sent;
              _context2.next = 13;
              break;
            case 12:
              _context2.t0 = absoluteImagePath;
            case 13:
              localImagePath = _context2.t0;
              dimensions = getFileDimensions(localImagePath);
              _context2.next = 17;
              return getFilesize(localImagePath);
            case 17:
              filesize = _context2.sent;
              if (dimensions.width > dimensions.height) {
                maxSizeConfig = "|width=".concat(dimensions.width > 500 ? 500 : dimensions.width);
              } else {
                maxSizeConfig = "|height=".concat(dimensions.height > 500 ? 500 : dimensions.height);
              }
              mdString = "\r\n\r\n  ".concat(language === 'zh' ? '图片尺寸' : 'Intrinsic Size', ": ").concat(dimensions.width, "x").concat(dimensions.height);
              mdString += "\r\n\r\n  ".concat(language === 'zh' ? '文件大小' : 'File Size', ": ").concat(filesize);
              mdString += "\r\n\r\n  ![Image Preview](".concat(absoluteImagePath).concat(maxSizeConfig, ")");
              markdownImage = new vscode.MarkdownString(mdString);
              markdownImage.isTrusted = true;
              return _context2.abrupt("return", new vscode.Hover(markdownImage));
            case 25:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }));
      function provideHover(_x5, _x6, _x7) {
        return _provideHover.apply(this, arguments);
      }
      return provideHover;
    }()
  }]);
}();
function getFileDimensions(source) {
  try {
    console.log(sizeOf, 'sizeOf 看看');
    var dimensions = sizeOf(source);
    console.log(dimensions.width, dimensions.height);
    return dimensions;
  } catch (err) {
    console.error("Failed to get file dimensions: ".concat(source), err);
    vscode.window.showInformationMessage(language === 'zh' ? "\u83B7\u53D6\u56FE\u7247\u5BBD\u9AD8\u5931\u8D25: ".concat(source) : "Failed to get file dimensions: ".concat(source));
  }
}
function getFilesize(_x8) {
  return _getFilesize.apply(this, arguments);
}
function _getFilesize() {
  _getFilesize = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(source) {
    var fsStat, _yield$import, filesize;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          fsStat = fs.statSync(source);
          _context3.next = 4;
          return import('filesize');
        case 4:
          _yield$import = _context3.sent;
          filesize = _yield$import.filesize;
          return _context3.abrupt("return", filesize(fsStat.size, {
            standard: 'jedec'
          }));
        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](0);
          console.error("Failed to get filesize: ".concat(source), _context3.t0);
          vscode.window.showInformationMessage(language === 'zh' ? "\u83B7\u53D6\u56FE\u7247\u5927\u5C0F\u5931\u8D25: ".concat(source) : "Failed to get filesize: ".concat(source));
          return _context3.abrupt("return", '');
        case 14:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 9]]);
  }));
  return _getFilesize.apply(this, arguments);
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
function download(_x9) {
  return _download.apply(this, arguments);
}
function _download() {
  _download = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(imageUrl) {
    var response, tempFile, filePath, writer;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          if (!imageCache.has(imageUrl)) {
            _context4.next = 3;
            break;
          }
          return _context4.abrupt("return", imageCache.get(imageUrl));
        case 3:
          _context4.next = 5;
          return axios({
            method: 'get',
            url: imageUrl,
            responseType: 'stream'
          });
        case 5:
          response = _context4.sent;
          tempFile = tmp.fileSync({
            tmpdir: tempPath,
            postfix: imageUrl ? path.parse(imageUrl).ext : '.png'
          });
          filePath = tempFile.name;
          writer = fs.createWriteStream(filePath);
          response.data.pipe(writer);
          _context4.next = 12;
          return new Promise(function (resolve, reject) {
            writer.on('finish', resolve);
            writer.on('error', reject);
          });
        case 12:
          imageCache.set(imageUrl, filePath);
          return _context4.abrupt("return", filePath);
        case 16:
          _context4.prev = 16;
          _context4.t0 = _context4["catch"](0);
          console.error("Failed to download image: ".concat(imageUrl), _context4.t0);
          vscode.window.showErrorMessage(language === 'zh' ? "\u4E0B\u8F7D\u56FE\u7247\u5931\u8D25: ".concat(imageUrl) : "Failed to download image: ".concat(imageUrl));
        case 20:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 16]]);
  }));
  return _download.apply(this, arguments);
}
function downloadAndUpload(_x10, _x11, _x12, _x13) {
  return _downloadAndUpload.apply(this, arguments);
}
function _downloadAndUpload() {
  _downloadAndUpload = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(imageUrl, document, range, importRangeArr) {
    var resFilePath;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return download(imageUrl);
        case 3:
          resFilePath = _context5.sent;
          _context5.next = 6;
          return upload(resFilePath, document, range, importRangeArr);
        case 6:
          _context5.next = 12;
          break;
        case 8:
          _context5.prev = 8;
          _context5.t0 = _context5["catch"](0);
          console.error("Failed to download and upload image: ".concat(imageUrl), _context5.t0);
          vscode.window.showErrorMessage(language === 'zh' ? "\u4E0B\u8F7D\u5E76\u4E0A\u4F20\u56FE\u7247\u5931\u8D25: ".concat(imageUrl) : "Failed to download and upload image: ".concat(imageUrl));
        case 12:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[0, 8]]);
  }));
  return _downloadAndUpload.apply(this, arguments);
}
function upload(_x14, _x15, _x16, _x17, _x18) {
  return _upload.apply(this, arguments);
}
function _upload() {
  _upload = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(imagePath, document, range, importRangeArr, isLocal) {
    var config, uploadUrl, resKey, extension, form, res, data;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          config = vscode.workspace.getConfiguration('img2cdn');
          uploadUrl = config.get('uploadApiUrl');
          resKey = config.get('uploadApiResKey').split('.');
          resKey.shift();
          extension = path.extname(imagePath);
          form = new FormData();
          form.append('file', fs.createReadStream(imagePath));
          form.append('extension', extension);
          _context6.next = 11;
          return axios.post(uploadUrl, form, {
            headers: form.getHeaders()
          });
        case 11:
          res = _context6.sent;
          resKey.forEach(function (key) {
            data = data ? data[key] : res[key];
          });
          console.log("Image uploaded: ".concat(data));
          _context6.next = 16;
          return replaceImage(data, document, range, imagePath, importRangeArr, isLocal);
        case 16:
          _context6.next = 22;
          break;
        case 18:
          _context6.prev = 18;
          _context6.t0 = _context6["catch"](0);
          console.error("Failed to upload image: ".concat(imagePath), _context6.t0);
          vscode.window.showErrorMessage(language === 'zh' ? "\u4E0A\u4F20\u56FE\u7247\u5931\u8D25: ".concat(imagePath) : "Failed to upload image: ".concat(imagePath));
        case 22:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[0, 18]]);
  }));
  return _upload.apply(this, arguments);
}
function replaceImage(_x19, _x20, _x21, _x22, _x23, _x24) {
  return _replaceImage.apply(this, arguments);
}
function _replaceImage() {
  _replaceImage = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(cdnUrl, document, range, originalImagePath, importRangeArr, isLocal) {
    var name, edit, importLineRange, _edit, lineNumber, line, startPosition, endPosition, _range, commentText, textEdit, workspaceEdit, refs;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          name = getBasenameFormUrl(originalImagePath);
          edit = new vscode.WorkspaceEdit();
          edit.replace(document.uri, range, "'".concat(cdnUrl, "'"));
          _context7.next = 6;
          return vscode.workspace.applyEdit(edit);
        case 6:
          if (!(importRangeArr.length > 0)) {
            _context7.next = 22;
            break;
          }
          importLineRange = importRangeArr.shift();
          _edit = new vscode.WorkspaceEdit();
          importRangeArr.forEach(function (item) {
            _edit.replace(document.uri, item, "'".concat(cdnUrl, "'"));
          });
          _context7.next = 12;
          return vscode.workspace.applyEdit(_edit);
        case 12:
          lineNumber = importLineRange.start.line;
          line = document.lineAt(lineNumber);
          startPosition = new vscode.Position(lineNumber, 0);
          endPosition = line.range.end;
          _range = new vscode.Range(startPosition, endPosition);
          commentText = '// ' + document.getText(_range) + " ".concat(language === 'zh' ? '替换import图片位置(第几行)' : 'Replace imported image at(which line)', ": ").concat(importRangeArr.reduce(function (acc, i) {
            return acc += "".concat(i.start.line + 1, ","), acc;
          }, ''));
          textEdit = vscode.TextEdit.replace(_range, commentText);
          workspaceEdit = new vscode.WorkspaceEdit();
          workspaceEdit.set(document.uri, [textEdit]);
          vscode.workspace.applyEdit(workspaceEdit);
        case 22:
          if (!isLocal) {
            vscode.window.showInformationMessage(language === 'zh' ? "\u672C\u5730\u56FE\u7247".concat(name, " \u66FF\u6362 cdn \u5730\u5740\u6210\u529F") : "Replace the CDN URL with the local image URL successfully: ".concat(name));
          }
          _context7.next = 25;
          return vscode.workspace.findFiles(name, '**​/node_modules/**', Infinity);
        case 25:
          refs = _context7.sent;
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
          _context7.next = 33;
          break;
        case 29:
          _context7.prev = 29;
          _context7.t0 = _context7["catch"](0);
          console.error("Failed to replace CDN URL: ".concat(cdnUrl), _context7.t0);
          vscode.window.showErrorMessage(language === 'zh' ? "".concat(getBasenameFormUrl(originalImagePath), " \u66FF\u6362 cdn \u5730\u5740\u5931\u8D25: ").concat(cdnUrl) : "Failed to replace CDN URL: ".concat(cdnUrl));
        case 33:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[0, 29]]);
  }));
  return _replaceImage.apply(this, arguments);
}
function deactivate() {}
module.exports = {
  activate: activate,
  deactivate: deactivate
};
