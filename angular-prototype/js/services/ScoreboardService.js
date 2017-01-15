/**
 * @name Scoreboard
 * @class
 */
angular.module("scorer").factory('Scoreboard', ['Storage', 'Settings', '$rootScope', 'Players', function(Storage, Settings, $rootScope, Players) {

  /** @class Batsman */
  var Batsman = function() {
    this.no = 0;
    this.striker = false;
    this.runs = 0;
    this.bowler = false;
    this.bowling = false;
  };

  /** @constructor Over */
  var Over = function(over_no, bowler_no) {
    this.over_no = over_no;
    this.bowler_no = bowler_no;
    this.balls = [];
    this.add_ball = function(striker, runs, extras, wkt, valid) {
      this.balls.push({
        'striker': striker,
        'runs': runs,
        'extras': extras,
        'wkt': wkt,
        'valid': valid
      });
      if (valid) {
        this.valid_balls += 1;
      }
      this.total_balls += 1;
    };
    this.valid_balls = 0;
    this.total_balls = 0;
  };

  var initial_scoreboard = Storage.get_scoreboard();

  /** @constructor blank_scoreboard */
  var blank_scoreboard = function() {
    this.overs_history = {
      overs: [],
      add_over: function(over_no, bowler_no) {
        this.overs.push(new Over(over_no, bowler_no));
      },
      add_ball: function(striker, runs, extras, wkt, valid) {
        if (!this.overs.length) {
          alert("Please add an over.");
        }
        var over = this.overs[this.overs.length - 1];
        if (over.valid_balls >= 6) {
          alert("The over has finished.");
        }
        this.overs[this.overs.length - 1].add_ball(striker, runs, extras, wkt, valid);
      },
      /** @method
       *  @name is_ready */
      is_ready: function() {
        if (!this.overs.length) {
          return false;
        }
        if (this.overs[this.overs.length - 1].valid_balls >= 6) {
          return false;
        }
        return true;
      },
      /** @function */
      clear: function() {
        this.overs = [];
      }
    };
    this.total = 0;
    this.wickets = 0;
    this.extras = 0;
    this.last_innings = 0;
    this.target = 0;
    this.overs = 0;
    this.balls = 0;
    this.overs_and_balls = 0;
    /** @function */
    this.left_bat = {
      no: 1,
      striker: true,
      runs: 0
    };
    /** @function */
    this.right_bat = {
      no: 2,
      striker: false,
      runs: 0
    };
    this.bowler = {};
    this.game_over = false;
    /** @function */
    this.num_overs = function() {
      // alert(Settings.settings.match_type.name);
      if (Settings.settings.match_type.id == 1) {
        return Settings.settings.num_overs;
      }
      return false;
    }();
    this.innings_no = 1;
    this.batting_team = Settings.settings.team_batting_first.home_away;
  };

  if (!initial_scoreboard) {
    initial_scoreboard = new blank_scoreboard();
  }

  /** @constructor */
  var Scoreboard = {

    scoreboard: initial_scoreboard,

    /** @function */
    change_ends: function(num_runs) {

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
    },
    /** @function */
    change_bowlers: function() {
      var tmp = this.scoreboard.bowler;
      this.scoreboard.bowler = this.scoreboard.next_bowler;
      this.scoreboard.next_bowler = tmp;
    },
    /** @function */
    alert_game_over: function() {
      if (this.scoreboard.game_over === true) {
        alert("The game is over!");
        return true;
      }
      return this.alert_innings_over();
    },
    /** @function */
    alert_innings_over: function() {
      if (this.scoreboard.game_over === false && this.scoreboard.innings_over === true) {
        alert("The innings is over!");
        this.new_innings();
        return true;
      }
      return false;
    },
    /** @function */
    alert_no_bowler: function() {
      if (!this.scoreboard.bowler.name) {
        alert("Please select a bowler.");
        return true;
      }
      return false;
    },
    /** @function */
    bowls: function(type, runs) {

      if (this.alert_game_over()) {
        return false;
      }

      if (this.alert_no_bowler()) {
        return false;
      }

      switch (type) {
        case 'wicket':
          this.wicket();
          break;
        case 'bye':
        case 'leg_bye':
          this.scoreboard.balls += 1;
          this.scoreboard.overs_history.add_ball(this.scoreboard.left_bat.striker ? this.scoreboard.left_bat.no : this.scoreboard.right_bat.no, 0, 1, false, true);
          this.change_ends(1);
          this.scoreboard.extras += 1;
          this.scoreboard.total += 1;
          break;
        case 'no_ball':
        case 'wide':
          this.scoreboard.extras += 1;
          this.scoreboard.total += 1;
          this.scoreboard.overs_history.add_ball(this.scoreboard.left_bat.striker ? this.scoreboard.left_bat.no : this.scoreboard.right_bat.no, 0, 1, false, false);
          break;
        case 'ball':
          this.ball(runs);
          this.change_ends(runs);
          break;
      }

      this.over();

      this.set_game_over();

      this.save();
    },
    /** @function */
    set_game_over: function() {
      this.set_innings_over();
      if (this.scoreboard.last_innings > 0 && this.scoreboard.total > this.scoreboard.last_innings) {
        this.scoreboard.game_over = true;
      }
      if (this.scoreboard.innings_over && this.scoreboard.innings_no > 1) {
        this.scoreboard.game_over = true;
      }
    },
    /** @function */
    set_innings_over: function() {
      if (this.scoreboard.wickets >= 10) {
        this.scoreboard.innings_over = true;
      }
      //alert(this.scoreboard.num_overs + ' : ' + this.scoreboard.overs);
      if (this.scoreboard.num_overs && this.scoreboard.overs >= this.scoreboard.num_overs) {
        //alert(1);
        this.scoreboard.innings_over = true;
      }

      return this.scoreboard.innings_over;
    },
    /** @function */
    over: function() {
      if (this.scoreboard.balls >= 6) {
        this.scoreboard.balls = 0;
        this.scoreboard.overs += 1;
        this.scoreboard.overs_and_balls = this.scoreboard.overs;
        this.change_ends();
        this.change_bowlers();
        this.scoreboard.overs_history.add_over();
      } else {
        this.scoreboard.overs_and_balls = this.scoreboard.overs + '.' + this.scoreboard.balls;
      }
    },
    /** @function */
    add_runs_to_striker: function(runs) {
      if (this.scoreboard.left_bat.striker) {
        this.scoreboard.left_bat.runs += runs;
      } else {
        this.scoreboard.right_bat.runs += runs;
      }
    },
    /** @function */
    ball: function(runs) {

      this.scoreboard.total += runs;
      this.scoreboard.balls++;

      this.add_runs_to_striker(runs);

      this.scoreboard.overs_history.add_ball(this.scoreboard.left_bat.striker ? this.scoreboard.left_bat.no : this.scoreboard.right_bat.no, runs, 0, false, true);
      // console.log(JSON.stringify(this.scoreboard.overs_history));
    },
    /** @function */
    wicket: function() {
      this.scoreboard.balls++;
      this.scoreboard.wickets += 1;

      if (this.set_game_over()) {
        return true;
      }
      this.scoreboard.overs_history.add_ball(this.scoreboard.left_bat.striker ? this.scoreboard.left_bat.no : this.scoreboard.right_bat.no, 0, 0, true, true);
      var next_batsman_no = (this.scoreboard.left_bat.no > this.scoreboard.right_bat.no) ?
        this.scoreboard.left_bat.no + 1 :
        this.scoreboard.right_bat.no + 1;

      if (this.scoreboard.left_bat.striker === true) {
        this.scoreboard.left_bat = new Batsman();
        this.scoreboard.left_bat.no = next_batsman_no;
        this.scoreboard.left_bat.striker = true;

      } else {
        this.scoreboard.right_bat = new Batsman();
        this.scoreboard.right_bat.no = next_batsman_no;
        this.scoreboard.right_bat.striker = true;
      }
      this.set_batsmen_details();
      this.save();
    },
    /** @function */
    add_extra: function(extra) {
      if (this.alert_game_over()) {
        return false;
      }
      this.add_extras[extra.type](this, extra);
      this.set_game_over();
      this.save();
    },
    /** @function */
    add_extras: {
      no_ball: function(obj, extra) {
        obj.scoreboard.total += (extra.runs + extra.extras);
        obj.add_runs_to_striker(extra.runs);
        obj.change_ends(extra.runs + extra.extras - 1);
        obj.scoreboard.overs_history.add_ball(obj.scoreboard.left_bat.striker ?
          obj.scoreboard.left_bat.no : obj.scoreboard.right_bat.no, 0, extra.extras, false, false);
      },
      wide: function(obj, extra) {
        obj.scoreboard.total += extra.extras;
        obj.scoreboard.overs_history.add_ball(obj.scoreboard.left_bat.striker ?
          obj.scoreboard.left_bat.no : obj.scoreboard.right_bat.no, 0, extra.extras, false, false);
        if (extra.extras > 1) {
          obj.change_ends(extra.extras - 1);
        }
      },
      leg_bye: function(obj, extra) {
        obj.scoreboard.balls++;
        obj.scoreboard.total += extra.extras;
        obj.scoreboard.overs_history.add_ball(obj.scoreboard.left_bat.striker ?
          obj.scoreboard.left_bat.no : obj.scoreboard.right_bat.no, 0, extra.extras, false, true);
        obj.change_ends(extra.extras);
        obj.over();
      },
      bye: function(obj, extra) {
        obj.scoreboard.balls++;
        obj.scoreboard.total += extra.extras;
        obj.scoreboard.overs_history.add_ball(obj.scoreboard.left_bat.striker ?
          obj.scoreboard.left_bat.no : obj.scoreboard.right_bat.no, 0, extra.extras, false, true);
        obj.change_ends(extra.extras);
        obj.over();
      }
    },
    /** @function */
    save: function() {
      Storage.put_scoreboard(this.scoreboard);
    },
    /** @function */
    new_match: function() {
      this.scoreboard = new blank_scoreboard();
      Storage.put_scoreboard(this.scoreboard);
      this.set_batsmen_details();
      Players.clear_bowlers('home');
      Players.clear_bowlers('away');
    },
    /** @function */
    new_innings: function() {
      Storage.put('last_innings', this.scoreboard);
      var last_innings_runs = this.scoreboard.total;
      this.new_match();
      this.scoreboard.last_innings = last_innings_runs;
      this.scoreboard.target = last_innings_runs + 1;
      this.scoreboard.innings_no += 1;
      this.scoreboard.batting_team = this.scoreboard.batting_team == "home" ? "away" : "home";
      this.set_batsmen_details();
    },
    /** @function */
    set_batting_team: function(batting_team) {
      if (batting_team != this.scoreboard.batting_team) {
        this.scoreboard.batting_team = batting_team;
        this.set_batsmen_details();
        //alert("About to set_bowler_details");
        this.set_bowler_details();
        //alert("Done");
      }
    },
    /** @function */
    set_batsmen_details: function() {

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

      // alert(this.scoreboard.batting_team);
      var players = this.scoreboard.batting_team == "home" ? this.home_players : this.away_players;

      this.left_bat = check(this.scoreboard.left_bat, players);
      this.right_bat = check(this.scoreboard.right_bat, players);
      // alert(JSON.stringify(this.scoreboard.right_bat));

    },
    // ***********************************************************************
    /** @function */
    set_bowler_details: function() {

      var get_bowlers = function(players) {
        var bowling = [];
        for (var i = 0; i < players.length; i++) {
          if (players[i].bowling) {
            bowling.push(players[i]);
          }
        }
        return bowling;
      };
      /** @function */
      var is_bowling = function(bowlers, bowler) {
        for (var i = 0; i < bowlers.length; i++) {
          if (bowlers[i].id == bowler.id) {
            return bowlers[i];
          }
        }
        return false;
      };
      /** @function */
      var set_bowler = function(bowlers, bowler) {

        if (!bowlers.length) {
          return {};
        }

        if (!bowler.id) {
          return bowlers.shift();
        } else if (!is_bowling(bowlers, bowler)) {
          return {};
        } else {
          return bowlers[0].id == bowler.id ? bowlers.shift() : bowlers.pop();
        }
        return bowler;
      };

      var bowling_team = this.scoreboard.batting_team == "home" ? this.away_players : this.home_players;
      var bowlers = Players.get_bowlers();

      this.scoreboard.bowler = set_bowler(bowlers, this.scoreboard.bowler);

      this.scoreboard.next_bowler = set_bowler(bowlers, this.scoreboard.next_bowler);
    },
    // ***********************************************************************
    /** @function */
    reset: function() {
      Players.set_team('home');
      Players.reset();
      this.home_players = Players.players;

      Players.set_team('away');
      Players.reset();
      this.away_players = Players.players;

      this.set_batsmen_details();
      this.set_bowler_details();

      alert(this.scoreboard.overs_history);
      alert(this.scoreboard.overs_history.is_ready);
      if (!this.scoreboard.overs_history.is_ready()) {
        this.scoreboard.overs_history.add_over();
      }
    }

  };

  $rootScope.$on('settings_changed', function(event, args) {
    Scoreboard.scoreboard.num_overs = args.num_overs;
    // alert('Hi '+ Scoreboard.scoreboard.num_overs);
    Scoreboard.set_batting_team(args.team_batting_first.home_away);
  });

  return Scoreboard;
  /** @function */
}]).factory('Storage', function() {

  return {
    get_scoreboard: function() {
      return this.get('scoreboard');
    },
    put_scoreboard: function(scoreboard) {
      this.put('scoreboard', scoreboard);
      return true;
    },
    get: function(key) {
      var value;
      try {
        value = JSON.parse(sessionStorage[key]);
        console.log(key + " get: " + JSON.stringify(value));
        return value;
      } catch (e) {
        return false;
      }
    },
    put: function(key, value) {
      console.log("About to put " + key);
      sessionStorage[key] = JSON.stringify(value);
      console.log(key + " put " + JSON.stringify(value));
      return true;
    }
  };

});
