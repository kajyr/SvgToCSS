fs = require('fs')
path = require('path')
mkdirp = require('mkdirp')

# Defaults
defaults = {
	base64: false,
	cwd: './'
}



_extend = (object, properties) ->
	for key, val of properties
		object[key] = val
	object

_encode = (svg, base64) ->
	if base64 == true
		return new Buffer(svg).toString('base64')
	return encodeURIComponent(svg)

_toFile = (svgName, svgData, cwd, cb) ->
	mkdirp(cwd, (err) ->
		throw err if err	
		filename = "#{cwd}#{svgName}.css"
		fs.writeFileSync(filename, svgData)

		cb.apply()
	)
	


module.exports = {
	
	encodeFile: (filename, options, callback) ->
		options = _extend(defaults, options)
		basename = path.basename(filename, '.svg')

		fs.readFile(filename, 'utf8', (err, svgData) ->
			throw err if err

			encoded = _encode(svgData, options.base64)

			_toFile(basename, encoded, options.cwd, () ->
				callback.apply(null, [encoded]) if typeof callback == 'function'
			)

			
		)

	encodeString: (svgData, options) ->
		options = _extend(defaults, options)
		return _encode(svgData, options.base64)
}