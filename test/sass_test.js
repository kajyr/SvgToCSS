var svg2css = require('../index.js');
var fs = require('fs');

var svgFixture = './test/fixtures/iconmonstr-barcode-4-icon.svg';
var svgFixture2 = './test/fixtures/iconmonstr-puzzle-2-icon.svg';

var cssDir = './test/expected/';


exports.multiFileEncodeSass = function (test) {
	var file = '_svgPartial.scss';
	var expectedSASS = cssDir + file;

	svg2css.encode([svgFixture, svgFixture2], {
		cwd: cssDir,
		style: 'scss',
		sprite: file
	}, function() {
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
	}, function() {
		fs.exists(expectedSCSS, function (exists) {
			test.ok(exists, 'There should be the SASS file: ' + expectedSCSS);
			test.done();
		});
	})
}
