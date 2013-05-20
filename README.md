# wcpack - webcomponent-pack
`wcpack` is a utility for packaging [WebComponents](http://www.w3.org/TR/components-intro/) are an emerging standard that makes it easy to create reuseable components for the browser. Just imagine creating your own tags that are simple for others to use as adding the `<my-tag></my-tag>` to their page.

## Need
As great as WebComponents are, they are best packaged as a single file, and that isn't necessarily the most convenient way to develop thing. This is where `wcpack` comes in; it allows you to develop your components as a single file, and then package them together for distribution.

`wcpack` will take all of your component's HTML, JavaScript, and CSS files and concatenate them together and package them as a single .html file.

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
  <script src="tabs.js"></script>
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
wcpack -o component.html tabs.html
```

This simply tells wcpack to package the component defined in tabs.html and write the results to component.html. You'd wind up with this output:
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

# Multiple inputs
Additionally wcpack allows for multiple input files to pack into a single `.html` file. This is useful when you have a group of components that are related. For example with a `tabs` component you would likely want to allow for `tab` elements to be nested. In this case you want to pack these into a single component.

To pack multiple components into one simply path multiple files from the command line:

```
wcpack -o component.html tab.html tabs.html
```

or from Node:
```var javascript
var pack = require('wcpack'),
    fs = require('fs');

pack('tabs.html', 'tab.html')
  .end(function(output) {
    fs.writeFile('component.html', output, 'utf8', function() {
      // All done!
    });
   });
```

Or as an array from Node:

```javascript
pack(['tab.html', 'tabs.html']).end(function(output){ ...
```

# From Node
Everything that can be down from the command line tool can also be done from `node`. Here's a simple example:

```javascript
var pack = require('wcpack');

pack('./mycomponent.html')
  .indent(2)
  .minify()
  .end(function(output) {
    console.log(output);
   });
```
