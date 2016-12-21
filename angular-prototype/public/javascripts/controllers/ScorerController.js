'use strict';

angular.module('scorer').controller('ScorerController', ['$scope', '$stateParams', '$state', 'Scoreboard', function($scope, $stateParams, $state, Scoreboard) {

    var board = Scoreboard;
    $scope.scoreboard = board.scoreboard;
    $scope.board = board;

    $scope.go_others = function() {
      $state.go('others');
    };

  }])
  .controller('OthersController', ['$scope', '$stateParams', '$state', 'Scoreboard', function($scope, $stateParams, $state, Scoreboard) {

    var board = Scoreboard;

    $scope.no_ball_extras = 0;
    $scope.no_ball_runs = 0;
    $scope.wide_extras = 0;
    $scope.wide_extras = 0;
    $scope.leg_bye_extras = 0;
    $scope.bye_extras = 0;
    $scope.run_out_striker_runs = 0;
    $scope.run_out_striker_extras = 0;
    $scope.run_out_non_striker_runs = 0;
    $scope.run_out_non_striker_extras = 0;

    $scope.no_ball_extras_up = function() {
      $scope.no_ball_extras += 1;
    };
    $scope.no_ball_extras_down = function() {
      if ($scope.no_ball_extras) {
        $scope.no_ball_extras -= 1;
      }
    };

    $scope.no_ball_runs_up = function() {
      $scope.no_ball_runs += 1;
    };
    $scope.no_ball_runs_down = function() {
      if ($scope.no_ball_runs > 0) {
        $scope.no_ball_runs -= 1;
      }
    };

    $scope.wide_extras_up = function() {
      $scope.wide_extras += 1;
    };

    $scope.wide_extras_down = function() {
      if ($scope.wide_extras) {
        $scope.wide_extras -= 1;
      }
    };

    $scope.leg_bye_extras_up = function() {
      $scope.leg_bye_extras += 1;
    };

    $scope.leg_bye_extras_down = function() {
      if ($scope.leg_bye_extras) {
        $scope.leg_bye_extras -= 1;
      }
    };

    $scope.bye_extras_up = function() {
      $scope.bye_extras += 1;
    };

    $scope.bye_extras_down = function() {
      if ($scope.bye_extras) {
        $scope.bye_extras -= 1;
      }
    };

    $scope.accept = function() {

      var count = 0;
      if ($scope.no_ball_extras > 0 || $scope.no_ball_runs > 0) {
        count += 1;
      }
      if ($scope.wide_extras > 0) {
        count += 1;
      }
      if ($scope.leg_bye_extras > 0) {
        count += 1;
      }
      if ($scope.bye_extras > 0) {
        count += 1;
      }
      if (count > 1) {
        alert("Please enter just one type of extra.");
        return false;
      }
      if (count == 0) {
        alert("Nothing has been entered.");
        return false;
      }

      board.add_extra_no_balls($scope.no_ball_extras, $scope.no_ball_runs);
      board.add_extra_wides($scope.wide_extras);
      board.add_extra_leg_byes($scope.leg_bye_extras);
      board.add_extra_byes($scope.bye_extras);

      $state.go('scorer');
      // alert("ok");
    };

    $scope.reject = function() {
      // alert("reject");
      $state.go('scorer');
    };


  }]);
// alert('Bang!');
