var svg2css = require('../index.js');
var fs = require('fs');

var svgFixture = './test/fixtures/iconmonstr-barcode-4-icon.svg';
var svgFixture2 = './test/fixtures/iconmonstr-puzzle-2-icon.svg';
var svgFixture3 = './test/fixtures/iconmonstr-puzzle-2-icon-adimensional.svg';

var cssDir = './test/expected/';


exports.multiFileEncodeSass = function (test) {
	var file = '_svgPartial.scss';
	var expectedSASS = cssDir + file;

	svg2css.encode([svgFixture, svgFixture2, svgFixture3], {
		cwd: cssDir,
		style: 'scss',
		sprite: file
	}).then(function() {
		fs.exists(expectedSASS, function (exists) {
			test.ok(exists, 'There should be the SASS file');
			test.done();
		});
	})
}

exports.encodeSassWithoutFileName = function (test) {

	var expectedSCSS = cssDir + 'svg.scss';

	svg2css.encode(svgFixture, {
		cwd: cssDir,
		style: 'scss',
	}).then(function() {
		fs.exists(expectedSCSS, function (exists) {
			test.ok(exists, 'There should be the SASS file: ' + expectedSCSS);
			test.done();
		});
	})
}


exports.multiFileEncodeSassB64 = function (test) {
	var file = '_svgPartialB64.scss';
	var expectedSASS = cssDir + file;

	svg2css.encode([svgFixture, svgFixture2, svgFixture3], {
		cwd: cssDir,
		style: 'scss',
		sprite: file,
		base64: true
	}).then(function() {
		fs.exists(expectedSASS, function (exists) {
			test.ok(exists, 'There should be the SASS file');
			test.done();
		});
	})
}