angular.module('scorer').controller('HistoryController', ['$scope', '$stateParams', '$state', 'Scoreboard', function($scope, $stateParams, $state, Scoreboard) {

  'use strict';

  var parse_history = function(history) {
    var h = history.slice();
    //console.log("h=" + JSON.stringify(h));
    h.reverse();
    //console.log("h reversed=" + JSON.stringify(h));
    for (var i = 0; i < h.length; i++) {
      h[i] = jQuery.extend(true, {}, h[i]);
      h[i].balls.reverse();
    }
    return h;
  }

  var board = Scoreboard;
  $scope.scoreboard = board.scoreboard;
  $scope.board = board;

  var history = parse_history(board.scoreboard.overs_history);
  var last_history = parse_history(board.scoreboard.last_overs_history);

  $scope.overs = history;
  $scope.last_overs = last_history;

  $('#navbar').collapse('hide');
}]);
