/*jslint vars:true, plusplus:true, devel:true, nomen:true, indent:4, maxerr:50*/

/**
 * @namespace Logger
 * @memberOf sc
 *
 */
var sc = sc || {};

/**
 * @class Logger
 * @memberOf sc
 * @constructor Logger
 *
 */

sc.LoggerHttp = undefined;

sc.LoggerLevels = {
  'OFF': 0,
  'DEBUG': 1,
  'INFO': 2,
  'WARN': 3,
  'ERROR': 4,
};

sc.LoggerConfig = {
  'Command': sc.LoggerLevels.DEBUG,
  'Commands': sc.LoggerLevels.DEBUG,
  'ModifyPlayerDetails': sc.LoggerLevels.DEBUG,
  'OverManager': sc.LoggerLevels.DEBUG,
  'PlayerManager': sc.LoggerLevels.DEBUG,
  'Scoreboard': sc.LoggerLevels.DEBUG,
  'StandardBall': sc.LoggerLevels.INFO,
  'StartBowling': sc.LoggerLevels.DEBUG,
  'StopBowling': sc.LoggerLevels.DEBUG,
  'Storage': sc.LoggerLevels.INFO,
  'Wicket': sc.LoggerLevels.INFO,
};

sc.Logger = function(name) {

  if (!name) {
    throw new Error("Logger needs name");
  }
  this.name = name;

  this.verbose = 0;

  var label = ['', 'DEBUG', 'INFO', 'WARN', 'ERROR'];

  var config = sc.LoggerConfig;

  this.debug = function(text) {
    if (this.log(sc.LoggerLevels.DEBUG)) {
      this.output('DEBUG ' + this.name + ' ' + text);
    }
  };

  this.info = function(text) {

    if (this.log(sc.LoggerLevels.INFO)) {
      this.output('INFO ' + this.name + ' ' + text);
    }
  };

  this.warn = function(text) {

    if (this.log(sc.LoggerLevels.WARN)) {
      this.output('WARN ' + this.name + ' ' + text);
    }

  };

  this.error = function(text) {

    if (this.log(sc.LoggerLevels.ERROR)) {
      this.output('ERROR ' + this.name + ' ' + text);
    }

  };

  // private
  this.log = function(method_level) {
    var level = this.get_level();
    this.verbose_msg(
      'level=' + level + ' method_level=' + method_level);

    if (is.existy(level) && level <= method_level) {
      this.verbose_msg('Log it');
      return true;
    }
    return false;
  }

  // private
  this.level = undefined;

  var validate_level = function(level) {
    var level_ok = 0;

    if (!is.existy(level)) {
      return 1;
    }

    for (var k in sc.LoggerLevels) {
      // console.log("k=" + k + " level=" + level);
      if (sc.LoggerLevels[k] === level) {
        level_ok = 1;
      }
    }
    if (!level_ok) {
      throw new sc.InvalidParamError('Invalid logger level ' + level);
    }
    return 1;
  };

  // Override the level in the configuration. Set to undefine to disable.
  this.set_level = function(level) {
    validate_level(level);
    this.level = level;
  };

  this.get_level = function() {
    if (is.existy(this.level)) {
      if (this.verbose) {
        console.log("Attribute level set to " + this.level);
      }
      return this.level;
    }
    this.verbose_msg(
      config[this.name] ?
      "Configured level is " + config[this.name] :
      "Level is not configured");
    validate_level(config[this.name]);
    return config[this.name];
  };

  this.verbose_msg = function(msg) {
    if (this.verbose) {
      console.log('In Logger ' + this.name + ': ' + msg);
    }
  }

  this.output = function(msg) {
    if (!sc.LoggerHttp) {
      console.log(msg);
    } else {
      sc.LoggerHttp.post('/log', { 'msg' : msg });
    }
  };

};
