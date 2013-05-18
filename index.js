#!/usr/bin/env node

var pack = require('./lib/pack.js'),
    program = require('commander');

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

var packer = pack(directory).indent(program.indent |0);

packer.end(function(output) {
  console.log(output);
});
