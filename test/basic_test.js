var svg2css = require('../index.js');
var fs = require('fs');

var svgFixture = './test/fixtures/iconmonstr-barcode-4-icon.svg';
var svgFixture2 = './test/fixtures/iconmonstr-puzzle-2-icon.svg';

var cssDir = './test/expected/';
var expectedCSS = cssDir + '/svg.css';

/*
	Tests that when working with already present svgData, the css is created
*/
exports.fileFromString = function (test) {

	var svgName = 'testFileFromString';
	
	var expectedCSS = cssDir + svgName + '.css';
   
	var fileContents = fs.readFileSync(svgFixture2, 'utf8');

	svg2css.encodeString(svgName, fileContents, {
		cwd: cssDir
	}, function () {
		
		fs.exists(expectedCSS, function (exists) {
			test.ok(exists, 'There should be the css file');
			test.done();
		});

	})
}

exports.fileEncode = function (test) {	
	svg2css.encode(svgFixture, {
		cwd: cssDir
	}, function() {
		fs.exists(expectedCSS, function (exists) {
			test.ok(exists, 'There should be the css file');
			test.done();
		});
	})
}

exports.multiFileEncode = function (test) {	
	svg2css.encode([svgFixture, svgFixture2], {
		cwd: cssDir
	}, function() {
		fs.exists(expectedCSS, function (exists) {
			test.ok(exists, 'There should be the css file');
			test.done();
		});
	})
}

exports.multiFileEncodeSass = function (test) {
	var file = '_svg.scss';
	var expectedSASS = cssDir + file;

	svg2css.encode([svgFixture, svgFixture2], {
		cwd: cssDir,
		style: 'sass',
		dest: file
	}, function() {
		fs.exists(expectedSASS, function (exists) {
			test.ok(exists, 'There should be the SASS file');
			test.done();
		});
	})
}
