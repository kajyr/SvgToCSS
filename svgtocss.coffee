fs = require 'fs'
path = require 'path'
mkdirp = require 'mkdirp'
Mustache = 	require 'mustache'
{parseString} = require 'xml2js'

# Defaults
defaults = {
	base64: false,
	cwd: './',
	template: './templateCSS.mst',
	dest: 'svg.css'
}

_extend = (object, properties) ->
	for key, val of properties
		object[key] = val
	object
_write = (files, cwd, dest, cb) ->
	rendered = (for file in files
				file.render()).join('\n')

	mkdirp(cwd, (err) ->
		throw err if err

		filename = "#{cwd}#{dest}"
		fs.writeFileSync(filename, rendered)
		cb.apply(null) if typeof cb == 'function'
	)

class SVGFile
	constructor: (@name, @data, options) ->
		@options = _extend(defaults, options)
		@encoded = @_encode()
		parseString(@data, (err, result) =>
			@width = result.svg.$.width
			@height = result.svg.$.height
		)

	@fromFile: (filename, options) ->
		data = fs.readFileSync(filename, 'utf8')
		name = path.basename(filename, '.svg')
		new SVGFile(name, data, options)

	_encode: () ->
		if @options.base64 == true
			return new Buffer(@data).toString('base64')
		return encodeURIComponent(@data)

	render: () ->
		template = fs.readFileSync(@options.template, 'utf8')
		Mustache.render(template, {
			svgName: @name,
			svgEncoded: @encoded
			base64: @options.base64 == true
			width: @width
			height: @height
		})


module.exports = {

	encode: (files, options, callback) ->
		options = _extend(defaults, options)

		svgFiles = for file in files
			SVGFile.fromFile(file, options)

		_write(svgFiles, options.cwd, options.dest, () ->
				callback.apply(null) if typeof callback == 'function'
			)

	encodeString: (svgName, svgData, options, callback) ->
		options = _extend(defaults, options)

		file = new SVGFile(svgName, svgData, options)

		_write([file], options.cwd, file.name + '.css', () ->
			callback.apply(null) if typeof callback == 'function'
		)
}