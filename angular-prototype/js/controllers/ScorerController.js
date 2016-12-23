angular.module('scorer').controller('ScorerController', ['$scope', '$stateParams', '$state', 'Scoreboard', function($scope, $stateParams, $state, Scoreboard) {

    'use strict';

    var board = Scoreboard;
    $scope.scoreboard = board.scoreboard;
    $scope.board = board;

    $scope.go_others = function() {
      $state.go('others');
    };

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
      others.reject();
      $state.go('scorer');
    };


  }])
  .controller('SettingsController', ['$scope', '$stateParams', '$state', 'Scoreboard', 'Storage', function($scope, $stateParams, $state, Scoreboard, Storage) {

    var board = Scoreboard;

    var settings = Storage.get('settings');

    if (!settings) {
      settings = {
        match_type: {
          id: 1,
          name: 'Limited Overs'
        },
        match_types: [{
          id: 1,
          name: 'Limited Overs'
        }, {
          id: 2,
          name: 'Timed'
        }, {
          id: 3,
          name: 'Pairs'
        }],
        num_overs: 40,
        num_innings: 1,
        home_team: {
          id: 1,
          name: 'England'
        },
        away_team: {
          id: 2,
          name: 'Australia'
        },
        team_batting_first: {
          id: 1,
          name: 'England'
        }
      };
    }

    $scope.settings = settings;

    $scope.accept = function() {
      Storage.put('settings', $scope.settings);
      $state.go('scorer');
    };

    $scope.reject = function() {
      $state.go('scorer');
    };

    $('#navbar').collapse('hide');

  }]);
// alert('Bang!');
