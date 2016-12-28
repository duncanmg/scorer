angular.module('scorer')
  .controller('PlayersController', ['$scope', '$stateParams', '$state', 'Players', function($scope, $stateParams, $state, Players) {

    'use strict';

    $scope.players = Players;

    $scope.edit = function(player) {
      $state.go('edit_player', {
        playerId: player.id
      });
    };

    $('#navbar').collapse('hide');

  }]);
