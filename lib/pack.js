var beautify = require('js-beautify').html,
    SinglePack = require('./single_pack');

module.exports = function(directory) {
  return new Packer(directory);
};

var slice = Array.prototype.slice;

function Packer() {
  if(Array.isArray(arguments[0])) {
    this.files = arguments[0];
  } else {
    this.files = slice.call(arguments);
  }

  this.indentSize = 2;
}

Packer.prototype.indent = function(size) {
  this.indentSize = size;
  return this;
};

Packer.prototype.minify = function(doMinify) {
  if(typeof doMinify !== 'boolean') {
    doMinify = true;
  }

  this.minifyJs = doMinify;
  return this;
};

Packer.prototype.end = function(callback) {
  var self = this;

  this.packAll(function(allOutput) {
    var output = allOutput.join('\n');

    if(!self.minifyJs) {
      output = beautify(output, {
        indent_size: self.indentSize
      });
    }

    callback(output);
  });

};

Packer.prototype.packAll = function(callback, arr) {
  var self = this, files = this.files;

  if(!files.length) {
      callback(arr);
      return;
  }

  arr = arr || [];
  var fileName = files.shift();

  var packer = new SinglePack(fileName, {
    minifyJs: this.minifyJs,
    indentSize: this.identSize
  });

  packer.end(function(output) {
    arr.push(output);
    self.packAll(callback, arr);
  });
};
