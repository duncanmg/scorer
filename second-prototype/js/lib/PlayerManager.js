/*jslint vars:true, plusplus:true, devel:true, nomen:true, indent:4, maxerr:50*/

/**
 * @namespace sc
 * @memberOf scorer.lib
 *
 */
var sc = sc || {};

/**
 * @class PlayerManager
 * @memberOf sc
 * @constructor PlayerManager
 * @param data
 * @param {Players} Players
 *
 */

sc.PlayerManager = function() {

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

  // this.Players = Players;
  // if ( ! this.Players) {
  //   throw new Error( "sc.PlayerManager argument Players is mandatory");
  // }
  /**
   * @method change_ends
   * @memberOf sc.Scoreboard
   * @description Accept the number of times the batsmen ran and calculate whether
   * the batsmen changed ends. If they did, toggle the values of scoreboard.left_bat.striker
   * and scoreboard.right_bat.striker.
   * @param {integer} num_runs - Number of times the batsmen ran on the last ball.
   */
  this.change_ends = function(data, num_runs) {
    if (!data) {
      throw new Error("Parameter data is mandatory");
    }
    if (typeof num_runs === "undefined") {
      throw new Error("Parameter runs is mandatory");
    }

    if (num_runs % 2 === 0) {
      return true;
    }

    if (data.left_bat.striker === true) {
      data.left_bat.striker = false;
      data.right_bat.striker = true;
    } else {
      data.left_bat.striker = true;
      data.right_bat.striker = false;
    }
  };

  /**
   *  @function change_bowlers
   *  @memberOf sc.PlayerManager
   *  @param {Object} data
   *  @description Swop the objects in data.bowler and data.next_bowler.
   *  Called at the end of each over.
   *
   */
  this.change_bowlers = function(data) {
    var tmp = data.bowler;
    sc.validators.is_bowler(data.bowler);

    // If next_bowler is true, it must be a Bowler object.
    if (data.next_bowler) {
      sc.validators.is_bowler(data.next_bowler);
    }
    data.bowler = data.next_bowler;

    data.next_bowler = tmp;
    console.log("After change_bowlers: bowler " + JSON.stringify(data.bowler));
    console.log(
      "After change_bowlers: next " + JSON.stringify(data.next_bowler)
    );
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

  /** @function add_runs_to_striker
   *  @description Add the runs to the batsman's score.
   *  @memberOf sc.Scoreboard
   *  @param {objects} data - Data
   *  @param {integer} runs - Number of runs to be added.
   */
  this.add_runs_to_striker = function(data, runs) {
    if (!data) {
      throw new Error("add_runs_to_striker data is mandatory");
    }
    if (typeof runs === "undefined") {
      throw new Error("add_runs_to_striker runs is mandatory");
    }

    if (data.left_bat.striker) {
      data.left_bat.runs += runs;
    } else {
      data.right_bat.runs += runs;
    }
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
   *  @description Uses the list of players to flesh out the left_bat and
   *  right_bat_no with details such as name and description.
   *  @memberOf sc.Scoreboard
   */
  this.set_batsmen_details = function(data) {
    // console.log("set_batsmen_details " + JSON.stringify(data));

    var m = "PlayerManager set_batsmen_details. ";

    if (!data) {
      throw new Error(m + "Parameter data is mandatory");
    }
    if (!(data.batting_team != "home" || data.batting_team != "away")) {
      throw new Error(m + "data.batting_team must be home or away");
    }
    if (!data.home_players) {
      throw new Error(m + "data.home_players must be defined");
    }
    if (!data.away_players) {
      throw new Error(m + "data.away_players must be defined");
    }

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
      data.batting_team == "home" ? data.home_players : data.away_players;

    data.left_bat = check(data.left_bat, players);
    data.right_bat = check(data.right_bat, players);
    // alert(JSON.stringify(this.scoreboard.right_bat));
  };

  this.get_team_players=function(data, batting_or_bowling) {
    var team;
    this.validator('get_team_players').check_all_defined(data, [ 'batting_team', 'home_players',
    'away_players']);
      if (batting_or_bowling == 'batting') {
      team = data.batting_team == "home" ? data.home_players : data.away_players;
    }
    else if (batting_or_bowling == 'bowling') {
      team = data.batting_team == "home" ? data.away_players : data.home_players;
    }
    else {
      throw new Error("Parameter value must be 'batting' or 'bowling'");
    }
    // console.log("get_team_players returning " + JSON.stringify(team));
    return team;
  };

  // ***********************************************************************
  /** @function set_bowler_details
   * @description Manage the bowler details based on the list of players.
   * @memberOf sc.PlayerManager
   */
  this.set_bowler_details = function(data) {
    console.log("Start set_bowler_details");

    this.validator('set_bowler_details').check_all_defined(data, [ 'batting_team', 'home_players',
    'away_players']);

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
      data.batting_team == "home"
        ? data.away_players
        : data.home_players;
    // Bowlers is a sorted list of the players in the bowling list who
    // are currently bowling. Rebuilt each time, so it
    // can be modified safely. Two entries max!
    var bowlers = this.get_bowling(bowling_team);
    console.log("set_bowler_details: bowlers list:" + JSON.stringify(bowlers));
    data.bowler = set_bowler(bowlers, data.bowler);
    console.log(
      "set_bowler_details: bowler  : " + JSON.stringify(data.bowler)
    );
    data.next_bowler = set_bowler(
      bowlers,
     data.next_bowler
    );
    console.log(
      "set_bowler_details: next_bowler : " +
        JSON.stringify(data.next_bowler)
    );
    if (!data.bowler.id) {
      data.bowler = set_bowler(bowlers, data.bowler);
      console.log(
        "set_bowler_details: bowler  : " +
          JSON.stringify(data.bowler)
      );
    }
    if (!data.next_bowler.id) {
      data.next_bowler = set_bowler(
        bowlers,
        data.next_bowler
      );
      console.log(
        "set_bowler_details: next_bowler : " +
          JSON.stringify(data.next_bowler)
      );
    }
  };

  this.get_bowlers = function(players) {
    if (!players){
      throw new Error("get_bowlers requires a list of players");
    }
    var bowlers = [];
    for (var i = 0; i < players.length; i++) {
      if (players[i].bowler) {
        bowlers.push(players[i]);
      }
    }
    bowlers = bowlers.sort(this.sort_by_bowler_no);
    return bowlers;
  };

  this.get_bowling= function(players) {
    // console.log("get_bowling received " + JSON.stringify(players));
    if (!players){
      throw new Error("get_bowling requires a list of players");
    }
    var bowlers = this.get_bowlers(players);
    var bowling = [];
    for (var i = 0; i < bowlers.length; i++) {
      if (bowlers[i].bowling) {
        bowling.push(bowlers[i]);
      }
    }
    return bowling;
  };

  this.sort_by_bowler_no = function(a, b) {
    if (!a.bowler) {
      a.bowler = 0;
    }
    if (!b.bowler) {
      b.bowler = 0;
    }
    return parseInt(a.bowler) - parseInt(b.bowler);
  }

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

  this.init_players = function(data, action) {

    if (action != 'home' && action != 'away') {
      throw new Error('Parameter "action" must be "home" or "away"');
    }

var doit = function(base, output) {
  output = [];
  base.forEach(
    function(p,i) {
      // console.log('p=' + JSON.stringify(p));
      var player = new data.templates.Batsman();
      var keys = Object.keys(p);
      keys.forEach(
        function(k,i) {
          player[k] = p[k];
        }
      );
      // console.log('push: ' + JSON.stringify(player));
      output.push(player);
      // console.log('X output:' + JSON.stringify(output));
    }
  );
  // console.log('output:' + JSON.stringify(output));
  return output;
}
if(action=='home'){
  return doit(data.templates.HomePlayers, data.home_players);
}
else{
  return doit(data.templates.AwayPlayers, data.away_players);
}
};

this.lookup = function(players, player) {
  for (var i = 0; i < players.length; i++) {
    if (players[i].id == player.id) {
      return i;
    }
  }
  return -1;
};

};
