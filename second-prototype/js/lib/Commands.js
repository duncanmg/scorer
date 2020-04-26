var sc = sc || {};

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

sc.Commands = {
  Wicket: function(data) {
    sc.Command.call(this, data);
    this.data = data;

    this.run = function() {
      data.balls++;
      data.wickets += 1;

      if (this.set_game_over()) {
        return true;
      }

      this.over_manager().add_ball(
        data.left_bat.striker ? data.left_bat : data.right_bat,
        0,
        0,
        true,
        true
      );

      this.set_striker_as_new(data);

      this.player_manager().set_batsmen_details(data);

      this.over();
    };

    // Allocate the next batsman's number. If current batsmen are
    // 3 and 6. Next batman will be 7.
    this.set_next_batsman_no = function(data) {
      var next_batsman_no =
        data.left_bat.no > data.right_bat.no ?
        data.left_bat.no + 1 :
        data.right_bat.no + 1;
      return next_batsman_no;
    };

    // Make the next batsman the striker.
    this.set_striker_as_new = function(data) {
      if (data.left_bat.striker === true) {
        data.left_bat = new data.templates.Batsman();
        data.left_bat.no = this.set_next_batsman_no(data);
        data.left_bat.striker = true;
      } else {
        data.right_bat = new data.templates.Batsman();
        data.right_bat.no = this.set_next_batsman_no(data);
        data.right_bat.striker = true;
      }
    };
  },

  StandardBall: function(args) {
    if (!(args instanceof Array) || args.length != 2) {
      throw new Error(
        "StandardBall Parameter args must be an array of length 2"
      );
    }

    this.data = args[0];
    this.runs = args[1];

    if (!this.data) {
      throw new Error("StandardBall Parameter data is mandatory");
    }

    if (typeof this.runs === "undefined") {
      throw new Error("StandardBall Parameter runs is mandatory");
    }

    if (typeof this.data.total === "undefined") {
      throw new Error("StandardBall data.total must be defined");
    }

    if (typeof this.data.balls === "undefined") {
      throw new Error("StandardBall data.balls must be defined");
    }

    if (typeof this.data.left_bat === "undefined") {
      throw new Error("StandardBall data.left_bat must be defined");
    }

    if (typeof this.data.left_bat.striker === "undefined") {
      throw new Error("StandardBall data.left_bat.striker must be defined");
    }

    if (typeof this.data.right_bat === "undefined") {
      throw new Error("StandardBall data.right_bat must be defined");
    }

    sc.Command.call(this, this.data);

    this.run = function() {
      this.data.total += this.runs;
      this.data.balls++;

      sc.validators.is_batsman(this.data.left_bat);
      sc.validators.is_batsman(this.data.right_bat);
      console.log("StandardBall About to call add_runs_to_striker " + JSON.stringify(this.data.left_bat));
      this.player_manager().add_runs_to_striker(this.data, this.runs);

      console.log("StandardBall About to call add_ball " + JSON.stringify(this.data.left_bat));
      this.over_manager().add_ball(
        this.data.left_bat.striker ? this.data.left_bat : this.data.right_bat,
        this.runs,
        0,
        false,
        true
      );

      this.player_manager().change_ends(this.data, this.runs);
    };
  },

  Wide: function(args) {
    this.data = args;

    sc.Command.call(this, this.data);

    this.validator("Wide").check_all_defined(this, [
      "data",
      "data.total",
      "data.extras",
      "data.left_bat.striker",
      "data.right_bat"
    ]);

    this.run = function() {
      this.data.extras += 1;
      this.data.total += 1;

      this.over_manager().add_ball(
        this.data.left_bat.striker ? this.data.left_bat : this.data.right_bat,
        0,
        1,
        false,
        false
      );
    };
  },
  NoBall: function(args) {
    this.data = args;

    sc.Command.call(this, this.data);

    this.validator("NoBall").check_all_defined(this, [
      "data",
      "data.total",
      "data.extras",
      "data.left_bat.striker",
      "data.right_bat"
    ]);

    this.run = function() {
      this.data.extras += 1;
      this.data.total += 1;

      this.over_manager().add_ball(
        this.data.left_bat.striker ? this.data.left_bat : this.data.right_bat,
        0,
        1,
        false,
        false
      );
    };
  },

  Bye: function(args) {
    this.data = args;

    sc.Command.call(this, this.data);

    this.validator("Bye").check_all_defined(this, [
      "data",
      "data.total",
      "data.extras",
      "data.balls",
      "data.left_bat.striker",
      "data.right_bat"
    ]);

    this.run = function() {
      this.data.extras += 1;
      this.data.total += 1;
      this.data.balls += 1;

      this.over_manager().add_ball(
        this.data.left_bat.striker ? this.data.left_bat : this.data.right_bat,
        0,
        1,
        false,
        true
      );
    };
    this.player_manager().change_ends(this.data, 1);
  },

  LegBye: function(args) {
    this.name = "LegBye";

    this.data = args;

    sc.Command.call(this, this.data);

    this.validator("Bye").check_all_defined(this, [
      "data",
      "data.total",
      "data.extras",
      "data.balls",
      "data.left_bat.striker",
      "data.right_bat"
    ]);

    this.run = function() {
      this.data.extras += 1;
      this.data.total += 1;

      this.over_manager().add_ball(
        this.data.left_bat.striker ? this.data.left_bat : this.data.right_bat,
        0,
        1,
        false,
        false
      );

      this.player_manager().change_ends(this.data, 1);
    };
  },

  StartBowling: function(args) {
    this.name = "StartBowling";

    this.data = args[0];
    this.player = args[1];

    sc.Command.call(this, this.data);

    this.validator("StartBowling").check_all_defined(this, [
      "data",
      "data.total",
      "data.extras",
      "data.balls",
      "data.left_bat.striker",
      "data.right_bat"
    ]);

    this.run = function() {

      console.log("--");
      console.log("StartBowling.run");

      var bowling_team_players = this.player_manager().get_team_players(this.data, 'bowling');

      var bowling = this.player_manager().get_bowling(bowling_team_players);
      if (bowling.length >= 2) {
        return false;
      }
      // alert(1);
      console.log("Still in start_bowling");
      var bowlers = this.player_manager().get_bowlers(bowling_team_players);
      // alert(JSON.stringify(bowlers));
      var next_bowler_no = bowlers.length ?
        bowlers[bowlers.length - 1].bowler + 1 : 1;

      console.log("next_bowler_no " + next_bowler_no);

      var i = this.player_manager().lookup(bowling_team_players, this.player);
      if (i >= 0) {
        bowling_team_players[i].bowler = next_bowler_no;
        bowling_team_players[i].bowling = true;
        console.log("i=" + i + " .bowler=" + next_bowler_no);
      }
      console.log("End start_bowling");
      return true;

    };
  },

  Run: function(object, args) {
    object.prototype = Object.create(sc.Command.prototype);
    object.prototype.Constructor = sc.Command.Wicket;

    var o = new object(args);

    o.run();
    return 1;
  }
  //Wicket.prototype = Command;
};
