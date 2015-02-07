fs = require('fs');

# Defaults
defaults = {
	base64: false
}



_extend = (object, properties) ->
	for key, val of properties
		object[key] = val
	object

_encode = (svg, base64) ->
	console.log 'encoding b64:', base64
	if base64 == true
		return new Buffer(svg).toString('base64')
	return encodeURIComponent(svg)

module.exports = {
	
	encodeFile: (filename, options, callback) ->
		options = _extend(defaults, options)
		fs.readFile(filename, 'utf8', (err, svgData) ->
			throw err if err

			ret = _encode(svgData, options.base64)

			callback.apply(null, [ret]) if typeof callback == 'function'
		)

	encodeString: (svgData, options) ->
		options = _extend(defaults, options)
		return _encode(svgData, options.base64)
}