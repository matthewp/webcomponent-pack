var fs = require('fs'),
    jsdom = require('jsdom'),
    path = require('path'),
    UglifyJS = require('uglify-js');

module.exports = Packer;

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

function Packer(fileName, options) {
  this.fileName = path.resolve(fileName);

  this.indentSize = options.indentSize || 2;
  this.minifyJs = !!options.minifyJs;
}

Packer.prototype.end = function(callback) {
  var self = this, fileName = this.fileName;

  fs.readFile(fileName, 'utf8', logerr(function(html) {
    jsdom.env(html, [], logerr(function(window) {
      var document = window.document,
          element = document.querySelector('element');

      var styles = document.querySelectorAll('link[rel="stylesheet"]');
      self.concatStyles(styles, function(css) {
        if(css) {
          var style = document.createElement('style');
          style.textContent = css;
          element.appendChild(style);
        }

        var scripts = document.querySelectorAll('script');
        self.concatScripts(scripts, function(js) {
          var script = document.createElement('script');

          if(self.minifyJs) {
            js = UglifyJS.minify(js, {
              fromString: true
            }).code;
          }
          script.textContent = js;
          element.appendChild(script);

          // Finish up.
          var output = element.outerHTML;
          callback(output);
        });
      });
    }));
  }));
};

var createConcat = function(attrName) {
  return function concat(tags, callback, arr) {
    var self = this,
        tag = Array.prototype.shift.call(tags),
        src = tag && tag.getAttribute('src');

    if(!tag) {
      // We are done!
      callback(arr && arr.join('\n'));
      return;
    }

    // Remove the script, it's no longer needed.
    tag.parentNode.removeChild(tag);

    arr = arr || [''];
    if(src) {
      src = path.resolve(path.dirname(this.fileName), src);
      fs.readFile(src, 'utf8', logerr(function(data) {
        arr.push(data);
        concat.call(self, tags, callback, arr);
      }));
      return;
    }

    arr.push(tag.textContent);
    concat.call(this, tags, callback, arr);
  };
};

Packer.prototype.concatScripts = createConcat('src');
Packer.prototype.concatStyles = createConcat('href');
