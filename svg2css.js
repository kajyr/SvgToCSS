(function() {
  var fs;

  fs = require('fs');

  module.exports = {
    encode: function(svg, base64) {
      if (base64 === true) {
        return new Buffer(svg).toString('base64');
      }
      return encodeURIComponent(svg);
    },
    encodeFile: function(filename, base64, callback) {
      return fs.readFile('fixtures/iconmonstr-barcode-4-icon.svg', 'utf8', (function(_this) {
        return function(err, data) {
          var ret;
          if (err) {
            throw err;
          }
          ret = _this.encode(data, base64);
          if (typeof callback === 'function') {
            return callback.apply(null, [ret]);
          }
        };
      })(this));
    }
  };

}).call(this);
