angular.module("scorer").factory('Scoreboard', ['Storage', 'Settings', '$rootScope', 'Players', function(Storage, Settings, $rootScope, Players) {

  var Batsman = function() {
    this.no = 0;
    this.striker = false;
    this.runs = 0;
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
    this.game_over = false;
    this.num_overs = function() {
      // alert(Settings.settings.match_type.name);
      if (Settings.settings.match_type.id == 1) {
        return Settings.settings.num_overs;
      }
      return false;
    }();
    this.innings_no = 1;
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
    bowls: function(type, runs) {

      if (this.alert_game_over()) {
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
    },
    new_innings: function() {
      Storage.put('last_innings', this.scoreboard);
      var last_innings_runs = this.scoreboard.total;
      this.new_match();
      this.scoreboard.last_innings = last_innings_runs;
      this.scoreboard.target = last_innings_runs + 1;
      this.scoreboard.innings_no += 1;
    },
    set_batsmen_details: function() {
      // alert('x');
      var check = function(batsman, players) {
        // alert('check ' + players.length);
        for (var i = 0; i < players.length; i++) {
          // alert(i);
          // alert(batsman.no);
          // alert(batsman.no + ' == ' + players[i].batting_no);
          if (batsman.no == players[i].batting_no) {
            batsman.name = players[i].name;
            batsman.id = players[i].id;
            batsman.description = players[i].description;
            return batsman;
          }
          return false;
        }

      };

      this.left_bat = check(this.scoreboard.left_bat, this.home_players);
      // alert(JSON.stringify(this.left_bat));
      this.right_bat = check(this.scoreboard.right_bat, this.home_players);
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
