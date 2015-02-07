(function() {
  var Mustache, SVGFile, defaults, fs, mkdirp, parseString, path, _extend, _write;

  fs = require('fs');

  path = require('path');

  mkdirp = require('mkdirp');

  Mustache = require('mustache');

  parseString = require('xml2js').parseString;

  defaults = {
    base64: false,
    cwd: './',
    templateCSS: './templateCSS.mst',
    templateSASS: './templateSASS.mst',
    dest: 'svg.css',
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

  _write = function(files, cwd, dest, cb) {
    var file, rendered;
    rendered = ((function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        _results.push(file.render());
      }
      return _results;
    })()).join('\n');
    return mkdirp(cwd, function(err) {
      var filename;
      if (err) {
        throw err;
      }
      filename = "" + cwd + dest;
      fs.writeFileSync(filename, rendered);
      if (typeof cb === 'function') {
        return cb.apply(null);
      }
    });
  };

  SVGFile = (function() {
    function SVGFile(name, data, options) {
      this.name = name;
      this.data = data;
      this.options = _extend(defaults, options);
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
      return fs.readFileSync(this.options.style === 'css' ? this.options.templateCSS : this.options.templateSASS, 'utf8');
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
    encode: function(files, options, callback) {
      var file, svgFiles;
      options = _extend(defaults, options);
      svgFiles = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = files.length; _i < _len; _i++) {
          file = files[_i];
          _results.push(SVGFile.fromFile(file, options));
        }
        return _results;
      })();
      return _write(svgFiles, options.cwd, options.dest, function() {
        if (typeof callback === 'function') {
          return callback.apply(null);
        }
      });
    },
    encodeString: function(svgName, svgData, options, callback) {
      var file;
      options = _extend(defaults, options);
      file = new SVGFile(svgName, svgData, options);
      return _write([file], options.cwd, file.name + '.css', function() {
        if (typeof callback === 'function') {
          return callback.apply(null);
        }
      });
    }
  };

}).call(this);
