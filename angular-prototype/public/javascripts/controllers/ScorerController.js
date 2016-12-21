'use strict';

angular.module('scorer').controller('ScorerController', ['$scope', '$stateParams', '$state', 'Scoreboard', function($scope, $stateParams, $state, Scoreboard) {

    var board = Scoreboard;
    $scope.scoreboard = board.scoreboard;
    $scope.board = board;
    
    $scope.go_others = function() {
      $state.go('others');
    };

  }])
  .controller('OthersController', ['$scope', '$stateParams', '$state', function($scope, $stateParams, $state) {
    // alert('qqqq');
    $scope.no_ball_extras = 1;
    $scope.no_ball_runs = 0;
    $scope.wide_extras = 1;
    $scope.wide_extras = 0;
    $scope.leg_bye_extras = 1;

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

    $scope.accept = function() {
      alert("ok");
    };

    $scope.reject = function() {
      // alert("reject");
      $state.go('scorer');
    };


  }]);
// alert('Bang!');
