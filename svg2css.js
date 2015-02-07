(function() {
  var defaults, fs, _encode, _extend;

  fs = require('fs');

  defaults = {
    base64: false
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
    console.log('encoding b64:', base64);
    if (base64 === true) {
      return new Buffer(svg).toString('base64');
    }
    return encodeURIComponent(svg);
  };

  module.exports = {
    encodeFile: function(filename, options, callback) {
      options = _extend(defaults, options);
      return fs.readFile(filename, 'utf8', function(err, svgData) {
        var ret;
        if (err) {
          throw err;
        }
        ret = _encode(svgData, options.base64);
        if (typeof callback === 'function') {
          return callback.apply(null, [ret]);
        }
      });
    },
    encodeString: function(svgData, options) {
      options = _extend(defaults, options);
      return _encode(svgData, options.base64);
    }
  };

}).call(this);
