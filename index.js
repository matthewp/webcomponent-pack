#!/usr/bin/env node

var beautify = require('js-beautify').html,
    cc = require('coffee-script').compile,
    fs = require('fs'),
    jsdom = require('jsdom'),
    program = require('commander');

var html, // HTML is the component's packed html.
    js = [] // js is an array of JavaScript strings to concat.
    css = []; // css is an array of CSS strings to concat.

var slice = Array.prototype.slice;

program
  .version('0.0.1')
  .option('-m, --minify', 'Minify the JavaScript before packing.')
  .option('-t, --traverse', 'Traverse the subdirectories')
  .option('-i, --indent [size]', 'Indentation size [2]', 2)
  .parse(process.argv);

var directory = program.args[0];
if(!directory) {
  throw "Oh noes";
}

function logerr(callback) {
  return function(err) {
    if(!!err) {
      console.error(err);
      return;
    }

    callback.apply(this, slice.call(arguments, 1));
  };
}

fs.readdir(directory, logerr(function check(fileNames) {
  var fileName = fileNames.shift();
  if(!fileName) {
    // We're done, exit out.
    packComponent();
    return;
  }

  var fullPath = directory + fileName;
  fs.stat(fullPath, logerr(function(stat) {
    if(stat.isFile()) {
      resolveFile(fullPath, function() {
        check(fileNames);
      });
    } else {
      // TODO transverse the directory.
      check(fileNames);
    }
  }));
}));

var placePutter = {
  'html': function(d) { html = d; },
  'js': function(d) { js.push(d); },
  'css': function(d) { css.push(d); },
  'coffee': function(d) {
    var output = cc(d);
    js.push(output);
  }
};

function resolveFile(fullPath, callback) {
  fs.readFile(fullPath, 'utf8', logerr(function(data) {
    var fileType = slice.call(fullPath, fullPath.lastIndexOf('.') + 1).join('').toLowerCase();
    var fn = placePutter[fileType];
    if(fn) {
      fn(data);
    }

    callback();
  }));
}

function packComponent() {
  jsdom.env(html, [], logerr(function(window) {
   var document = window.document;
   
   var element = document.querySelector('element'),
       script = document.createElement('script');

   if(css.length) {
    css.unshift('');
    var style = document.createElement('style');
    style.textContent = css.join('\n');
    element.appendChild(style);
   }

   js.unshift('');
   script.textContent = js.join('\n');
   element.appendChild(script);

   var output = beautify(element.outerHTML, {
    indent_size: program.indent |0
   });

   console.log(output);
  }));
}
