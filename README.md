# SvgToCSS

[![Build Status](https://travis-ci.org/kajyr/SvgToCSS.svg?branch=master)](https://travis-ci.org/kajyr/SvgToCSS)

The idea behind this module came from the work made for [aditollo/grunt-svgzr](https://github.com/aditollo/grunt-svgzr) and the [probably-dont-base64-svg](http://css-tricks.com/probably-dont-base64-svg/) article

I've decided to separate the URI / base64 svg renderer to generate CSS / SCSS sprites from SVG files.

## Usage
```javascript
var svgtocss = require('svgtocss');

svgtocss.encode(['file1.svg', 'file2.svg'], options, function() {
	console.log('all done!');
})
```

This task would have created a css file like this

```css
.svg-file1 {
	background-image: url('data:image/svg+xml;charset=utf-8, ...');
}
.svg-file2 {
	background-image: url('data:image/svg+xml;charset=utf-8, ... ');
}
```

## Options

The options parameter can accept these configs:
+ `base64`: boolean, should compress image in base64? (default: false)
+ `cwd`: string, the directory to output files (default: './')
+ `style`: string, css or scss. That changes the output syntax.
+ `sprite`: string, the file to output. (default: 'svg.css')
