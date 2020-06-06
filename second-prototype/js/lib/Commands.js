var sc = sc || {};

/**
 * @namespace Commands
 * @memberOf sc
 *
 */

sc.Commands = {
  Wicket: function(data) {
    sc.Command.call(this, data);
    this.data = data;
    this.logger = new sc.Logger('Wicket');
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
    this.get_next_batsman_no = function(data) {
      this.logger.debug(JSON.stringify(data.left_bat) + ' : ' + JSON.stringify(data.right_bat));
      var next_batsman_no =
        data.left_bat.no > data.right_bat.no ?
        data.left_bat.no + 1 :
        data.right_bat.no + 1;
      this.logger.debug('get_next_batsman_no returning: ' + next_batsman_no);
      return next_batsman_no;
    };

    // Make the next batsman the striker.
    this.set_striker_as_new = function(data) {
      if (data.left_bat.striker === true) {
        data.left_bat = sc.Utils.clone(data.templates.Batsman);
        data.left_bat.no = data.next_batsman_no;
        data.left_bat.striker = true;
      } else {
        data.right_bat = sc.Utils.clone(data.templates.Batsman);
        data.right_bat.no = data.next_batsman_no;
        data.right_bat.striker = true;
      }
      data.next_batsman_no = this.get_next_batsman_no(data);
    };
  },

  StandardBall: function(args) {
    if (!(args instanceof Array) || args.length != 2) {
      throw new Error(
        "StandardBall Parameter args must be an array of length 2"
      );
    }

    this.logger = new sc.Logger('StandardBall');

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
      this.logger.debug("About to call add_runs_to_striker " + JSON.stringify(this.data.left_bat));
      this.player_manager().add_runs_to_striker(this.data, this.runs);

      this.logger.debug("About to call add_ball " + JSON.stringify(this.data.left_bat));
      this.over_manager().add_ball(
        this.data.left_bat.striker ? this.data.left_bat : this.data.right_bat,
        this.runs,
        0,
        false,
        true
      );

      this.player_manager().change_ends(this.data, this.runs);
      this.over();
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
      this.data.balls += 1;

      this.over_manager().add_ball(
        this.data.left_bat.striker ? this.data.left_bat : this.data.right_bat,
        0,
        1,
        false,
        true
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

      this.player_manager().set_bowler_details(this.data);

      console.log("End start_bowling");
      return true;

    };
  },

  StopBowling: function(args) {
    this.name = "StopBowling";
    this.logger = new sc.Logger(this.name);

    this.logger.debug("XXXXXXXXXXXXXXXXXXXXXXXXXXX "+JSON.stringify(args));
    if ((!is.array(args)) || args.length != 2) {
      this.logger.error(JSON.stringify(args));
      throw new Error(this.name + " expects an array with two elements");
    }

    this.data = args[0];
    this.player = args[1];

    sc.Command.call(this, this.data);

    this.validator("StopBowling").check_all_defined(this, [
      "data",
      "data.away_players",
      "data.home_players",
      "player",
    ]);

    this.run = function() {

      console.log("--");
      console.log("StopBowling.run");

      var bowling_team_players = this.player_manager().get_team_players(this.data, 'bowling');

      var i = this.player_manager().lookup(bowling_team_players, this.player);
      if (i >= 0) {
        this.bowling_team_players[i].bowling = false;
        this.player_manager().set_bowler_details(this.data);
        console.log("End StopBowling.run");
        return true;
      }

      console.log("StopBowling.run. Player was not bowling");
      return false;

    };
  },

  Run: function(object, args) {
    object.prototype = Object.create(sc.Command.prototype);
    // object.prototype.Constructor = sc.Command.Wicket;

    var o = new object(args);

    o.run();
    return 1;
  }
  //Wicket.prototype = Command;
};
