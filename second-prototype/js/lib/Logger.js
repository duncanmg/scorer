/*jslint vars:true, plusplus:true, devel:true, nomen:true, indent:4, maxerr:50*/

/**
 * @namespace sc
 * @memberOf scorer.lib
 *
 */
var sc = sc || {};

/**
 * @class Logger
 * @memberOf sc
 * @constructor Logger
 *
 */

sc.LoggerLevels = {
  'OFF': 0,
  'DEBUG': 1,
  'INFO': 2,
  'WARN': 3,
  'ERROR': 4
};

sc.Logger = function(name) {

  if (!name) {
    throw new Error("Logger needs name");
  }
  this.name = name;

  var label = ['', 'DEBUG', 'INFO', 'WARN', 'ERROR'];

  var config = {
    'PlayerManager': sc.LoggerLevels.DEBUG,
    'Commands': sc.LoggerLevels.DEBUG,
    'Command': sc.LoggerLevels.DEBUG,
    'Storage': sc.LoggerLevels.DEBUG,
  };

  this.debug = function(text) {
    if (this.log(sc.LoggerLevels.DEBUG)) {
      console.log('DEBUG ' + this.name + ' ' + text);
    }
  };

  this.info = function(text) {

    if (!config[this.name] || config[this.name] < sc.LoggerLevels.INFO) {
      return true;
    }
    console.log('INFO ' + this.name + ' ' + text);
  };

  this.warn = function(text) {

    if (!config[this.name] || config[this.name] < sc.LoggerLevels.WARN) {
      return true;
    }
    console.log('WARN ' + this.name + ' ' + text);
  };

  this.error = function(text) {

    if (!config[this.name] || config[this.name] < sc.LoggerLevels.ERROR) {
      return true;
    }
    console.log('ERROR ' + this.name + ' ' + text);
  };

  // private
  this.log = function(method_level) {
    var level = this.get_level();
    if (level == undefined || level < method_level) {
      return false;
    }
    return true;
  }
  // private
  this.level = undefined;

  // Override the level in the configuration. Set to undefine to disable.
  this.set_level = function(level) {
    this.level = level;
  };

  this.get_level = function() {
    return this.level || config[this.name];
};

};
