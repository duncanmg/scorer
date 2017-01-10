angular.module('scorer')
  .controller('PlayersController', ['$scope', '$stateParams', '$state', 'Players', function($scope, $stateParams, $state, Players) {

    'use strict';

    $scope.players = Players;
    $scope.team = $stateParams.team;
    alert("PlayersController " + JSON.stringify($stateParams));
    $scope.players.set_team($scope.team); // "home" or "away"
    $scope.players.reset();

    $scope.edit = function(player) {
      alert("editttt " + $scope.team);
      $state.go('edit_player', {
        "playerId": player.id,
        "team": $scope.team
      });
    };

    $scope.accept = function() {
      $scope.players.accept();
      $state.go('scorer');
    };

    $scope.reject = function() {
      $scope.players.reset();
      $state.go('scorer');
    };

    $('#navbar').collapse('hide');

  }]);
