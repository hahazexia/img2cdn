'use strict';

var extension = require('./extension--9SmsAw5.js');
require('vscode');
require('util');
require('stream');
require('path');
require('http');
require('https');
require('url');
require('fs');
require('assert');
require('tty');
require('os');
require('zlib');
require('events');
require('crypto');

/**
 * filesize
 *
 * @copyright 2024 Jason Mulligan <jason.mulligan@avoidwork.com>
 * @license BSD-3-Clause
 * @version 10.1.4
 */
var ARRAY = "array";
var BIT = "bit";
var BITS = "bits";
var BYTE = "byte";
var BYTES = "bytes";
var EMPTY = "";
var EXPONENT = "exponent";
var FUNCTION = "function";
var IEC = "iec";
var INVALID_NUMBER = "Invalid number";
var INVALID_ROUND = "Invalid rounding method";
var JEDEC = "jedec";
var OBJECT = "object";
var PERIOD = ".";
var ROUND = "round";
var S = "s";
var SI = "si";
var SI_KBIT = "kbit";
var SI_KBYTE = "kB";
var SPACE = " ";
var STRING = "string";
var ZERO = "0";
var STRINGS = {
  symbol: {
    iec: {
      bits: ["bit", "Kibit", "Mibit", "Gibit", "Tibit", "Pibit", "Eibit", "Zibit", "Yibit"],
      bytes: ["B", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"]
    },
    jedec: {
      bits: ["bit", "Kbit", "Mbit", "Gbit", "Tbit", "Pbit", "Ebit", "Zbit", "Ybit"],
      bytes: ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    }
  },
  fullform: {
    iec: ["", "kibi", "mebi", "gibi", "tebi", "pebi", "exbi", "zebi", "yobi"],
    jedec: ["", "kilo", "mega", "giga", "tera", "peta", "exa", "zetta", "yotta"]
  }
};
function filesize(arg) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
    _ref$bits = _ref.bits,
    bits = _ref$bits === void 0 ? false : _ref$bits,
    _ref$pad = _ref.pad,
    pad = _ref$pad === void 0 ? false : _ref$pad,
    _ref$base = _ref.base,
    base = _ref$base === void 0 ? -1 : _ref$base,
    _ref$round = _ref.round,
    round = _ref$round === void 0 ? 2 : _ref$round,
    _ref$locale = _ref.locale,
    locale = _ref$locale === void 0 ? EMPTY : _ref$locale,
    _ref$localeOptions = _ref.localeOptions,
    localeOptions = _ref$localeOptions === void 0 ? {} : _ref$localeOptions,
    _ref$separator = _ref.separator,
    separator = _ref$separator === void 0 ? EMPTY : _ref$separator,
    _ref$spacer = _ref.spacer,
    spacer = _ref$spacer === void 0 ? SPACE : _ref$spacer,
    _ref$symbols = _ref.symbols,
    symbols = _ref$symbols === void 0 ? {} : _ref$symbols,
    _ref$standard = _ref.standard,
    standard = _ref$standard === void 0 ? EMPTY : _ref$standard,
    _ref$output = _ref.output,
    output = _ref$output === void 0 ? STRING : _ref$output,
    _ref$fullform = _ref.fullform,
    fullform = _ref$fullform === void 0 ? false : _ref$fullform,
    _ref$fullforms = _ref.fullforms,
    fullforms = _ref$fullforms === void 0 ? [] : _ref$fullforms,
    _ref$exponent = _ref.exponent,
    exponent = _ref$exponent === void 0 ? -1 : _ref$exponent,
    _ref$roundingMethod = _ref.roundingMethod,
    roundingMethod = _ref$roundingMethod === void 0 ? ROUND : _ref$roundingMethod,
    _ref$precision = _ref.precision,
    precision = _ref$precision === void 0 ? 0 : _ref$precision;
  var e = exponent,
    num = Number(arg),
    result = [],
    val = 0,
    u = EMPTY;

  // Sync base & standard
  if (standard === SI) {
    base = 10;
    standard = JEDEC;
  } else if (standard === IEC || standard === JEDEC) {
    base = 2;
  } else if (base === 2) {
    standard = IEC;
  } else {
    base = 10;
    standard = JEDEC;
  }
  var ceil = base === 10 ? 1000 : 1024,
    full = fullform === true,
    neg = num < 0,
    roundingFunc = Math[roundingMethod];
  if (typeof arg !== "bigint" && isNaN(arg)) {
    throw new TypeError(INVALID_NUMBER);
  }
  if (extension._typeof(roundingFunc) !== FUNCTION) {
    throw new TypeError(INVALID_ROUND);
  }

  // Flipping a negative number to determine the size
  if (neg) {
    num = -num;
  }

  // Determining the exponent
  if (e === -1 || isNaN(e)) {
    e = Math.floor(Math.log(num) / Math.log(ceil));
    if (e < 0) {
      e = 0;
    }
  }

  // Exceeding supported length, time to reduce & multiply
  if (e > 8) {
    if (precision > 0) {
      precision += 8 - e;
    }
    e = 8;
  }
  if (output === EXPONENT) {
    return e;
  }

  // Zero is now a special case because bytes divide by 1
  if (num === 0) {
    result[0] = 0;
    u = result[1] = STRINGS.symbol[standard][bits ? BITS : BYTES][e];
  } else {
    val = num / (base === 2 ? Math.pow(2, e * 10) : Math.pow(1000, e));
    if (bits) {
      val = val * 8;
      if (val >= ceil && e < 8) {
        val = val / ceil;
        e++;
      }
    }
    var p = Math.pow(10, e > 0 ? round : 0);
    result[0] = roundingFunc(val * p) / p;
    if (result[0] === ceil && e < 8 && exponent === -1) {
      result[0] = 1;
      e++;
    }
    u = result[1] = base === 10 && e === 1 ? bits ? SI_KBIT : SI_KBYTE : STRINGS.symbol[standard][bits ? BITS : BYTES][e];
  }

  // Decorating a 'diff'
  if (neg) {
    result[0] = -result[0];
  }

  // Setting optional precision
  if (precision > 0) {
    result[0] = result[0].toPrecision(precision);
  }

  // Applying custom symbol
  result[1] = symbols[result[1]] || result[1];
  if (locale === true) {
    result[0] = result[0].toLocaleString();
  } else if (locale.length > 0) {
    result[0] = result[0].toLocaleString(locale, localeOptions);
  } else if (separator.length > 0) {
    result[0] = result[0].toString().replace(PERIOD, separator);
  }
  if (pad && Number.isInteger(result[0]) === false && round > 0) {
    var x = separator || PERIOD,
      tmp = result[0].toString().split(x),
      s = tmp[1] || EMPTY,
      l = s.length,
      n = round - l;
    result[0] = "".concat(tmp[0]).concat(x).concat(s.padEnd(l + n, ZERO));
  }
  if (full) {
    result[1] = fullforms[e] ? fullforms[e] : STRINGS.fullform[standard][e] + (bits ? BIT : BYTE) + (result[0] === 1 ? EMPTY : S);
  }

  // Returning Array, Object, or String (default)
  return output === ARRAY ? result : output === OBJECT ? {
    value: result[0],
    symbol: result[1],
    exponent: e,
    unit: u
  } : result.join(spacer);
}

// Partial application for functional programming
function partial() {
  var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    _ref2$bits = _ref2.bits,
    bits = _ref2$bits === void 0 ? false : _ref2$bits,
    _ref2$pad = _ref2.pad,
    pad = _ref2$pad === void 0 ? false : _ref2$pad,
    _ref2$base = _ref2.base,
    base = _ref2$base === void 0 ? -1 : _ref2$base,
    _ref2$round = _ref2.round,
    round = _ref2$round === void 0 ? 2 : _ref2$round,
    _ref2$locale = _ref2.locale,
    locale = _ref2$locale === void 0 ? EMPTY : _ref2$locale,
    _ref2$localeOptions = _ref2.localeOptions,
    localeOptions = _ref2$localeOptions === void 0 ? {} : _ref2$localeOptions,
    _ref2$separator = _ref2.separator,
    separator = _ref2$separator === void 0 ? EMPTY : _ref2$separator,
    _ref2$spacer = _ref2.spacer,
    spacer = _ref2$spacer === void 0 ? SPACE : _ref2$spacer,
    _ref2$symbols = _ref2.symbols,
    symbols = _ref2$symbols === void 0 ? {} : _ref2$symbols,
    _ref2$standard = _ref2.standard,
    standard = _ref2$standard === void 0 ? EMPTY : _ref2$standard,
    _ref2$output = _ref2.output,
    output = _ref2$output === void 0 ? STRING : _ref2$output,
    _ref2$fullform = _ref2.fullform,
    fullform = _ref2$fullform === void 0 ? false : _ref2$fullform,
    _ref2$fullforms = _ref2.fullforms,
    fullforms = _ref2$fullforms === void 0 ? [] : _ref2$fullforms,
    _ref2$exponent = _ref2.exponent,
    exponent = _ref2$exponent === void 0 ? -1 : _ref2$exponent,
    _ref2$roundingMethod = _ref2.roundingMethod,
    roundingMethod = _ref2$roundingMethod === void 0 ? ROUND : _ref2$roundingMethod,
    _ref2$precision = _ref2.precision,
    precision = _ref2$precision === void 0 ? 0 : _ref2$precision;
  return function (arg) {
    return filesize(arg, {
      bits: bits,
      pad: pad,
      base: base,
      round: round,
      locale: locale,
      localeOptions: localeOptions,
      separator: separator,
      spacer: spacer,
      symbols: symbols,
      standard: standard,
      output: output,
      fullform: fullform,
      fullforms: fullforms,
      exponent: exponent,
      roundingMethod: roundingMethod,
      precision: precision
    });
  };
}

exports.filesize = filesize;
exports.partial = partial;
