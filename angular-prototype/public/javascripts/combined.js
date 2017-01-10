
// Evaluated by gulp

angular.module("scorer", ['ui.router', 'ngResource']).config(function($stateProvider, $urlRouterProvider) {
  'use strict';
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('scorer', {
      'url': '/',
      'views': {
        'content': {
          'templateUrl': 'main.htm',
          'controller': 'ScorerController'
        }
      }
    })
    .state('others', {
      'url': '/others',
      'views': {
        'content': {
          'templateUrl': 'others.htm',
          'controller': 'OthersController'
        }
      }
    })
    .state('settings', {
      'url': '/settings',
      'views': {
        'content': {
          'templateUrl': 'settings.htm',
          'controller': 'SettingsController'
        }
      }
    });


});

angular.module('scorer').controller('ScorerController', ['$scope', '$stateParams', '$state', 'Scoreboard', function($scope, $stateParams, $state, Scoreboard) {

    'use strict';

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

'use strict';

angular.module("scorer").factory('Scoreboard', ['Storage', function(Storage) {

  var Batsman = function() {
    this.no = 0;
    this.striker = false;
    this.runs = 0;
  };

  var initial_scoreboard = Storage.get_scoreboard();

  if (!initial_scoreboard) {
    initial_scoreboard = {
      total: 259,
      wickets: 5,
      extras: 3,
      last_innings: 302,
      overs: 35,
      balls: 0,
      overs_and_balls: 35,
      left_bat: {
        no: 3,
        striker: false,
        runs: 53
      },
      right_bat: {
        no: 7,
        striker: true,
        runs: 20
      },
      game_over: false,
      extras: 0
    };
  }

  var Scoreboard = {

    scoreboard: initial_scoreboard,

    change_ends: function(num_runs) {

      if (num_runs % 2 == 0) {
        return true;
      }

      if (this.scoreboard.left_bat.striker == true) {
        this.scoreboard.left_bat.striker = false;
        this.scoreboard.right_bat.striker = true;
      } else {
        this.scoreboard.left_bat.striker = true;
        this.scoreboard.right_bat.striker = false;
      }
    },
    alert_game_over: function() {
      if (this.scoreboard.game_over == true) {
        alert("The innings is over!");
        return true;
      }
      return false;
    },
    bowls: function(type, runs) {

      if (this.alert_game_over()) {
        return false;
      }

      switch (type) {
        case 'wicket':
          this.wicket();
          break;
        case 'bye':
        case 'leg_bye':
          this.scoreboard.balls += 1;
          this.change_ends(1);
        case 'no_ball':
        case 'wide':
          this.scoreboard.extras += 1;
          this.scoreboard.total += 1;
          break;
        case 'ball':
          this.ball(runs);
          this.change_ends(runs);
          break;

      }

      this.over();

      this.set_game_over();

      this.save();
    },
    set_game_over : function() {
      if (this.scoreboard.last_innings > 0 && this.scoreboard.total > this.scoreboard.last_innings) {
        this.scoreboard.game_over = true;
      }
      if (this.scoreboard.wickets >= 10) {
        this.scoreboard.game_over = true;
      }
      return this.scoreboard.game_over;
    },
    over: function() {
      if (this.scoreboard.balls >= 6) {
        this.scoreboard.balls = 0;
        this.scoreboard.overs += 1;
        this.scoreboard.overs_and_balls = this.scoreboard.overs;
        this.change_ends();
      } else {
        this.scoreboard.overs_and_balls = this.scoreboard.overs + '.' + this.scoreboard.balls;
      }
    },

    add_runs_to_striker: function(runs) {
      if (this.scoreboard.left_bat.striker) {
        this.scoreboard.left_bat.runs += runs;
      } else {
        this.scoreboard.right_bat.runs += runs;
      }
    },

    ball: function(runs) {

      this.scoreboard.total += runs;
      this.scoreboard.balls++;

      this.add_runs_to_striker(runs);

    },

    wicket: function() {
      this.scoreboard.balls++;
      this.scoreboard.wickets += 1;

      if (this.set_game_over()) {
        return true;
      }

      var next_batsman_no = (this.scoreboard.left_bat.no > this.scoreboard.right_bat.no) ?
        this.scoreboard.left_bat.no + 1 :
        this.scoreboard.right_bat.no + 1;

      if (this.scoreboard.left_bat.striker == true) {
        this.scoreboard.left_bat = new Batsman();
        this.scoreboard.left_bat.no = next_batsman_no;
        this.scoreboard.left_bat.striker = true;

      } else {
        this.scoreboard.right_bat = new Batsman();
        this.scoreboard.right_bat.no = next_batsman_no;
        this.scoreboard.right_bat.striker = true;
      }
      this.save();
    },

    add_extra: function(extra) {
      if (this.alert_game_over()) {
        return false;
      }
      this.add_extras[extra.type](this, extra);
      this.set_game_over();
      this.save();
    },

    add_extras: {
      no_ball: function(obj, extra) {
        obj.scoreboard.total += (extra.runs + extra.extras);
        obj.add_runs_to_striker(extra.runs);
        obj.change_ends(extra.runs + extra.extras - 1);
      },
      wide: function(obj, extra) {
        obj.scoreboard.total += extra.extras;
        if (extra.extras > 1) {
          obj.change_ends(extra.extras - 1);
        }
      },
      leg_bye: function(obj, extra) {
        obj.scoreboard.balls++;
        obj.scoreboard.total += extra.extras;
        obj.change_ends(extra.extras);
        obj.over();
      },
      bye: function(obj, extra) {
        obj.scoreboard.balls++;
        obj.scoreboard.total += extra.extras;
        obj.change_ends(extra.extras);
        obj.over();
      }
    },
    save: function() {
      Storage.put_scoreboard(this.scoreboard);
    }

  };
  return Scoreboard;

}]).factory('Storage', function() {

  return {
    get_scoreboard: function() {
      return this.get('scoreboard');
    },
    put_scoreboard: function(scoreboard) {
      this.put('scoreboard', scoreboard);
      return true;
    },
    get: function(key) {
      var value;
      try {
        value = JSON.parse(sessionStorage[key]);
        return value;
      } catch (e) {
        return false;
      }
    },
    put: function(key, value) {
      sessionStorage[key] = JSON.stringify(value);
      return true;
    }
  };

});
