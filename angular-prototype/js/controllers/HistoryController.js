angular.module('scorer').controller('HistoryController', ['$scope', '$stateParams', '$state', 'Scoreboard', function($scope, $stateParams, $state, Scoreboard) {

  'use strict';


  var board = Scoreboard;
  $scope.scoreboard = board.scoreboard;
  $scope.board = board;
  // $scope.board.reset();

  // alert(JSON.stringify($scope.board));

  var history = board.scoreboard.overs_history.slice();
  console.log("history: " + history);

  history.reverse();
  for (var i = 0; i < history.length; i++) {
    history[i] = jQuery.extend(true, {}, history[i]);
    history[i].balls.reverse();
  }
console.log(JSON.stringify(history));
  // $scope.overs = board.scoreboard.overs_history.reverse();
  $scope.overs = history;
  //if ($scope.overs) {
  //  alert(JSON.stringify($scope.overs));
  //}

  //$scope.bowlers = $scope.board.scoreboard.get_bowlers();
  //var bowlers_by_no = {};
  //for (var i = 0; i < $scope.bowlers.length; i++) {
  //  var b = $scope.bowlers[i];
  //  bowlers_by_no[b.bowler] = b;
  //}
  //$scope.bowlers = bowlers_by_no;

  $('#navbar').collapse('hide');
}]);
