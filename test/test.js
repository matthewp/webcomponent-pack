var assert = require('assert'),
    jsdom = require('jsdom'),
    pack = require('..'),
    path = require('path');

var slice = Array.prototype.slice;

var log = function() {
  console.log.apply(console, arguments);
};

describe('Basic', function() {
  var output, elements;

  before(function(done) {
    pack('test/tabs/tabs.html')
      .end(function(op) {
        output = op;
        
        jsdom.env(output, [], function(err, window) {
          if(err) throw err;

          var document = window.document;
          elements = slice.call(document.querySelectorAll('element'));
          done();
        });
      });
  });

  it('It should be a string', function() {
    assert(typeof output === 'string');
  });

  it('It should contain one element', function() {
    assert(elements.length === 1);
  });

  it('The element should have a nodeName of element', function() {
    assert(elements[0].nodeName === 'ELEMENT');
  });

  it('Should contain one script', function() {
    var scripts = slice.call(elements[0].querySelectorAll('script'));
    assert(scripts.length === 1);
  });

  it('The script should not be minified.', function() {
    var script = elements[0].querySelector('script'),
        content = script.textContent;

    assert(content.indexOf('\n') !== -1);
  });

});
