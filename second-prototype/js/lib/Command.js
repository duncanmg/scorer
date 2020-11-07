var sc = sc || {};

/**
 * @namespace Command
 * @memberOf sc
 *
 */

/**
 * @class Command
 * @memberOf sc
 * @constructor Command
 */

sc.Command = function() {
  this.test = "test";

  /** @function set_innings_over
   *  @memberOf sc.Command
   *  @description Set the innings over flag if 10 wickets have been taken
   *  or the last over has been completed.
   *  @return {boolean}
   */
  this.set_innings_over = function() {
    if (this.data.wickets >= 10) {
      this.data.innings_over = true;
    }
    //alert(this.scoreboard.num_overs + ' : ' + this.scoreboard.overs);
    if (this.data.num_overs && this.data.overs >= this.data.num_overs) {
      //alert(1);
      this.data.innings_over = true;
    }
    return this.data.innings_over;
  };

  /** @function set_game_over
   *  @description Calls set_innings_over and then sets game_over if the
   *  second innings has ended.
   *  @memberOf sc.Command
   *  @return {boolean}
   */
  this.set_game_over = function() {
    this.set_innings_over();

    if (this.data.innings_no <= 1) {
      return false;
    }

    if (this.data.total > this.data.last_innings) {
      this.data.game_over = true;
      return true;
    }

    if (this.data.innings_over) {
      this.data.game_over = true;
      return true;
    }

    return false;
  };

  /**
   * @function over_manager
   * @memberOf sc.Command
   * @description Return a new OverManager object.
   * @return {OverManager}
   */
  this.over_manager = function() {
    return new sc.OverManager(this.data);
  };

  /**
   * @function player_manager
   * @memberOf sc.Command
   * @description Return a new PlayerManager object.
   * @return {PlayerManager}
   */
  this.player_manager = function() {
    return new sc.PlayerManager();
  };

  /**
   * @function validator
   * @memberOf sc.Command
   * @param name {String} A name to be used in the error messages
   * @description Return a new Validator object.
   * @return {Validator}
   */
  this.validator = function(name) {
    /**
     * @class Validator
     * @memberOf sc.Command.validator
     * @constructor Validator
     * @param name {String} A name to be used in the error messages.
     * @return {Validator}
     */
    var Validator = function(name) {
      this.name = name;
      this.msg = this.name + ". A mandatory parameter is missing: ";

      this.check_namespaces_defined = function(obj, element) {
        var namespaces = element.split(".");
        var done = "";
        var context = obj;
        for (var i = 0; i < namespaces.length; i++) {
          context = context[namespaces[i]];
          done = done + "." + namespaces[i];
          if (!is.existy(context)) {
            throw new Error(this.msg + done);
          }
        }
      };

      /**
       * @function check_all_defined
       * @memberOf validator
       * @description Accepts an object and a list of properties it
       * should have. Throws an error if any do not exist.
       * @param obj {Object} The object to be tested.
       * @param list {Array} List of properties
       * @return {void}
       * @throws {Error}
       */
      this.check_all_defined = function(obj, list) {
        for (var x = 0; x < list.length; x++) {
          var p = list[x];
          this.check_namespaces_defined(obj, p);
        }
      };
    };
    return new Validator(name);
  };

  /** @function over
   *  @memberOf sc.Command
   *  @description Test if the over has been completed. If it has, then
   * prepare for the next one.
   *  @memberOf sc.Scoreboard
   */
  this.over = function() {
    this.validator("over").check_all_defined(this.data, [
      "balls",
      "overs",
      "overs_and_balls",
      "bowler"
    ]);

    if (this.over_manager().over_complete()) {
      this.player_manager().change_ends(this.data, 1);

      this.player_manager().change_bowlers(this.data);

      this.over_manager().add_over(
        parseInt(this.over_manager().completed_overs()) + 1,
        this.data.bowler
      );
    }
    this.data.overs_and_balls = this.over_manager().overs_and_balls();
  };
};
