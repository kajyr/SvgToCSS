var svg2css = require('../index.js');
var fs = require('fs');

var svgFixture = './test/fixtures/iconmonstr-barcode-4-icon.svg';
var svgFixture2 = './test/fixtures/iconmonstr-puzzle-2-icon.svg';

var cssDir = './test/expected/';
var expectedCSS = cssDir + '/svg.css';


exports.fileEncode = function (test) {	
	svg2css.encode(svgFixture, {
		cwd: cssDir
	}).then(function() {
		fs.exists(expectedCSS, function (exists) {
			test.ok(exists, 'There should be the css file');
			test.done();
		});
	})
}

exports.multiFileEncode = function (test) {	
	svg2css.encode([svgFixture, svgFixture2], {
		cwd: cssDir
	}).then(function() {
		fs.exists(expectedCSS, function (exists) {
			test.ok(exists, 'There should be the css file');
			test.done();
		});
	})
}

