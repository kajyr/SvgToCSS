(function() {
  var defaults, fs, mkdirp, path, _encode, _extend, _toFile;

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

  module.exports = {
    encodeFile: function(filename, options, callback) {
      var basename;
      options = _extend(defaults, options);
      basename = path.basename(filename, '.svg');
      return fs.readFile(filename, 'utf8', function(err, svgData) {
        var encoded;
        if (err) {
          throw err;
        }
        encoded = _encode(svgData, options.base64);
        return _toFile(basename, encoded, options.cwd, function() {
          if (typeof callback === 'function') {
            return callback.apply(null, [encoded]);
          }
        });
      });
    },
    encodeString: function(svgData, options) {
      options = _extend(defaults, options);
      return _encode(svgData, options.base64);
    }
  };

}).call(this);
