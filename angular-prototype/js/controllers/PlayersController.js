angular.module('scorer').controller('PlayersController', ['$scope', '$stateParams', '$state', function($scope, $stateParams, $state) {

  'use strict';

  var players = [{
    id: 1,
    name: 'Alastair Cook'
  }, {
    id: 2,
    name: 'Haseeb Hameed'
  }, {
    id: 3,
    name: 'Keaton Jennings'
  }, {
    id: 4,
    name: 'Joe Root'
  }, {
    id: 5,
    name: 'Jonny Bairstow'
  }, {
    id: 6,
    name: 'Ben Stokes'
  }, {
    id: 7,
    name: 'Ben Duckett'
  }, {
    id: 8,
    name: 'Moeen Ali'
  }, {
    id: 9,
    name: 'Chris Woakes'
  }, {
    id: 10,
    name: 'Chris Broad'
  }, {
    id: 11,
    name: 'Jimmy Anderson'
  }];

  $scope.up = function(player) {
    for (var i = players.length - 1; i >= 0; i--) {
      if (players[i].id == player.id) {
        if (i > 0) {
          var tmp = players[i];
          players[i] = players[i - 1];
          players[i - 1] = tmp;
          break;
        }
      }
    }
  };

  $scope.down = function(player) {
    for (var i = 0; i < players.length; i++) {
      if (players[i].id == player.id) {
        if (i < players.length - 1) {
          var tmp = players[i];
          players[i] = players[i + 1];
          players[i + 1] = tmp;
          break;
        }
      }
    }
  };

  $scope.edit = function(player) {

  };

  $scope.players = players;
  //alert(JSON.stringify($scope.players));

  $('#navbar').collapse('hide');

}]);
