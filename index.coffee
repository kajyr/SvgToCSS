fs = require 'fs'
path = require 'path'
mkdirp = require 'mkdirp'
fsp = require 'fs-promise'
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

pmkdirp = (dir) ->
	new Promise (resolve, reject) ->
		mkdirp(dir, (error) ->
			return reject(error) if (error)
			return resolve(dir)
		)


_extend = (object, properties) ->
	for key, val of properties
		object[key] = val
	object

_merge = (options, overrides) ->
  _extend ( _extend {}, options), overrides

getTemplate = (options) ->
	fsp.readFile(
		if options.style.toLowerCase() == 'scss' then options.templateSCSS
		else options.templateCSS
	 'utf8')

write = (rendered, cwd, dest) ->
 	pmkdirp(cwd).then(() -> fsp.writeFile("#{cwd}#{dest}", rendered).then(() -> return rendered) )
	

spriteName = (options) ->
	return options.sprite if options.sprite?
	options.spriteFileName + '.' + options.style.toLowerCase()

render = (files, template) -> Mustache.render(template, { files: files })

fixAppendix = (string) ->
	return string if not string.indexOf("px") > -1
	string.slice(0,string.lastIndexOf("px"))

addMeasurements = (file) ->
	new Promise (resolve, reject) ->
		parseString(file.data, (err, result) =>
			file.width = fixAppendix(result.svg.$.width)
			file.height = fixAppendix(result.svg.$.height)
			resolve file
		)

encode = (data, base64) ->
	if base64 == true
		return new Buffer(data).toString('base64')
	return encodeURIComponent(data)


readFile = (filename, base64) ->
	fsp.readFile(filename, 'utf8').then((data) ->
		return {
			name: path.basename(filename, '.svg')
			data: data
			encoded: encode(data, base64)
			base64: base64
		}
	).then(addMeasurements)


module.exports = {

	defaults: defaults

	encode: (files, params) ->

		options = _merge(defaults, params)

		Promise.all(readFile(file, options.base64) for file in [].concat(files))
		.then( (files) ->
			getTemplate(options)
			.then((template) ->
				render(files, template)
			)
		).then((rendered) ->
			write(rendered, options.cwd, spriteName(options))
		)

}