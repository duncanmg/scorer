'use strict';

angular.module('scorer').controller('ScorerController', ['$scope', '$stateParams', '$state', 'Scoreboard', function($scope, $stateParams, $state, Scoreboard) {

    var board = Scoreboard;
    $scope.scoreboard = board.scoreboard;
    $scope.board = board;

    $scope.go_others = function() {
      $state.go('others');
    };

  }])
  .controller('OthersController', ['$scope', '$stateParams', '$state', 'Scoreboard', function($scope, $stateParams, $state, Scoreboard) {

    var board = Scoreboard;

    var Extra = function(type) {
      this.type = type;
      this.runs = 0;
      this.extras = 0;
      this.is_clean = function() {
        return (this.runs == 0 && this.extras == 0) ? true : false;
      };
      this.runs_up = function() {
        this.runs += 1;
      };
      this.runs_down = function() {
        if (this.runs > 0) {
          this.runs -= 1;
        }

      };
      this.extras_up = function() {
        this.extras += 1;
      };
      this.extras_down = function() {
        if (this.extras > 0) {
          this.extras -= 1;
        }
      };
      this.add = function() {
        board.add_extra(this);
      }
    };

    $scope.extras = {};

    $scope.extras.no_ball = new Extra('no_ball');
    $scope.extras.wide = new Extra('wide');
    $scope.extras.bye = new Extra('bye');
    $scope.extras.leg_bye = new Extra('leg_bye');

    $scope.run_out_striker_runs = 0;
    $scope.run_out_striker_extras = 0;
    $scope.run_out_non_striker_runs = 0;
    $scope.run_out_non_striker_extras = 0;

    $scope.accept = function() {

      var count = 0;
      var extra;
      for (var e in $scope.extras) {
        if (!$scope.extras[e].is_clean()) {
          count += 1;
          // alert(e);
          extra = $scope.extras[e];
        }
      }
      if (count > 1) {
        alert("Please enter just one type of extra.");
        return false;
      }
      if (count == 0) {
        alert("Nothing has been entered.");
        return false;
      }

      extra.add();

      $state.go('scorer');
      // alert("ok");
    };

    $scope.reject = function() {
      // alert("reject");
      $state.go('scorer');
    };


  }])
  .controller('SettingsController', ['$scope', '$stateParams', '$state', 'Scoreboard', function($scope, $stateParams, $state, Scoreboard) {

    var board = Scoreboard;

  

  }]);
// alert('Bang!');
