'use strict';

// https://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

exports.replaceLast = function(str, isValue, shouldValue){
    const pos = str.lastIndexOf(isValue);
    if (pos > 0) str = str.substring(0,pos) + shouldValue + str.substring(pos+1);
    return str;
}
