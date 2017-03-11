/**
 * @class ScorerController
 * @memberOf scorer.controller
 */
angular.module('scorer').controller('ScorerController', ['$scope', '$stateParams', '$state', 'Scoreboard', function($scope, $stateParams, $state, Scoreboard) {

    'use strict';

    var board = Scoreboard;
    $scope.scoreboard = board.scoreboard;
    $scope.board = board;
    $scope.board.reset();

    $scope.go_others = function() {
      if ($scope.board.alert_no_bowler()) {
        return false;
      }
      $state.go('others');
    };

    $('#navbar').collapse('hide');
  }])
  /**
   * @class OthersController
   * @memberOf scorer.controller
   */
  .controller('OthersController', ['$scope', '$stateParams', '$state', 'Scoreboard', 'Others', function($scope, $stateParams, $state, Scoreboard, Others) {

    var board = Scoreboard;

    var others = Others;

    $scope.others = others;

    $scope.accept = function() {

      others.accept();
      $state.go('scorer');
    };

    $scope.reject = function() {
      $state.go('scorer');
    };
    $('#navbar').collapse('hide');

  }])
  /**
   * @class SettingsController
   * @memberOf scorer.controller
   */
  .controller('SettingsController', ['$scope', '$stateParams', '$state', 'Scoreboard', 'Storage', 'Settings', function($scope, $stateParams, $state, Scoreboard, Storage, Settings) {

    var settings = Settings;

    $scope.settings = settings;

    $scope.accept = function() {
      settings.accept();
      $state.go('scorer');
    };

    $scope.reject = function() {
      settings.reset();
      $state.go('scorer');
    };

    $('#navbar').collapse('hide');

  }])
  /**
   * @class NewMatchController
   * @memberOf scorer.controller
   */
  .controller('NewMatchController', ['$scope', '$stateParams', '$state', 'Scoreboard', function($scope, $stateParams, $state, Scoreboard) {
    $('#navbar').collapse('hide');
    var board = Scoreboard;
    board.new_match();
    $state.go('scorer');

  }]);
// alert('Bang!');
