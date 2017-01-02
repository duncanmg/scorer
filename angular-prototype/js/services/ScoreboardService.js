angular.module("scorer").factory('Scoreboard', ['Storage', 'Settings', '$rootScope', 'Players', function(Storage, Settings, $rootScope, Players) {

  var Batsman = function() {
    this.no = 0;
    this.striker = false;
    this.runs = 0;
    this.bowler = false;
    this.bowling = false;
  };

  var initial_scoreboard = Storage.get_scoreboard();
  var blank_scoreboard = function() {
    this.total = 0;
    this.wickets = 0;
    this.extras = 0;
    this.last_innings = 0;
    this.target = 0;
    this.overs = 0;
    this.balls = 0;
    this.overs_and_balls = 0;
    this.left_bat = {
      no: 1,
      striker: true,
      runs: 0
    };
    this.right_bat = {
      no: 2,
      striker: false,
      runs: 0
    };
    this.bowler = {};
    this.game_over = false;
    this.num_overs = function() {
      // alert(Settings.settings.match_type.name);
      if (Settings.settings.match_type.id == 1) {
        return Settings.settings.num_overs;
      }
      return false;
    }();
    this.innings_no = 1;
    this.batting_team = "home";
  };

  if (!initial_scoreboard) {
    initial_scoreboard = new blank_scoreboard();
  }

  var Scoreboard = {

    scoreboard: initial_scoreboard,

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
    change_bowlers: function() {
      var tmp = this.scoreboard.bowler;
      this.scoreboard.bowler = this.scoreboard.next_bowler;
      this.scoreboard.next_bowler = tmp;
    },
    alert_game_over: function() {
      if (this.scoreboard.game_over === true) {
        alert("The game is over!");
        return true;
      }
      return this.alert_innings_over();
    },
    alert_innings_over: function() {
      if (this.scoreboard.game_over === false && this.scoreboard.innings_over === true) {
        alert("The innings is over!");
        this.new_innings();
        return true;
      }
      return false;
    },
    alert_no_bowler: function() {
      if (!this.scoreboard.bowler.name) {
        alert("Please select a bowler.");
        return true;
      }
      return false;
    },
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
          this.change_ends(1);
          this.scoreboard.extras += 1;
          this.scoreboard.total += 1;
          break;
        case 'no_ball':
        case 'wide':
          this.scoreboard.extras += 1;
          this.scoreboard.total += 1;
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
    set_game_over: function() {
      this.set_innings_over();
      if (this.scoreboard.last_innings > 0 && this.scoreboard.total > this.scoreboard.last_innings) {
        this.scoreboard.game_over = true;
      }
      if (this.scoreboard.innings_over && this.scoreboard.innings_no > 1) {
        this.scoreboard.game_over = true;
      }
    },
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
    over: function() {
      if (this.scoreboard.balls >= 6) {
        this.scoreboard.balls = 0;
        this.scoreboard.overs += 1;
        this.scoreboard.overs_and_balls = this.scoreboard.overs;
        this.change_ends();
        this.change_bowlers();
      } else {
        this.scoreboard.overs_and_balls = this.scoreboard.overs + '.' + this.scoreboard.balls;
      }
    },

    add_runs_to_striker: function(runs) {
      if (this.scoreboard.left_bat.striker) {
        this.scoreboard.left_bat.runs += runs;
      } else {
        this.scoreboard.right_bat.runs += runs;
      }
    },

    ball: function(runs) {

      this.scoreboard.total += runs;
      this.scoreboard.balls++;

      this.add_runs_to_striker(runs);

    },

    wicket: function() {
      this.scoreboard.balls++;
      this.scoreboard.wickets += 1;

      if (this.set_game_over()) {
        return true;
      }

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

    add_extra: function(extra) {
      if (this.alert_game_over()) {
        return false;
      }
      this.add_extras[extra.type](this, extra);
      this.set_game_over();
      this.save();
    },

    add_extras: {
      no_ball: function(obj, extra) {
        obj.scoreboard.total += (extra.runs + extra.extras);
        obj.add_runs_to_striker(extra.runs);
        obj.change_ends(extra.runs + extra.extras - 1);
      },
      wide: function(obj, extra) {
        obj.scoreboard.total += extra.extras;
        if (extra.extras > 1) {
          obj.change_ends(extra.extras - 1);
        }
      },
      leg_bye: function(obj, extra) {
        obj.scoreboard.balls++;
        obj.scoreboard.total += extra.extras;
        obj.change_ends(extra.extras);
        obj.over();
      },
      bye: function(obj, extra) {
        obj.scoreboard.balls++;
        obj.scoreboard.total += extra.extras;
        obj.change_ends(extra.extras);
        obj.over();
      }
    },
    save: function() {
      Storage.put_scoreboard(this.scoreboard);
    },
    new_match: function() {
      this.scoreboard = new blank_scoreboard();
      Storage.put_scoreboard(this.scoreboard);
      this.set_batsmen_details();
    },
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

      var is_bowling = function(bowlers, bowler) {
        for (var i = 0; i < bowlers.length; i++) {
          if (bowlers[i].id == bowler.id) {
            return bowlers[i];
          }
        }
        return false;
      };

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
      var bowlers = get_bowlers(bowling_team);

      this.scoreboard.bowler = set_bowler(bowlers, this.scoreboard.bowler);

      this.scoreboard.next_bowler = set_bowler(bowlers, this.scoreboard.next_bowler);
    }

  };

  $rootScope.$on('settings_changed', function(event, args) {
    Scoreboard.scoreboard.num_overs = args.num_overs;
    // alert('Hi '+ Scoreboard.scoreboard.num_overs);
  });

  $rootScope.$on('players_changed', function(event, args) {
    Scoreboard.home_players = args.home_players;
    Scoreboard.away_players = args.away_players;
    Scoreboard.set_batsmen_details();
    Scoreboard.set_bowler_details();
  });

  Players.broadcast_players();
  // alert(JSON.stringify(Players));

  return Scoreboard;

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
        return value;
      } catch (e) {
        return false;
      }
    },
    put: function(key, value) {
      sessionStorage[key] = JSON.stringify(value);
      return true;
    }
  };

});
