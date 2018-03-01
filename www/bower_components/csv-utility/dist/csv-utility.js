(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = {
  guessSeparator: guessSeparator,
  guessLinebreak: guessLinebreak,
  guessCSV: guessCSV
};

function guessCSV(line,opts){
  opts = opts || {};
  var linebreak = (Array.isArray(opts.linebreak))?guessLinebreak(line,opts.linebreak):guessLinebreak(line,[opts.linebreak]);
  var sep = (Array.isArray(opts.sep))?guessSeparator(line,linebreak,opts.sep):guessSeparator(line,linebreak,[opts.sep]);
  return {sep:sep, linebreak:linebreak};
}

function guessSeparator(line,linebreak,opts){
  line = line.slice(0,102400);
  linebreak = linebreak || '\n';
  var choices = union([",", "\t", "|", ";"],opts);

  var res = choices[0], error = Number.MAX_VALUE;
  
  var lines = line.split(linebreak);

  choices.forEach(function(sep){
      var _error = examineLine(sep);
      if (_error<error) {
        error = _error;
        res = sep;
      }
    });
  
  return res;
  
  function examineLine(sep){
    var sum = 0;
    var res = lines.map(function(d){ 
      var len = d.split(sep).length;
      sum += len;
      return len; 
    });

    if (sum === res.length) return Number.MAX_VALUE;
    var mean = sum/res.length;
    var sumerror = res.map(function(d){ return (d-mean)*(d-mean); })
      .reduce(function(a,b){ return a+b; });
      
    return 0.01+Math.sqrt(sumerror)/sum;
  }
}

function guessLinebreak(line,opts){
  line = line.slice(0,102400);
  var choices = union(["\r\n", "\r", "\n"],opts);
  var res = choices[0], score = 0;
  
  choices.forEach(function(sep,i){
    var len = line.split(sep).length;
    if (score<len) {
      score = len;
      res = sep;
    }
  });
  
  return res;
}

function union(array1,array2){
  if (!array2) return array1;
  var map = {};
  array1.forEach(function(d){ map[d] = true; });
  array2.forEach(function(d){ map[d] = true; });
  return Object.keys(map);
}
},{}],2:[function(require,module,exports){
(function (global){
var csvUtility = require('./index.js');
if (typeof global.window.define == 'function' && global.window.define.amd) {
  global.window.define('csvUtility', function () { return csvUtility; });
} else {
  global.window.csvUtility = csvUtility;
}
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./index.js":1}]},{},[2]);
