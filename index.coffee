fs = require 'fs'
path = require 'path'
mkdirp = require 'mkdirp'
Mustache = 	require 'mustache'
{parseString} = require 'xml2js'

# Defaults
defaults = {
	base64: false,
	cwd: './',
	templateCSS: "#{__dirname}/templateCSS.mst",
	templateSCSS: "#{__dirname}/templateSCSS.mst",
	spriteFileName: 'svg'
	style: 'css'
}

_extend = (object, properties) ->
	for key, val of properties
		object[key] = val
	object

_merge = (options, overrides) ->
  _extend ( _extend {}, options), overrides

_write = (files, cwd, dest, cb) ->
	rendered = (for file in files
				file.render()).join('\n')
	
	filename = "#{cwd}#{dest}"
	fs.writeFileSync(filename, rendered)
	cb.apply(null) if typeof cb == 'function'
	

_spriteName = (options) ->
	return options.sprite if options.sprite?
	ext = options.style.toLowerCase()
	options.spriteFileName + '.' + ext

class SVGFile
	constructor: (@name, @data, @options) ->
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

	template: () ->
		style = @options.style.toLowerCase()
		fs.readFileSync(
			if style == 'scss' then @options.templateSCSS
			else @options.templateCSS
		 'utf8')

	render: () ->
		Mustache.render(@template(), {
			svgName: @name,
			svgEncoded: @encoded
			base64: @options.base64 == true
			width: @width
			height: @height
		})


module.exports = {

	encode: (files, params, callback) ->

		options = _merge(defaults, params)

		spriteName = _spriteName(options)

		svgFiles = for file in [].concat(files)
			SVGFile.fromFile(file, options)

		_write(svgFiles, options.cwd, spriteName, callback)

	encodeString: (svgName, svgData, params, callback) ->
		options = _merge(defaults, params)

		file = new SVGFile(svgName, svgData, options)

		_write([file], options.cwd, file.name + '.css', callback)
}