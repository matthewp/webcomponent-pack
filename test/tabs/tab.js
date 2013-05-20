if(this !== window) {
  var section = this.querySelector('section');

  this.register({
    prototype: {
      readyCallback: function() {
        this.innerHTML = section.innerHTML;
      }
    }
  });
}
