# wcpack - webcomponent-pack
`wcpack` is a utility for packaging [WebComponents](http://www.w3.org/TR/components-intro/) are an emerging standard that makes it easy to create reuseable components for the browser. Just imagine creating your own tags that are simple for others to use as adding the `<my-tag></my-tag>` to their page.

## Need
As great as WebComponents are, they are best packaged as a single file, and that isn't necessarily the most convenient way to develop thing. This is where `wcpack` comes in; it allows you to develop your components as a single file, and then package them together for distribution.

`wcpack` will take all of your component's HTML, JavaScript, and CSS files and concatenate them together and package them as a single .html file. It will also automatically compile CoffeeScript files before packaging.

# Installation
To install the command line tool:
```
npm install -g wcpack
```

To install as an `node` module in your own project:
```
npm install wcpack
```

# Command line
The command line tool is where you will package your components together. A typical usage:

Let's say you have a directory structure with these files:

tabs.html
```html
<element name="tabs" constructor="TabsHTMLElement">
  <section>
    I'm tabs!
  </section>
</element>
```

tabs.js
```javascript
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
```

You would package these files together with this command:
```
wcpack -o component.html .
```

This simply tells wcpack to package the current directory's contents and write the results to component.html. You'd wind up with this output:
```html
<element name="tabs">
  <section>I'm tabs!</section>
  <script>
    if (this !== window) {
      var section = this.querySelector('section');

      this.register({
        prototype: {
          readyCallback: function() {
            this.innerHTML = section.innerHTML;
          }
        }
      });
    }
  </script>
</element>
```

# From Node
Everything that can be down from the command line tool can also be done from `node`. Here's a simple example:

```javascript
var pack = require('wcpack');

pack('./mycomponent')
  .indent(2)
  .minify()
  .end(function(output) {
    console.log(output);
   });
```