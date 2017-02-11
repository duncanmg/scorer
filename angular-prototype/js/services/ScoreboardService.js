/**
 * @name Scoreboard
 * @class
 */
angular.module("scorer").factory('Scoreboard', ['Storage', 'Settings', '$rootScope', 'Players', 'Over', 'Batsman', 'Ball', 'ScoreboardTemplate',
  function(Storage, Settings, $rootScope, Players, Over, Batsman, Ball, ScoreboardTemplate) {

    var initial_scoreboard = Storage.get_scoreboard();

    if (!initial_scoreboard) {
      initial_scoreboard = new ScoreboardTemplate(Settings);
    }

    /** @constructor */
    var Scoreboard = {

      scoreboard: initial_scoreboard,

      /** @function change_ends
       * @memberOf Scoreboard
       */
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
      /**
       *  @function change_bowlers
       *  @memberOf Scoreboard
       */
      change_bowlers: function() {
        var tmp = this.scoreboard.bowler;
        this.scoreboard.bowler = this.scoreboard.next_bowler;
        this.scoreboard.next_bowler = tmp;
      },
      /** @function alert_game_over
       *  @memberOf Scoreboard
       */
      alert_game_over: function() {
        if (this.scoreboard.game_over === true) {
          alert("The game is over!");
          return true;
        }
        return this.alert_innings_over();
      },
      /** @function alert_innings_over
       *  @memberOf Scoreboard
       */
      alert_innings_over: function() {
        if (this.scoreboard.game_over === false && this.scoreboard.innings_over === true) {
          alert("The innings is over!");
          this.new_innings();
          return true;
        }
        return false;
      },
      /** @function alert_no_bowler
       *  @memberOf Scoreboard
       */
      alert_no_bowler: function() {
        if (!this.scoreboard.bowler.name) {
          alert("Please select a bowler.");
          return true;
        }
        return false;
      },
      /** @function bowls
       *  @memberOf Scoreboard
       */
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
            this.add_ball(this.scoreboard.left_bat.striker ? this.scoreboard.left_bat : this.scoreboard.right_bat, 0, 1, false, true);
            this.change_ends(1);
            this.scoreboard.extras += 1;
            this.scoreboard.total += 1;
            break;
          case 'no_ball':
          case 'wide':
            this.scoreboard.extras += 1;
            this.scoreboard.total += 1;
            this.add_ball(this.scoreboard.left_bat.striker ? this.scoreboard.left_bat : this.scoreboard.right_bat, 0, 1, false, false);
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
      /** @function set_game_over
       *  @memberOf Scoreboard
       */
      set_game_over: function() {
        this.set_innings_over();
        if (this.scoreboard.last_innings > 0 && this.scoreboard.total > this.scoreboard.last_innings) {
          this.scoreboard.game_over = true;
        }
        if (this.scoreboard.innings_over && this.scoreboard.innings_no > 1) {
          this.scoreboard.game_over = true;
        }
      },
      /** @function set_innings_over
       *  @memberOf Scoreboard
       */
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
      /** @function over
       *  @memberOf Scoreboard
       */
      over: function() {
        if (this.scoreboard.balls >= 6) {
          this.scoreboard.balls = 0;
          this.scoreboard.overs += 1;
          this.scoreboard.overs_and_balls = this.scoreboard.overs;
          this.change_ends();
          this.change_bowlers();
          // alert("About to add over " + parseInt(this.scoreboard.overs + 1));
          this.add_over(parseInt(this.scoreboard.overs) + 1, this.scoreboard.bowler);
        } else {
          this.scoreboard.overs_and_balls = this.scoreboard.overs + '.' + this.scoreboard.balls;
        }
      },
      /** @function add_runs_to_striker
       *  @memberOf Scoreboard
       */
      add_runs_to_striker: function(runs) {
        if (this.scoreboard.left_bat.striker) {
          this.scoreboard.left_bat.runs += runs;
        } else {
          this.scoreboard.right_bat.runs += runs;
        }
      },
      /** @function ball
       *  @memberOf Scoreboard
       */
      ball: function(runs) {

        this.scoreboard.total += runs;
        this.scoreboard.balls++;

        this.add_runs_to_striker(runs);

        this.add_ball(this.scoreboard.left_bat.striker ? this.scoreboard.left_bat : this.scoreboard.right_bat, runs, 0, false, true);

      },
      /** @function wicket
       *  @memberOf Scoreboard
       */
      wicket: function() {
        this.scoreboard.balls++;
        this.scoreboard.wickets += 1;

        if (this.set_game_over()) {
          return true;
        }
        this.add_ball(this.scoreboard.left_bat.striker ? this.scoreboard.left_bat : this.scoreboard.right_bat, 0, 0, true, true);
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
      /** @function add_extra
       *  @memberOf Scoreboard
       */
      add_extra: function(extra) {
        if (this.alert_game_over()) {
          return false;
        }
        this.add_extras[extra.type](this, extra);
        this.set_game_over();
        this.save();
      },
      /** @function add_extras
       *  @memberOf Scoreboard
       */
      add_extras: {
        no_ball: function(obj, extra) {
          obj.scoreboard.total += (extra.runs + extra.extras);
          obj.add_runs_to_striker(extra.runs);
          obj.change_ends(extra.runs + extra.extras - 1);
          obj.add_ball(obj.scoreboard.left_bat.striker ?
            obj.scoreboard.left_bat : obj.scoreboard.right_bat, extra.runs, extra.extras, false, false);
        },
        wide: function(obj, extra) {
          obj.scoreboard.total += extra.extras;
          obj.add_ball(obj.scoreboard.left_bat.striker ?
            obj.scoreboard.left_bat : obj.scoreboard.right_bat, 0, extra.extras, false, false);
          if (extra.extras > 1) {
            obj.change_ends(extra.extras - 1);
          }
        },
        leg_bye: function(obj, extra) {
          obj.scoreboard.balls++;
          obj.scoreboard.total += extra.extras;
          obj.add_ball(obj.scoreboard.left_bat.striker ?
            obj.scoreboard.left_bat : obj.scoreboard.right_bat, 0, extra.extras, false, true);
          obj.change_ends(extra.extras);
          obj.over();
        },
        bye: function(obj, extra) {
          obj.scoreboard.balls++;
          obj.scoreboard.total += extra.extras;
          obj.add_ball(obj.scoreboard.left_bat.striker ?
            obj.scoreboard.left_bat : obj.scoreboard.right_bat, 0, extra.extras, false, true);
          obj.change_ends(extra.extras);
          obj.over();
        }
      },
      /** @function save
       *  @memberOf Scoreboard
       */
      save: function() {
        Storage.put_scoreboard(this.scoreboard);
      },
      /** @function new_match
       *  @memberOf Scoreboard
       */
      new_match: function() {
        this.scoreboard = new ScoreboardTemplate(Settings);
        Storage.put_scoreboard(this.scoreboard);
        this.set_batsmen_details();
        Players.clear_bowlers('home');
        Players.clear_bowlers('away');
      },
      /** @function new_innings
       *  @memberOf Scoreboard
       */
      new_innings: function() {
        Storage.put('last_innings', this.scoreboard);
        var last_innings_runs = this.scoreboard.total;
        var last_overs_history = this.scoreboard.overs_history;
        this.new_match();
        this.scoreboard.last_innings = last_innings_runs;
        this.scoreboard.last_overs_history = last_overs_history;
        this.scoreboard.target = last_innings_runs + 1;
        this.scoreboard.innings_no += 1;
        this.scoreboard.batting_team = this.scoreboard.batting_team == "home" ? "away" : "home";
        this.set_batsmen_details();
      },
      /** @function set_batting_team
       *  @memberOf Scoreboard
       */
      set_batting_team: function(batting_team) {
        if (batting_team != this.scoreboard.batting_team) {
          this.scoreboard.batting_team = batting_team;
          this.set_batsmen_details();
          //alert("About to set_bowler_details");
          this.set_bowler_details();
          //alert("Done");
        }
      },
      /** @function set_batsmen_details
       *  @memberOf Scoreboard
       */
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

        var players = this.scoreboard.batting_team == "home" ? this.home_players.players : this.away_players.players;
        this.left_bat = check(this.scoreboard.left_bat, players);
        this.right_bat = check(this.scoreboard.right_bat, players);
        // alert(JSON.stringify(this.scoreboard.right_bat));

      },
      // ***********************************************************************
      /** @function set_bowler_details
       * @memberOf Scoreboard
       */
      set_bowler_details: function() {

        /** @function */
        var is_bowling = function(bowlers, bowler) {
          for (var i = 0; i < bowlers.length; i++) {
            if (bowlers[i].id == bowler.id) {
              return bowlers[i];
            }
          }
          return false;
        };
        /** @function @memberOf Scoreboard*/
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
        var bowlers = bowling_team.get_bowlers();

        this.scoreboard.bowler = set_bowler(bowlers, this.scoreboard.bowler);

        //alert("next set_bowler: " + bowlers.length + " : " + JSON.stringify(this.scoreboard.next_bowler));
        this.scoreboard.next_bowler = set_bowler(bowlers, this.scoreboard.next_bowler);
      },
      // ***********************************************************************
      /** @function reset
       *  @memberOf Scoreboard
       */
      reset: function() {
        Players.set_team('home');
        Players.reset();
        this.home_players = jQuery.extend(true, {}, Players);

        Players.set_team('away');
        Players.reset();
        this.away_players = jQuery.extend(true, {}, Players);

        this.set_batsmen_details();
        this.set_bowler_details();

      },
      /** @function add_over
       *   @memberOf Scoreboard
       */
      add_over: function(over_no, bowler_obj) {
        this.scoreboard.overs_history.push(new Over(over_no, bowler_obj));
      },
      /** @function add_ball
       *   @memberOf Scoreboard
       */
      add_ball: function(striker, runs, extras, wkt, valid) {
        if (!this.scoreboard.overs_history.length) {
          this.add_over(1, this.scoreboard.bowler);
        }
        var over = this.scoreboard.overs_history[this.scoreboard.overs_history.length - 1];
        if (over.valid_balls >= 6) {
          alert("The over has finished.");
        }
        this.scoreboard.overs_history[this.scoreboard.overs_history.length - 1].balls.push(new Ball(
          striker, runs, extras, wkt, valid));
        if (valid) {
          this.scoreboard.overs_history[this.scoreboard.overs_history.length - 1].valid_balls += 1;
        }
        this.scoreboard.overs_history[this.scoreboard.overs_history.length - 1].total_balls += 1;
      },
      /** @function is_ready
       *  @memberOf Scoreboard
       */
      is_ready: function() {
        if (!this.scoreboard.overs_history.length) {
          return false;
        }
        if (this.scoreboard.overs_history[this.scoreboard.overs_history.length - 1].valid_balls >= 6) {
          return false;
        }
        return true;
      },
      /** @function clear
       *  @memberOf Scoreboard
       */
      clear: function() {
        this.scoreboard.overs_history = [];
      }
    };

    $rootScope.$on('settings_changed', function(event, args) {
      Scoreboard.scoreboard.num_overs = args.num_overs;
      // alert('Hi '+ Scoreboard.scoreboard.num_overs);
      Scoreboard.set_batting_team(args.team_batting_first.home_away);
    });

    return Scoreboard;
  }
]);
