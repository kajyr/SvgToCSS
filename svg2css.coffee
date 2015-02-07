fs = require('fs');


module.exports = {
	encode: (svg, base64) ->
		if base64 == true
			return new Buffer(svg).toString('base64');

		return encodeURIComponent(svg);
	,
	encodeFile: (filename, base64, callback) ->
		fs.readFile('fixtures/iconmonstr-barcode-4-icon.svg', 'utf8', (err, data) =>
			throw err if err

			ret = this.encode(data, base64);

			callback.apply(null, [ret]) if typeof callback == 'function'
		)
}