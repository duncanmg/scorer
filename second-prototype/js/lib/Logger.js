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
  'ERROR': 4,
};

sc.LoggerConfig = {
  'PlayerManager': sc.LoggerLevels.DEBUG,
  'Commands': sc.LoggerLevels.DEBUG,
  'Command': sc.LoggerLevels.DEBUG,
  'Storage': sc.LoggerLevels.DEBUG,
  'Scoreboard': sc.LoggerLevels.DEBUG,
};

sc.Logger = function(name) {

  if (!name) {
    throw new Error("Logger needs name");
  }
  this.name = name;

  var label = ['', 'DEBUG', 'INFO', 'WARN', 'ERROR'];

  var config = sc.LoggerConfig;

  this.debug = function(text) {
    if (this.log(sc.LoggerLevels.DEBUG)) {
      console.log('DEBUG ' + this.name + ' ' + text);
    }
  };

  this.info = function(text) {

    if (this.log(sc.LoggerLevels.INFO)) {
      console.log('INFO ' + this.name + ' ' + text);
    }
  };

  this.warn = function(text) {

    if (this.log(sc.LoggerLevels.WARN)) {
      console.log('WARN ' + this.name + ' ' + text);
    }

  };

  this.error = function(text) {

    if (this.log(sc.LoggerLevels.ERROR)) {
      console.log('ERROR ' + this.name + ' ' + text);
    }

  };

  // private
  this.log = function(method_level) {
    var level = this.get_level();
    // console.log('level='+level+' method_level=' +method_level);
    if (is.existy(level) && level <= method_level) {
      // console.log('Log it');
      return true;
    }
    return false;
  }
  // private
  this.level = undefined;

  // Override the level in the configuration. Set to undefine to disable.
  this.set_level = function(level) {
    // console.log('set level to ' + level);
    this.level = level;
  };

  this.get_level = function() {
    if (is.existy(this.level)) {
      return this.level;
    }
    return config[this.name];
  };

};
