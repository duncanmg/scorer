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
  'DEBUG': 1,
  'INFO': 2,
  'WARN': 3,
  'ERROR': 4
};

sc.Logger = function(name, level) {

  if (!(name && level)) {
    throw new Error("Logger needs name and level");
  }
  this.name = name;
  this.level = level;

  var label = ['', 'DEBUG', 'INFO', 'WARN', 'ERROR'];

  var config = {
    'PlayerManager': sc.LoggerLevels.DEBUG,
    'Commands': sc.LoggerLevels.DEBUG,
    'Command': sc.LoggerLevels.DEBUG
  };

  this.debug = function(text) {

    if (!config[this.name] || config[this.name] < this.level) {
      return true;
    }
    if (this.level < sc.LoggerLevels.DEBUG) {
      return true;
    }
    console.log('DEBUG ' + this.name + ' ' + text);
  };

  this.info = function(text) {

    if (!config[this.name] || config[this.name] < this.level) {
      return true;
    }
    if (this.level < sc.LoggerLevels.INFO) {
      return true;
    }
    console.log('INFO ' + this.name + ' ' + text);
  };

  this.warn = function(text) {

    if (!config[this.name] || config[this.name] < this.level) {
      return true;
    }
    if (this.level < sc.LoggerLevels.WARN) {
      return true;
    }
    console.log('WARN ' + this.name + ' ' + text);
  };

  this.error = function(text) {

    if (!config[this.name] || config[this.name] < this.level) {
      return true;
    }
    if (this.level < sc.LoggerLevels.ERROR) {
      return true;
    }
    console.log('ERROR ' + this.name + ' ' + text);
  };

};
