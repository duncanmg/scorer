/*jslint vars:true, plusplus:true, devel:true, nomen:true, indent:4, maxerr:50*/

/**
 * @namespace sc
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
sc.Scoreboard = function(ScoreboardTemplate, Settings, Players, Over, Storage) {

  // The constructor statements are at the bottom because they rely on a couple
  // of methods having been defined.
  if (arguments.length != 5) {
    throw new Error('sc.Scoreboard requires 5 parameters Got ' + arguments.length);
  }

  this.prepare_match_in_progress = function(ScoreboardTemplate, Settings, Storage) {

    if (arguments.length != 3) {
      throw new Error("prepare_match_in_progress requires 3 arguments. Got " + arguments.length);
    }
    var scoreboard_template = new ScoreboardTemplate(Settings);

    storage = new Storage();
    var scoreboard_data = storage.get_scoreboard();

    if (scoreboard_data) {
      this.logger.debug('No need to initialise. Using stored scoreboard.');
      this.logger.debug("Data retrieved from storage: " + JSON.stringify(scoreboard_data));
      scoreboard_template.innings[0] = scoreboard_data;
    }

    // initial_scoreboard.innings[0] = stored_scoreboard;
    this.logger.debug("Modified scoreboard template: " + JSON.stringify(scoreboard_template));

    return scoreboard_template;
  };

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
    this.logger.debug(
      "After change_bowlers: bowler " + JSON.stringify(this.scoreboard.bowler)
    );
    this.logger.debug(
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
      this.logger.error("alert_no_bowler. No bowler. " + JSON.stringify(this.scoreboard));
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
    this.scoreboard = this.storage.get_scoreboard();
    // this.logger.debug("In bowls(). scoreboard= " + JSON.stringify(this.scoreboard));
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
    // this.over();
    this.set_game_over();
    this.save();
  };

  /** @function set_game_over
   *  @description Calls set_innings_over and then sets game_over if there are no
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
    this.logger.debug('set_innings_over. wickets:' + this.scoreboard.wickets +
      ' num_overs:' + this.scoreboard.num_overs + ' overs:' + this.scoreboard.overs);
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
    this.logger.debug('set_innings_over. innings_over:' + this.scoreboard.innings_over);
    return this.scoreboard.innings_over;
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

  /** @function wicket
   *  @description Called when a wicket is taken.
   *  @memberOf sc.Scoreboard
   */
  this.wicket = function() {
    var w = sc.Commands.Run(sc.Commands.Wicket, this.scoreboard);

    //this.logger.warn("NOT IMPLEMENTED save");
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

  /** @function save
   *  @description Save the current scoreboard object.
   *  @memberOf sc.Scoreboard
   */
  this.save = function() {
    this.storage.put_scoreboard(this.scoreboard);
  };

  /** @function new_match
   *  @description Initialise a new match.
   *  @memberOf sc.Scoreboard
   */
  this.new_match = function() {

    this.logger.debug("Start new_match");
    this.storage.clear();
    this.scoreboard = this.storage.get_scoreboard();
    this.logger.debug("End new_match");
  };

  /** @function new_innings
   *  @description Start a new innings.
   *  @memberOf sc.Scoreboard
   */
  this.new_innings = function() {
    storage.put("last_innings", this.scoreboard);
    var last_scoreboard = sc.Utils.clone(this.scoreboard);

    var last_innings_runs = this.scoreboard.total;
    var last_overs_history =
      sc.Utils.clone(this.scoreboard.overs_history);
    var num_overs = this.scoreboard.num_overs;

    this.scoreboard = this.next_innings;

    this.scoreboard.last_innings = last_innings_runs;

    this.scoreboard.last_overs_history = last_overs_history;
    this.scoreboard.overs_history = [];

    this.scoreboard.target = last_innings_runs + 1;
    this.scoreboard.innings_no += 1;

    this.scoreboard.batting_team =
      this.scoreboard.batting_team == "home" ? "away" : "home";

    this.scoreboard.home_players = sc.Utils.clone(last_scoreboard.home_players);
    this.scoreboard.away_players = sc.Utils.clone(last_scoreboard.away_players);

    this.scoreboard.num_overs = num_overs;
    this.scoreboard.innings_over = false;
    this.player_manager.set_batsmen_details(this.scoreboard);
    this.logger.debug('batting_team=' + this.scoreboard.batting_team);
    this.save();
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

      this.set_bowler_details();
      //alert("Done");
    }
  };

  // ***********************************************************************
  /** @function reset
   *  @description Reset the list of players. This means reading the latest data
   *  from storage and setting home_players and away_players.
   *  @memberOf sc.Scoreboard
   */
  this.reset = function() {
    this.logger.debug("Start reset");
    // this.logger.debug("2 reset");
    // this.logger.debug("Players: " + JSON.stringify(Players));
    Players.set_team("home");
    // Players.reset();
    // this.logger.debug("4 reset");
    // this.scoreboard.home_players = this.player_manager.init_players(this.scoreboard, "home");
    Players.set_team("away");
    // Players.reset();
    // this.logger.debug("5 reset");
    // this.scoreboard.away_players = this.player_manager.init_players(this.scoreboard, "away");
    this.player_manager.set_batsmen_details(this.scoreboard);
    // this.logger.debug("6 reset");
    this.player_manager.set_bowler_details(this.scoreboard);
    this.logger.debug("End sc reset");
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

  // Start constructor

  this.initialize = function() {
    this.logger = new sc.Logger('Scoreboard');

    if (!is.object(ScoreboardTemplate)) {
      throw new Error('sc.Scoreboard ScoreboardTemplate must be an object. Got ' + typeof(ScoreboardTemplate));
    }

    if (!is.object(Settings)) {
      throw new Error('sc.Scoreboard Settings must be an object');
    }

    if (!is.object(Storage)) {
      throw new Error('sc.Scoreboard Storage must be an object. Got ' + typeof(Storage));
    }

    this.logger.debug('About to call prepare_match_in_progress');
    var scoreboard_template = this.prepare_match_in_progress(ScoreboardTemplate, Settings, Storage);

    var s = jQuery.extend(true, {}, scoreboard_template);

    this.scoreboard = s.innings[0];

    this.player_manager = new sc.PlayerManager();

    // this.logger.debug("About to call Storage " + JSON.stringify(Storage));
    this.storage = new Storage();

    if (!this.scoreboard.home_players.length) {
      this.logger.debug('XXXXXXXXXXXXXXXXXX Before: ' + JSON.stringify(this.scoreboard.home_players));
      this.scoreboard.home_players = this.player_manager.init_players(this.scoreboard, "home");
      this.logger.debug('XXXXXXXXXXXXXXXXXX After: ' + JSON.stringify(this.scoreboard.home_players));
    }
    if (!this.scoreboard.away_players.length) {
      this.scoreboard.away_players = this.player_manager.init_players(this.scoreboard, "away");
    }

    this.next_innings = s.innings[1];
    this.logger.debug("Scoreboard start left_bat " + JSON.stringify(this.scoreboard.left_bat));
    this.logger.debug("scoreboard " + JSON.stringify(this.scoreboard));

    this.logger.debug("Settings: " + JSON.stringify(Settings));
    this.scoreboard.num_overs = Settings.settings.num_overs;
    this.logger.debug("num_overs:" + this.scoreboard.num_overs);

    this.save();
  };

  this.initialize();

  // End constructor

};
