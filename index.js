(function() {
  var Mustache, SVGFile, defaults, fs, parseString, path, _extend, _merge, _spriteName, _write;

  fs = require('fs');

  path = require('path');

  Mustache = require('mustache');

  parseString = require('xml2js').parseString;

  defaults = {
    base64: false,
    cwd: './',
    templateCSS: "" + __dirname + "/templateCSS.mst",
    templateSCSS: "" + __dirname + "/templateSCSS.mst",
    spriteFileName: 'svg',
    style: 'css'
  };

  _extend = function(object, properties) {
    var key, val;
    for (key in properties) {
      val = properties[key];
      object[key] = val;
    }
    return object;
  };

  _merge = function(options, overrides) {
    return _extend(_extend({}, options), overrides);
  };

  _write = function(files, cwd, dest, cb) {
    var file, filename, rendered;
    rendered = ((function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        _results.push(file.render());
      }
      return _results;
    })()).join('\n');
    filename = "" + cwd + dest;
    fs.writeFileSync(filename, rendered);
    if (typeof cb === 'function') {
      return cb.apply(null);
    }
  };

  _spriteName = function(options) {
    var ext;
    if (options.sprite != null) {
      return options.sprite;
    }
    ext = options.style.toLowerCase();
    return options.spriteFileName + '.' + ext;
  };

  SVGFile = (function() {
    function SVGFile(name, data, options) {
      this.name = name;
      this.data = data;
      this.options = options;
      this.encoded = this._encode();
      parseString(this.data, (function(_this) {
        return function(err, result) {
          _this.width = result.svg.$.width;
          return _this.height = result.svg.$.height;
        };
      })(this));
    }

    SVGFile.fromFile = function(filename, options) {
      var data, name;
      data = fs.readFileSync(filename, 'utf8');
      name = path.basename(filename, '.svg');
      return new SVGFile(name, data, options);
    };

    SVGFile.prototype._encode = function() {
      if (this.options.base64 === true) {
        return new Buffer(this.data).toString('base64');
      }
      return encodeURIComponent(this.data);
    };

    SVGFile.prototype.template = function() {
      var style;
      style = this.options.style.toLowerCase();
      return fs.readFileSync(style === 'scss' ? this.options.templateSCSS : this.options.templateCSS, 'utf8');
    };

    SVGFile.prototype.render = function() {
      return Mustache.render(this.template(), {
        svgName: this.name,
        svgEncoded: this.encoded,
        base64: this.options.base64 === true,
        width: this.width,
        height: this.height
      });
    };

    return SVGFile;

  })();

  module.exports = {
    defaults: defaults,
    encode: function(files, params, callback) {
      var file, options, spriteName, svgFiles;
      options = _merge(defaults, params);
      spriteName = _spriteName(options);
      svgFiles = (function() {
        var _i, _len, _ref, _results;
        _ref = [].concat(files);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          file = _ref[_i];
          _results.push(SVGFile.fromFile(file, options));
        }
        return _results;
      })();
      return _write(svgFiles, options.cwd, spriteName, callback);
    },
    encodeString: function(svgName, svgData, params, callback) {
      var file, options;
      options = _merge(defaults, params);
      file = new SVGFile(svgName, svgData, options);
      return _write([file], options.cwd, file.name + '.css', callback);
    }
  };

}).call(this);
