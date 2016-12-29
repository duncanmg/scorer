angular.module('scorer').controller('ScorerController', ['$scope', '$stateParams', '$state', 'Scoreboard', function($scope, $stateParams, $state, Scoreboard) {

    'use strict';

    var board = Scoreboard;
    $scope.scoreboard = board.scoreboard;
    $scope.board = board;

    $scope.go_others = function() {
      $state.go('others');
    };
    $('#navbar').collapse('hide');
  }])
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

  }]);
// alert('Bang!');
