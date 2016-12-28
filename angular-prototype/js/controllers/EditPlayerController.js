angular.module('scorer')
  .controller('EditPlayerController', ['$scope', '$stateParams', '$state', 'Players', function($scope, $stateParams, $state, Players) {
    'use strict';

    //alert(JSON.stringify($stateParams));
    $scope.playerId = $stateParams.playerId;

    var players = Players.players;
    for (var i = 0; i < players.length; i++) {
      //alert(players[i].id + ' == ' + $scope.playerId);
      if (players[i].id == $scope.playerId) {
        $scope.player = players[i];
        break;
      }
    }

    $scope.accept = function() {
      //alert($scope.player.id);
      Players.save($scope.player);
      $state.go('players');
    };

    $scope.reject = function() {
      Players.reset();
      $state.go('players');
    };

  }]);
