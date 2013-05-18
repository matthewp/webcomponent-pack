if (this !== window) {
  var section = this.querySelector('section');

  // Has built-in 'window' protection.
  this.register({
    prototype: {
      readyCallback: function() {
        this.innerHTML = section.innerHTML;
      },
      foo: function() {
        console.log('foo() called');
      }
    }
  });
}
