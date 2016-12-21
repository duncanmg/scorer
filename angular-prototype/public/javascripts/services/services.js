'use strict';

angular.module("scorer").factory('Scoreboard', function() {

  var Batsman = function() {
    this.no = 0;
    this.striker = false;
    this.runs = 0;
  };

  var Scoreboard = {

    scoreboard: {
      total: 259,
      wickets: 5,
      extras: 3,
      last_innings: 302,
      overs: 35,
      balls: 0,
      overs_and_balls: 35,
      left_bat: {
        no: 3,
        striker: false,
        runs: 53
      },
      right_bat: {
        no: 7,
        striker: true,
        runs: 20
      },
      game_over: false,
      extras: 0
    },

    change_ends: function(num_runs) {

      switch (num_runs) {
        case 2:
        case 4:
        case 6:
          return true;
      }

      if (this.scoreboard.left_bat.striker == true) {
        this.scoreboard.left_bat.striker = false;
        this.scoreboard.right_bat.striker = true;
      } else {
        this.scoreboard.left_bat.striker = true;
        this.scoreboard.right_bat.striker = false;
      }
    },

    bowls: function(type, runs) {

      if (this.scoreboard.game_over == true) {
        alert("The innings is over!");
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

      if (this.scoreboard.last_innings > 0 && this.scoreboard.total > this.scoreboard.last_innings) {
        this.scoreboard.game_over = true;
      }

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

    ball: function(runs) {

      this.scoreboard.total += runs;
      this.scoreboard.balls++;

      if (this.scoreboard.left_bat.striker) {
        this.scoreboard.left_bat.runs += runs;
      } else {
        this.scoreboard.right_bat.runs += runs;
      }
    },

    wicket: function() {
      this.scoreboard.balls++;
      this.scoreboard.wickets += 1;

      if (this.scoreboard.wickets >= 10) {
        this.scoreboard.game_over = true;
        return true;
      }

      var next_batsman_no = (this.scoreboard.left_bat.no > this.scoreboard.right_bat.no) ?
        this.scoreboard.left_bat.no + 1 :
        this.scoreboard.right_bat.no + 1;

      if (this.scoreboard.left_bat.striker == true) {
        this.scoreboard.left_bat = new Batsman();
        this.scoreboard.left_bat.no = next_batsman_no;
        this.scoreboard.left_bat.striker = true;

      } else {
        this.scoreboard.right_bat = new Batsman();
        this.scoreboard.right_bat.no = next_batsman_no;
        this.scoreboard.right_bat.striker = true;
      }

    }

  };
  return Scoreboard;

});
