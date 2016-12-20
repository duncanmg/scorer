'use strict';

angular.module('scorer').controller('ScorerController', ['$scope', '$stateParams', '$state', function($scope, $stateParams, $state) {

    var Batsman = function() {
      this.no = 0;
      this.striker = false;
      this.runs = 0;
    };

    var scoreboard = {
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
    };

    var change_ends = function(num_runs) {

      switch (num_runs) {
        case 2:
        case 4:
        case 6:
          return true;
      }

      if ($scope.scoreboard.left_bat.striker == true) {
        $scope.scoreboard.left_bat.striker = false;
        $scope.scoreboard.right_bat.striker = true;
      } else {
        $scope.scoreboard.left_bat.striker = true;
        $scope.scoreboard.right_bat.striker = false;
      }
    };

    $scope.scoreboard = scoreboard;

    $scope.bowls = function(type, runs) {

      if ($scope.scoreboard.game_over == true) {
        alert("The innings is over!");
        return false;
      }

      switch (type) {
        case 'wicket':
          wicket();
          break;
        case 'bye':
        case 'leg_bye':
          $scope.scoreboard.balls += 1;
          change_ends(1);
        case 'no_ball':
        case 'wide':
          $scope.scoreboard.extras += 1;
          $scope.scoreboard.total += 1;
          break;
        case 'ball':
          ball(runs);
          change_ends(runs);
          break;
      }

      over();

      if ($scope.scoreboard.last_innings > 0 && $scope.scoreboard.total > $scope.scoreboard.last_innings) {
        $scope.scoreboard.game_over = true;
      }

    };

    var over = function() {
      if ($scope.scoreboard.balls >= 6) {
        $scope.scoreboard.balls = 0;
        $scope.scoreboard.overs += 1;
        $scope.scoreboard.overs_and_balls = $scope.scoreboard.overs;
        change_ends();
      } else {
        $scope.scoreboard.overs_and_balls = $scope.scoreboard.overs + '.' + $scope.scoreboard.balls;
      }
    };

    var ball = function(runs) {
      $scope.scoreboard.total += runs;
      $scope.scoreboard.balls++;

      if ($scope.scoreboard.left_bat.striker) {
        $scope.scoreboard.left_bat.runs += runs;
      } else {
        $scope.scoreboard.right_bat.runs += runs;
      }
    }

    var wicket = function() {
      $scope.scoreboard.balls++;
      $scope.scoreboard.wickets += 1;
      var next_batsman_no = ($scope.scoreboard.left_bat.no > $scope.scoreboard.right_bat.no) ?
        $scope.scoreboard.left_bat.no + 1 :
        $scope.scoreboard.right_bat.no + 1;
      alert("next_batsman_no = " + next_batsman_no)
      if ($scope.scoreboard.left_bat.striker == true) {
        $scope.scoreboard.left_bat = new Batsman();
        $scope.scoreboard.left_bat.no = next_batsman_no;
        $scope.scoreboard.left_bat.striker = true;

      } else {
        $scope.scoreboard.right_bat = new Batsman();
        $scope.scoreboard.right_bat.no = next_batsman_no;
        $scope.scoreboard.right_bat.striker = true;
      }
      if ($scope.scoreboard.wickets >= 10) {
        $scope.scoreboard.game_over = true;
      }
    };

    $scope.go_others = function() {
      // alert('AAAAAA');
      $state.go('others');
      // alert('Gone');
    };

  }])
  .controller('OthersController', ['$scope', '$stateParams', function($scope, $stateParams) {
    // alert('qqqq');
    $scope.no_ball_extras = 1;
    $scope.no_ball_runs = 0;
    $scope.wide_extras=1;
    $scope.wide_extras=0;
    $scope.leg_bye_extras = 1;
  }]);
// alert('Bang!');
