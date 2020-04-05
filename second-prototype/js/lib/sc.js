/*jslint vars:true, plusplus:true, devel:true, nomen:true, indent:4, maxerr:50*/

/**
 * @namespace sc
 * @memberOf scorer.lib
 *
 */
var sc = sc || {};

/*jslint vars:true, plusplus:true, devel:true, nomen:true, indent:4, maxerr:50*/
sc.test = function() {
  /*jslint vars:true, plusplus:true, devel:true, nomen:true, indent:4, maxerr:50*/
  console.log("Hello from sc.test");
  return "test";
};

sc.test_object = function() {
  this.msg = function() {
    console.log("Hello from sc.test_object");
    return "test_object";
  };
};

/**
 * @class Scoreboard
 * @memberOf sc
 * @constructor Scoreboard
 * @param {ScoreboardTemplate} scoreboard_template
 * @param {Players} Players
 * @param {Over} Over
 * @property {number} scoreboard - The current innings. Always innings[0] of the ScoreboardTemplate object.
 * @property {array} next_innings - The next innings. Always innings[1] of the ScoreboardTemplate object.
 * @property {Players} home_players -
 * @property {Players} away_players -
 * @property {boolean} is_ready -
 * @property {Players} home_players -
 */
sc.Scoreboard = function(scoreboard_template, Players, Over) {
  var s = jQuery.extend(true, {}, scoreboard_template);

  this.scoreboard = s.innings[0];
  this.scoreboard.home_players = [].concat(
    this.scoreboard.templates.HomePlayers
  );
  this.scoreboard.away_players = [].concat(
    this.scoreboard.templates.AwayPlayers
  );

  this.next_innings = s.innings[1];

  // console.log("scoreboard " + JSON.stringify(this.scoreboard));
  /**
   * @method change_ends
   * @memberOf sc.Scoreboard
   * @description Accept the number of times the batsmen ran and calculate whether
   * the batsmen changed ends. If they did, toggle the values of scoreboard.left_bat.striker
   * and scoreboard.right_bat.striker.
   * @param {integer} num_runs - Number of times the batsmen ran on the last ball.
   */
  this.change_ends = function(num_runs) {
    if (num_runs % 2 === 0) {
      return true;
    }
    if (this.scoreboard.left_bat.striker === true) {
      this.scoreboard.left_bat.striker = false;
      this.scoreboard.right_bat.striker = true;
    } else {
      this.scoreboard.left_bat.striker = true;
      this.scoreboard.right_bat.striker = false;
    }
  };

  /**
   *  @function change_bowlers
   *  @description Swop the objects in scoreboard.bowler and scoreboard.next_bowler. Called at the end of each over.
   *  @memberOf sc.Scoreboard
   */
  this.change_bowlers = function() {
    var tmp = this.scoreboard.bowler;
    this.scoreboard.bowler = this.scoreboard.next_bowler;
    this.scoreboard.next_bowler = tmp;
    console.log(
      "After change_bowlers: bowler " + JSON.stringify(this.scoreboard.bowler)
    );
    console.log(
      "After change_bowlers: next " +
        JSON.stringify(this.scoreboard.next_bowler)
    );
  };

  /** @function alert_game_over
   *  @description Alert if the scoreboard.game_over flag is true.
   *  @memberOf sc.Scoreboard
   *  @private
   */
  this.alert_game_over = function() {
    if (this.scoreboard.game_over === true) {
      alert("The game is over!");
      return true;
    }
    return this.alert_innings_over();
  };

  /** @function alert_innings_over
   *  @description Alert if the scoreboard.gamer_over flag is false and the
   *  scoreboard.innings_overs flag is true.
   *  @memberOf sc.Scoreboard
   *  @private
   *  @return {boolean}
   */
  this.alert_innings_over = function() {
    if (
      this.scoreboard.game_over === false &&
      this.scoreboard.innings_over === true
    ) {
      alert("The innings is over!");
      this.new_innings();
      return true;
    }
    return false;
  };

  /** @function alert_no_bowler
   *  @description Alert if the bowler is not set.
   *  @memberOf sc.Scoreboard
   *  @private
   *  @return boolean
   */
  this.alert_no_bowler = function() {
    if (!this.scoreboard.bowler.name) {
      alert("Please select a bowler.");
      return true;
    }
    return false;
  };

  /** @function bowls
   *  @description Called when a delivery is anything except "other".
   *  @memberOf sc.Scoreboard
   *  @return {boolean}
   */
  this.bowls = function(type, runs) {
    if (this.alert_game_over()) {
      return false;
    }
    if (this.alert_no_bowler()) {
      return false;
    }

    switch (type) {
      case "wicket":
        this.wicket();
        break;
      case "bye":
        sc.Commands.Run(sc.Commands.Bye, this.scoreboard);
        break;
      case "leg_bye":
        sc.Commands.Run(sc.Commands.LegBye, this.scoreboard);
        break;
      case "no_ball":
        sc.Commands.Run(sc.Commands.NoBall, this.scoreboard);
        break;
      case "wide":
        sc.Commands.Run(sc.Commands.Wide, this.scoreboard);
        break;
      case "ball":
        this.ball(runs);
        // this.change_ends(runs);
        break;
    }
    this.over();
    this.set_game_over();
    this.save();
  };

  /** @function set_game_over
   *  @description Calls set_innings_over and then set game_over if there are no
   *  more innings.
   *  @memberOf sc.Scoreboard
   */
  this.set_game_over = function() {
    this.set_innings_over();
    if (
      this.scoreboard.last_innings > 0 &&
      this.scoreboard.total > this.scoreboard.last_innings
    ) {
      this.scoreboard.game_over = true;
    }
    if (this.scoreboard.innings_over && this.scoreboard.innings_no > 1) {
      this.scoreboard.game_over = true;
    }
  };

  /** @function set_innings_over
   *  @description Set the innings over flag if 10 wickets have been taken
   *  or the last over has been completed.
   *  @memberOf sc.Scoreboard
   * return {boolean}
   */
  this.set_innings_over = function() {
    if (this.scoreboard.wickets >= 10) {
      this.scoreboard.innings_over = true;
    }
    //alert(this.scoreboard.num_overs + ' : ' + this.scoreboard.overs);
    if (
      this.scoreboard.num_overs &&
      this.scoreboard.overs >= this.scoreboard.num_overs
    ) {
      //alert(1);
      this.scoreboard.innings_over = true;
    }
    return this.scoreboard.innings_over;
  };
  /** @function over
   *  @description Test if the over has been completed. If it has, then
   * prepare for the next one.
   *  @memberOf sc.Scoreboard
   */
  this.over = function() {
    if (this.scoreboard.balls >= 6) {
      this.scoreboard.balls = 0;
      this.scoreboard.overs += 1;
      this.scoreboard.overs_and_balls = this.scoreboard.overs;
      this.change_ends();
      this.change_bowlers();
      // alert("About to add over " + parseInt(this.scoreboard.overs + 1));
      this.add_over(
        parseInt(this.scoreboard.overs) + 1,
        this.scoreboard.bowler
      );
    } else {
      this.scoreboard.overs_and_balls =
        this.scoreboard.overs + "." + this.scoreboard.balls;
    }
  };

  /** @function add_runs_to_striker
   *  @description Add the runs to the batsman's score.
   *  @memberOf sc.Scoreboard
   *  @param {integer} runs - Number of runs to be added.
   */
  this.add_runs_to_striker = function(runs) {
    if (this.scoreboard.left_bat.striker) {
      this.scoreboard.left_bat.runs += runs;
    } else {
      this.scoreboard.right_bat.runs += runs;
    }
  };

  /** @function ball
   *  @description Handle valid ball/delivery.
   *  @memberOf sc.Scoreboard
   *  @param {integer} - Number of runs scored off the ball.
   */
  this.ball = function(runs) {
    var s = sc.Commands.Run(sc.Commands.StandardBall, [this.scoreboard, runs]);
  };

  // this.wicket = function() {
  //   var w = sc.Commands.Run(sc.Commands.StandardBall, this.scoreboard);
  //
  //   this.scoreboard.total += runs;
  //   this.scoreboard.balls++;
  //   this.add_runs_to_striker(runs);
  //   this.add_ball(
  //     this.scoreboard.left_bat.striker
  //       ? this.scoreboard.left_bat
  //       : this.scoreboard.right_bat,
  //     runs,
  //     0,
  //     false,
  //     true
  //   );
  // };

  /** @function wicket
   *  @description Called when a wicket is taken.
   *  @memberOf sc.Scoreboard
   */
  this.wicket = function() {
    var w = sc.Commands.Run(sc.Commands.Wicket, this.scoreboard);

    console.log("NOT IMPLEMENTED save");
    // this.save();
  };

  /** @function add_extra
   *  @description Called when an extra is bowled.
   *  @memberOf sc.Scoreboard
   *  @param {Extra} extra - The Extra object for the ball.
   */
  this.add_extra = function(extra) {
    if (this.alert_game_over()) {
      return false;
    }
    this.add_extras[extra.type](this, extra);
    this.set_game_over();
    this.save();
  };

  /** @function add_extras
   *  @description Does the hard work for add_extra().
   *  @memberOf sc.Scoreboard
   *  @param {Scoreboard} obj - ?????
   *  @param {Extra} extra - The Extra object for the ball.
   */
  this.add_extras = {
    no_ball: function(obj, extra) {
      obj.scoreboard.total += extra.runs + extra.extras;
      obj.add_runs_to_striker(extra.runs);
      obj.change_ends(extra.runs + extra.extras - 1);
      obj.add_ball(
        obj.scoreboard.left_bat.striker
          ? obj.scoreboard.left_bat
          : obj.scoreboard.right_bat,
        extra.runs,
        extra.extras,
        false,
        false
      );
    },
    wide: function(obj, extra) {
      obj.scoreboard.total += extra.extras;
      obj.add_ball(
        obj.scoreboard.left_bat.striker
          ? obj.scoreboard.left_bat
          : obj.scoreboard.right_bat,
        0,
        extra.extras,
        false,
        false
      );
      if (extra.extras > 1) {
        obj.change_ends(extra.extras - 1);
      }
    },
    leg_bye: function(obj, extra) {
      obj.scoreboard.balls++;
      obj.scoreboard.total += extra.extras;
      obj.add_ball(
        obj.scoreboard.left_bat.striker
          ? obj.scoreboard.left_bat
          : obj.scoreboard.right_bat,
        0,
        extra.extras,
        false,
        true
      );
      obj.change_ends(extra.extras);
      obj.over();
    },
    bye: function(obj, extra) {
      obj.scoreboard.balls++;
      obj.scoreboard.total += extra.extras;
      obj.add_ball(
        obj.scoreboard.left_bat.striker
          ? obj.scoreboard.left_bat
          : obj.scoreboard.right_bat,
        0,
        extra.extras,
        false,
        true
      );
      obj.change_ends(extra.extras);
      obj.over();
    }
  };

  /** @function save
   *  @description Save the current scoreboard object.
   *  @memberOf sc.Scoreboard
   */
  this.save = function() {
    storage.put_scoreboard(this.scoreboard);
  };

  /** @function new_match
   *  @description Initialise a new match.
   *  @memberOf sc.Scoreboard
   */
  this.new_match = function() {
    var s = new ScoreboardTemplate(Settings);
    console.log("new_match s.innings[0].overs_history");
    console.log(JSON.stringify(s.innings[0].overs_history));
    console.log("new_match this.scoreboard.overs_history");
    console.log(JSON.stringify(this.scoreboard.overs_history));
    this.scoreboard = s.innings[0];
    this.next_innings = s.innings[1];
    console.log("new_match");
    console.log(JSON.stringify(this));
    this.save();
  };

  /** @function new_innings
   *  @description Start a new innings.
   *  @memberOf sc.Scoreboard
   */
  this.new_innings = function() {
    storage.put("last_innings", this.scoreboard);
    var last_innings_runs = this.scoreboard.total;
    var last_overs_history = this.scoreboard.overs_history;
    var num_overs = this.scoreboard.num_overs;
    this.scoreboard = this.next_innings;
    this.scoreboard.last_innings = last_innings_runs;
    this.scoreboard.last_overs_history = last_overs_history;
    this.scoreboard.target = last_innings_runs + 1;
    this.scoreboard.innings_no += 1;
    this.scoreboard.batting_team =
      this.scoreboard.batting_team == "home" ? "away" : "home";
    this.scoreboard.num_overs = num_overs;
    this.set_batsmen_details();
  };

  /** @function set_batting_team
   * @description Set the batting team.
   *  @memberOf sc.Scoreboard
   *  @param {Players} - batting_team - The batting team.
   */
  this.set_batting_team = function(batting_team) {
    if (batting_team != this.scoreboard.batting_team) {
      this.scoreboard.batting_team = batting_team;
      this.set_batsmen_details();
      //alert("About to set_bowler_details");
      this.set_bowler_details();
      //alert("Done");
    }
  };

  /** @function set_batsmen_details
   *  @description Set the batsman's details based on the list of players.
   *  @memberOf sc.Scoreboard
   */
  this.set_batsmen_details = function() {
    var check = function(batsman, players) {
      for (var i = 0; i < players.length; i++) {
        if (batsman.no == players[i].batting_no) {
          batsman.name = players[i].name;
          batsman.id = players[i].id;
          batsman.description = players[i].description;
          batsman.bowling = players[i].bowling;
          batsman.bowler = players[i].bowler;
          return batsman;
        }
      }
      return false;
    };

    var players =
      this.scoreboard.batting_team == "home"
        ? this.home_players.players
        : this.away_players.players;
    console.log("set_batsmen_details");
    console.log(JSON.stringify(this.scoreboard));
    this.left_bat = check(this.scoreboard.left_bat, players);
    this.right_bat = check(this.scoreboard.right_bat, players);
    // alert(JSON.stringify(this.scoreboard.right_bat));
  };

  // ***********************************************************************
  /** @function set_bowler_details
   * @description Manage the bowler details based on the list of players.
   * @memberOf sc.Scoreboard
   */
  this.set_bowler_details = function() {
    console.log("Start set_bowler_details");
    /** @function is_bowling
     * @description Accept a list of bowler objects and a bowler. Return true
     * if the bowler is current bowling.
     */
    var is_bowling = function(bowlers, bowler) {
      for (var i = 0; i < bowlers.length; i++) {
        if (bowlers[i].id == bowler.id) {
          console.log(
            "set_bowler_details is_bowling true for bowler.id " + bowler.id
          );
          return bowlers[i];
        }
      }
      console.log(
        "set_bowler_details is_bowling false for bowler.id " + bowler.id
      );
      return false;
    };

    /** @function set_bowler
     * @description Accept a list of bowlers and a bowler. */
    var set_bowler = function(bowlers, bowler) {
      if (!bowlers.length) {
        console.log("WARN set_bowler_details. No bowlers!");
        return {};
      }
      if (!bowler.id) {
        // No bowler id. Just return first bowler in list.
        console.log("INFO set_bowler_details. Return first bowler in list.");
        return bowlers.shift;
      } else if (!is_bowling(bowlers, bowler)) {
        console.log(
          "WARN set_bowler_details. Bowler " + bowler.id + " is not bowling."
        );
        return {};
      } else {
        var b = bowlers[0].id == bowler.id ? bowlers.shift() : bowlers.pop();
        console.log("INFO set_bowler_details. Return bowler " + b.id);
        return b;
      }
      console.log("INFO set_bowler_details. Return bowler " + bowler.id);
      return bowler;
    };

    var bowling_team =
      this.scoreboard.batting_team == "home"
        ? this.away_players
        : this.home_players;
    // Bowlers is a sorted list of the players in the bowling list who
    // are currently bowling. Rebuilt each time, so it
    // can be modified safely. Two entries max!
    var bowlers = bowling_team.get_bowling();
    console.log("set_bowler_details: bowlers list:" + JSON.stringify(bowlers));
    this.scoreboard.bowler = set_bowler(bowlers, this.scoreboard.bowler);
    console.log(
      "set_bowler_details: bowler  : " + JSON.stringify(this.scoreboard.bowler)
    );
    this.scoreboard.next_bowler = set_bowler(
      bowlers,
      this.scoreboard.next_bowler
    );
    console.log(
      "set_bowler_details: next_bowler : " +
        JSON.stringify(this.scoreboard.next_bowler)
    );
    if (!this.scoreboard.bowler.id) {
      this.scoreboard.bowler = set_bowler(bowlers, this.scoreboard.bowler);
      console.log(
        "set_bowler_details: bowler  : " +
          JSON.stringify(this.scoreboard.bowler)
      );
    }
    if (!this.scoreboard.next_bowler.id) {
      this.scoreboard.next_bowler = set_bowler(
        bowlers,
        this.scoreboard.next_bowler
      );
      console.log(
        "set_bowler_details: next_bowler : " +
          JSON.stringify(this.scoreboard.next_bowler)
      );
    }
  };

  // ***********************************************************************
  /** @function reset
   *  @description Reset the list of players. This means reading the latest data
   *  from storage and setting home_players and away_players.
   *  @memberOf sc.Scoreboard
   */
  this.reset = function() {
    console.log("1 reset");
    console.log("2 reset");
    console.log("Players: " + JSON.stringify(Players));
    Players.set_team("home");
    Players.reset();
    console.log("4 reset");
    this.home_players = jQuery.extend(true, {}, Players);
    Players.set_team("away");
    Players.reset();
    console.log("5 reset");
    this.away_players = jQuery.extend(true, {}, Players);
    this.set_batsmen_details();
    console.log("6 reset");
    this.set_bowler_details();
    console.log("End reset");
  };

  /** @function add_over
   * @description Add an over.
   *  @memberOf sc.Scoreboard
   *  @param {integer} over_no - The number of the over.
   *  @param {Player}  bowler_obj - The bowler of the over.
   */
  this.add_over = function(over_no, bowler_obj) {
    console.log("add_over " + over_no);
    console.log("bowler_obj " + JSON.stringify(bowler_obj));
    this.scoreboard.overs_history.push(new Over(over_no, bowler_obj));
    alert("Over");
  };
  /** @function add_ball
   * @description Add a ball
   *  @memberOf sc.Scoreboard
   *  @param striker
   *  @param runs
   *  @param extras
   *  @param wkt
   *  @param valid
   */
  this.add_ball = function(striker, runs, extras, wkt, valid) {
    if (!this.scoreboard.overs_history.length) {
      alert("xxxxx " + this.add_over);
      this.add_over(1, this.scoreboard.bowler);
    }
    alert(this.scoreboard.overs_history.length);
    var over = this.scoreboard.overs_history[
      this.scoreboard.overs_history.length - 1
    ];
    if (over.valid_balls >= 6) {
      alert("The over has finished.");
    }
    this.scoreboard.overs_history[
      this.scoreboard.overs_history.length - 1
    ].balls.push(new Ball(striker, runs, extras, wkt, valid));
    if (valid) {
      this.scoreboard.overs_history[
        this.scoreboard.overs_history.length - 1
      ].valid_balls += 1;
    }
    this.scoreboard.overs_history[
      this.scoreboard.overs_history.length - 1
    ].total_balls += 1;
  };
  /** @function is_ready
   * @description True if the set up is complete.
   *  @memberOf scorer.factory.Scoreboard
   *  @return {boolean}
   */
  this.is_ready = function() {
    if (!this.scoreboard.overs_history.length) {
      return false;
    }
    if (
      this.scoreboard.overs_history[this.scoreboard.overs_history.length - 1]
        .valid_balls >= 6
    ) {
      return false;
    }
    return true;
  };

  /** @function clear
   *  @description Clear the overs history.
   *  @memberOf sc.Scoreboard
   */
  this.clear = function() {
    this.scoreboard.overs_history = [];
  };
};
