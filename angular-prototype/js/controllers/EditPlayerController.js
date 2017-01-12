angular.module('scorer')
  .controller('EditPlayerController', ['$scope', '$stateParams', '$state', 'Players', 'team', function($scope, $stateParams, $state, Players, team) {
    'use strict';

    $scope.playerId = $stateParams.playerId;
    $scope.team = $stateParams.team;

    var players = Players.players;
    for (var i = 0; i < players.length; i++) {
      //alert(players[i].id + ' == ' + $scope.playerId);
      if (players[i].id == $scope.playerId) {
        $scope.player = players[i];
        break;
      }
    }

    $scope.toggle_bowling = function(player) {
      if (player.bowling) {
        Players.stop_bowling(player);
      } else {
        if (!Players.start_bowling(player)) {
          alert("You already have two bowlers");
          return false;
        }
      }
      return true;
    };

    $scope.accept = function() {
      //alert($scope.player.id);
      Players.save($scope.player);
      $state.go('players', {
        team: $scope.team
      });
    };

    $scope.reject = function() {
      Players.reset();
      $state.go('players', {
        team: $scope.team
      });
    };

  }]);
