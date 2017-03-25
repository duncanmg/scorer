/**
 * @class TeamData
 * @memberOf scorer.factory
 * @description Create a TeamData object containing 11 players.
 */
angular.module("scorer").factory('TeamData', [ function() {

  'use strict';

  var setup = function(label) {
    var players=[];
    for(var i=1;i<=11;i++){
      players.push({ 'id':i, 'name': label+' '+i, 'batting_no':i });
    }

    return players;
  };

  return function(label) {
    this.players=setup(label);
  }

}]);
