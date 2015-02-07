var svg2css = require('../svg2css.js');
var fs = require('fs');

var svgFixture = './test/fixtures/iconmonstr-barcode-4-icon.svg';
var expectedCSS = './test/expected/iconmonstr-barcode-4-icon.css';


exports.basicEncode = function (test) {
   
	var fileContents = fs.readFileSync(svgFixture, 'utf8')

		svg2css.encodeString('svgFromStringToURI', fileContents, {
			cwd: 'test/expected/'
		}, function (encoded) {
			test.notEqual(fileContents, encoded, 'Encoded URI data should be different from original');
			
			svg2css.encodeString('svgFromStringToB64', fileContents, {
				cwd: 'test/expected/',
				base64: true
			}, function(base64) {
				test.notEqual(fileContents, base64, 'Encoded Base64 data should be different from original');
				test.notEqual(encoded, base64, 'Encoded Base64 data should be different from URI Encoded');
			
				test.done();
			});
		})
}

/*
	Tests that when working with already present svgData, the css is created
*/
exports.fileFromString = function (test) {

	var svgName = 'testFileFromString';
	var cssDir = 'test/expected/';
	var expectedCSS = cssDir + svgName + '.css';
   
	var fileContents = fs.readFileSync(svgFixture, 'utf8');

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
	svg2css.encodeFile(svgFixture, {
		cwd: 'test/expected/'
	}, function(data) {
		test.notEqual(data.length, 0, 'There is some data returned.');
		test.strictEqual(typeof(data), 'string', 'The return value is a string');

		fs.exists(expectedCSS, function (exists) {
			test.ok(exists, 'There should be the css file');
			test.done();
		});
	})
}
