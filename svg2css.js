(function() {
  var Mustache, SVGFile, defaults, fs, mkdirp, path, _extend, _write;

  fs = require('fs');

  path = require('path');

  mkdirp = require('mkdirp');

  Mustache = require('mustache');

  defaults = {
    base64: false,
    cwd: './',
    template: './templateCSS.mst',
    dest: 'svg.css'
  };

  _extend = function(object, properties) {
    var key, val;
    for (key in properties) {
      val = properties[key];
      object[key] = val;
    }
    return object;
  };

  SVGFile = (function() {
    function SVGFile(name, data, options) {
      this.name = name;
      this.data = data;
      this.options = _extend(defaults, options);
      this.encoded = this._encode();
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

    SVGFile.prototype.render = function() {
      var template;
      template = fs.readFileSync(this.options.template, 'utf8');
      return Mustache.render(template, {
        svgName: this.name,
        svgEncoded: this.encoded,
        base64: this.options.base64 === true
      });
    };

    return SVGFile;

  })();

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
