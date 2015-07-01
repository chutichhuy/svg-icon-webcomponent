# SVG Icon Web Component

A small web component for SVG icon, supporting sprite, CSS styling, bitmap fallback.

## Usage

The browser-side script is available in ``` build ``` folder.

Put this in your ```<head>```.

```html
<script type="text/javascript" src="iconwc.js"></script>
```

Then you can use the tag ```svg-icon``` in your HTML.

```html
<svg-icon>
    <src href="cow.svg" />
    <src href="cow.png" /> <!-- PNG fallback for old browser -->
</svg-icon>

<svg-icon>
    <src href="sprite.svg#cow" /> <!-- sprite SVG is good to go -->
</svg-icon>
```

## Custom tag name

If you want another tag name, it's easy to build the script yourself. 

The tag name is specified in ```entry.js```:

```javascript
let tagName = "someother-tagnameyoureallylike";
```

Then install Node.js and ```browserify``` and ```babel``` and ```grunt```:

```
npm install -g babel
npm install -g browerify
```

After that, clone this repo to your local machine and ```cd``` to the directory.

```
cd /path/to/icon-webcomponent
```

Then run:
```
npm install
```

Finally run: 

```
grunt
```

You will find your custom script in ```build/```.

### Use as a library

You can install this via npm:

``` 
npm install icon-webcomponent
```

Then use it in your own code

```javascript
var wc = require("icon-component");

var fn = wc("your-tagname");
fn();
```

### Attention please

By standard, your custom tag name must have a dash in it. ```tag-name``` is valid, but ```tagname``` is not.

### License
MIT
