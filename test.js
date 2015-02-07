var svg2css = require('./svg2css.js');
var fs = require('fs');

exports.basicEncode = function (test) {
   
	fs.readFile('fixtures/iconmonstr-barcode-4-icon.svg', 'utf8', function (err, data) {
		if (err) throw err;

		var encoded = svg2css.encode(data);
		var base64 = svg2css.encode(data, true);
		test.notEqual(data, encoded, 'Encoded URI data is different from original');
		test.notEqual(data, base64, 'Encoded Base64 data is different from original');
		test.notEqual(encoded, base64, 'Encoded Base64 data is different from URI Encoded');
		test.done();
	});

}

exports.fileEncode = function (test) {

	var filename = 'fixtures/iconmonstr-barcode-4-icon.svg';

	svg2css.encodeFile(filename, false, function(data) {
		test.notEqual(data.length, 0, 'There is some data returned.');
		test.strictEqual(typeof(data), 'string', 'The return value is a string');
		test.done();
	})


}
