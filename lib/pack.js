var beautify = require('js-beautify').html,
    cc = require('coffee-script').compile,
    fs = require('fs'),
    jsdom = require('jsdom'),
    UglifyJS = require('uglify-js');

module.exports = function(directory) {
  return new Packer(directory);
};

var slice = Array.prototype.slice;

function logerr(callback) {
  return function(err) {
    if(!!err) {
      console.error(err);
      return;
    }

    callback.apply(this, slice.call(arguments, 1));
  };
}

function Packer(directory) {
  if(directory === '.') {
    directory = './';
  }
  this.directory = directory;

  this.html = undefined; // HTML is the component's packed html.
  this.js = []; // js is an array of JavaScript strings to concat.
  this.css = []; // css is an array of CSS strings to concat.

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
  var self = this, directory = this.directory;

  fs.readdir(directory, logerr(function check(fileNames) {
    var fileName = fileNames.shift();
    if(!fileName) {
      // We're done, exit out.
      self.packComponent(callback);
      return;
    }

    var fullPath = directory + fileName;
    fs.stat(fullPath, logerr(function(stat) {
      if(stat.isFile()) {
        self.resolveFile(fullPath, function() {
          check(fileNames);
        });
      } else {
        // TODO transverse the directory.
        check(fileNames);
      }
    }));
  }));
};

var placePutter = {
  'html': function(d) { this.html = d; },
  'js': function(d) { this.js.push(d); },
  'css': function(d) { this.css.push(d); },
  'coffee': function(d) {
    var output = cc(d);
    this.js.push(output);
  }
};

Packer.prototype.resolveFile = function(fullPath, callback) {
  var self = this;

  fs.readFile(fullPath, 'utf8', logerr(function(data) {
    var fileType = slice.call(fullPath, fullPath.lastIndexOf('.') + 1).join('').toLowerCase();
    var fn = placePutter[fileType];
    if(fn) {
      fn.call(self, data);
    }

    callback();
  }));
};

Packer.prototype.packComponent = function(callback) {
  var html = this.html,
      js = this.js,
      css = this,css,
      self = this;

  jsdom.env(html, [], logerr(function(window) {
    var document = window.document;

    var element = document.querySelector('element'),
     script = document.createElement('script');

    // Css packing.
    if(css.length) {
    css.unshift('');
    var style = document.createElement('style');
    style.textContent = css.join('\n');
    element.appendChild(style);
    }

    // JavaScript packing.
    js.unshift('');
    var outJs = js.join('\n');
    if(self.minifyJs) {
      outJs = UglifyJS.minify(outJs, {
        fromString: true
      }).code;
    }

    script.textContent = outJs;
    element.appendChild(script);

    var output = element.outerHTML;
    if(!self.minifyJs) {
      output = beautify(output, {
        indent_size: self.indentSize
      });
    }
     
    callback(output);
  }));
};
