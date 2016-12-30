angular.module('scorer')
  .controller('PlayersController', ['$scope', '$stateParams', '$state', 'Players', function($scope, $stateParams, $state, Players) {

    'use strict';

    $scope.players = Players;
    // alert(JSON.stringify($stateParams));
    $scope.players.set_team($stateParams.team); // "home" or "away"
    $scope.players.reset();

    $scope.edit = function(player) {
      $state.go('edit_player', {
        playerId: player.id
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
