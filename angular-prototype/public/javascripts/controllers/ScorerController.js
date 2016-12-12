'use strict';

angular.module('scorer', []).controller('ScorerController', function($scope) {
  var batsman = {
    no: 0,
    striker: false,
    runs: 0
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
    }
  };

  var change_ends = function() {
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

    if (type == "wicket") {
      $scope.scoreboard.wickets += 1;
      var next_batsman_no = ($scope.scoreboard.left_bat.no > $scope.scoreboard.right_bat.no) ?
        $scope.scoreboard.left_bat.no + 1 :
        $scope.scoreboard.right_bat.no + 1;

      if ($scope.scoreboard.left_bat.striker == true) {
        $scope.scoreboard.left_bat = batsman;
        $scope.scoreboard.left_bat.no = next_batsman_no;
        $scope.scoreboard.left_bat.striker = true;

      } else {
        $scope.scoreboard.right_bat = batsman;
        $scope.scoreboard.right_bat.no = next_batsman_no;
        $scope.scoreboard.right_bat.striker = true;
      }
    }

    $scope.scoreboard.total += runs;
    $scope.scoreboard.balls++;

    if ($scope.scoreboard.left_bat.striker) {
      $scope.scoreboard.left_bat.runs += runs;
    } else {
      $scope.scoreboard.right_bat.runs += runs;
    }

    if ($scope.scoreboard.balls >= 6) {
      $scope.scoreboard.balls = 0;
      $scope.scoreboard.overs += 1;
      $scope.scoreboard.overs_and_balls = $scope.scoreboard.overs;
      change_ends();
    } else {
      $scope.scoreboard.overs_and_balls = $scope.scoreboard.overs + '.' + $scope.scoreboard.balls;
    }

    switch (runs) {
      case 1:
        change_ends();
        break;
      case 3:
        change_ends();
        break;
      case 5:
        change_ends();
        break;
    }

  };

});
// alert('Bang!');
