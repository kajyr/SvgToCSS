(function() {
  var defaults, fs, mkdirp, path, _encode, _extend, _svgToCss, _toFile;

  fs = require('fs');

  path = require('path');

  mkdirp = require('mkdirp');

  defaults = {
    base64: false,
    cwd: './'
  };

  _extend = function(object, properties) {
    var key, val;
    for (key in properties) {
      val = properties[key];
      object[key] = val;
    }
    return object;
  };

  _encode = function(svg, base64) {
    if (base64 === true) {
      return new Buffer(svg).toString('base64');
    }
    return encodeURIComponent(svg);
  };

  _toFile = function(svgName, svgData, cwd, cb) {
    return mkdirp(cwd, function(err) {
      var filename;
      if (err) {
        throw err;
      }
      filename = "" + cwd + svgName + ".css";
      fs.writeFileSync(filename, svgData);
      return cb.apply();
    });
  };

  _svgToCss = function(svgName, svgData, options, cb) {
    var encoded;
    encoded = _encode(svgData, options.base64);
    return _toFile(svgName, encoded, options.cwd, function() {
      if (typeof cb === 'function') {
        return cb.apply(null, [encoded]);
      }
    });
  };

  module.exports = {
    encodeFile: function(filename, options, callback) {
      var svgName;
      options = _extend(defaults, options);
      svgName = path.basename(filename, '.svg');
      return fs.readFile(filename, 'utf8', function(err, svgData) {
        if (err) {
          throw err;
        }
        return _svgToCss(svgName, svgData, options, function(encodedSvg) {
          if (typeof callback === 'function') {
            return callback.apply(null, [encodedSvg]);
          }
        });
      });
    },
    encodeString: function(svgName, svgData, options, callback) {
      options = _extend(defaults, options);
      return _svgToCss(svgName, svgData, options, function(encodedSvg) {
        if (typeof callback === 'function') {
          return callback.apply(null, [encodedSvg]);
        }
      });
    }
  };

}).call(this);
