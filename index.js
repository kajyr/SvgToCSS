(function() {
  var Mustache, addMeasurements, defaults, encode, fs, fsp, getTemplate, mkdirp, parseString, path, pmkdirp, readFile, render, spriteName, write, _extend, _merge;

  fs = require('fs');

  path = require('path');

  mkdirp = require('mkdirp');

  fsp = require('fs-promise');

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

  pmkdirp = function(dir) {
    return new Promise(function(resolve, reject) {
      return mkdirp(dir, function(error) {
        if (error) {
          return reject(error);
        }
        return resolve(dir);
      });
    });
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

  getTemplate = function(options) {
    return fsp.readFile(options.style.toLowerCase() === 'scss' ? options.templateSCSS : options.templateCSS, 'utf8');
  };

  write = function(rendered, cwd, dest) {
    return pmkdirp(cwd).then(function() {
      return fsp.writeFile("" + cwd + dest, rendered).then(function() {
        return rendered;
      });
    });
  };

  spriteName = function(options) {
    if (options.sprite != null) {
      return options.sprite;
    }
    return options.spriteFileName + '.' + options.style.toLowerCase();
  };

  render = function(files, template) {
    return Mustache.render(template, {
      files: files
    });
  };

  addMeasurements = function(file) {
    return new Promise(function(resolve, reject) {
      return parseString(file.data, (function(_this) {
        return function(err, result) {
          file.width = result.svg.$.width;
          file.height = result.svg.$.height;
          return resolve(file);
        };
      })(this));
    });
  };

  encode = function(data, base64) {
    if (base64 === true) {
      return new Buffer(data).toString('base64');
    }
    return encodeURIComponent(data);
  };

  readFile = function(filename, base64) {
    return fsp.readFile(filename, 'utf8').then(function(data) {
      return {
        name: path.basename(filename, '.svg'),
        data: data,
        encoded: encode(data, base64),
        base64: base64
      };
    }).then(addMeasurements);
  };

  module.exports = {
    defaults: defaults,
    encode: function(files, params) {
      var file, options;
      options = _merge(defaults, params);
      return Promise.all((function() {
        var _i, _len, _ref, _results;
        _ref = [].concat(files);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          file = _ref[_i];
          _results.push(readFile(file, options.base64));
        }
        return _results;
      })()).then(function(files) {
        return getTemplate(options).then(function(template) {
          return render(files, template);
        });
      }).then(function(rendered) {
        return write(rendered, options.cwd, spriteName(options));
      });
    }
  };

}).call(this);
