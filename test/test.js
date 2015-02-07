var svg2css = require('../svg2css.js');
var fs = require('fs');

var svgFixture = './test/fixtures/iconmonstr-barcode-4-icon.svg';
var expectedCSS = './test/expected/iconmonstr-barcode-4-icon.css';


exports.basicEncode = function (test) {
   
	fs.readFile(svgFixture, 'utf8', function (err, data) {
		if (err) throw err;

		var encoded = svg2css.encodeString(data, {
			cwd: 'test/expected/'
		});
		var base64 = svg2css.encodeString(data, {
			cwd: 'test/expected/',
			base64: true
		});

		test.notEqual(data, encoded, 'Encoded URI data should be different from original');
		test.notEqual(data, base64, 'Encoded Base64 data should be different from original');
		test.notEqual(encoded, base64, 'Encoded Base64 data should be different from URI Encoded');
		test.done();
	});

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
