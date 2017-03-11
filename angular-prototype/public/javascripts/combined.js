
// Evaluated by gulp

/**
* @namespace scorer
*/

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
    }).state('players', {
      'url': '/players/:team',
      'views': {
        'content': {
          'templateUrl': 'players.htm',
          'controller': 'PlayersController'
        }
      }
    }).state('edit_player', {
      'url': '/players/edit/:team/:playerId',
      'views': {
        'content': {
          'templateUrl': 'edit_player.htm',
          'controller': 'EditPlayerController'
        }
      },
      'resolve': {
        team: ['$stateParams', function($stateParams) {
          return $stateParams.team;
        }]
      }
    }).state('new_match', {
      'url': '/new_match',
      'views': {
        'content': {
          'templateUrl': 'main.htm',
          'controller': 'NewMatchController'
        }
      }
    }).state('history', {
      'url': '/history',
      'views': {
        'content': {
          'templateUrl': 'history.htm',
          'controller': 'HistoryController'
        }
      }
    });

});

/**
 * @class EditPlayerController
 * @memberOf scorer
 */
angular.module('scorer')
  .controller('EditPlayerController', ['$scope', '$stateParams', '$state', 'Players', 'team', function($scope, $stateParams, $state, Players, team) {
    'use strict';

    $scope.playerId = $stateParams.playerId;
    $scope.team = $stateParams.team;

    var players = Players.players;
    for (var i = 0; i < players.length; i++) {
      //alert(players[i].id + ' == ' + $scope.playerId);
      if (players[i].id == $scope.playerId) {
        $scope.player = players[i];
        break;
      }
    }

    $scope.toggle_bowling = function(player) {
      if (player.bowling) {
        Players.stop_bowling(player);
      } else {
        if (!Players.start_bowling(player)) {
          alert("You already have two bowlers");
          return false;
        }
      }
      return true;
    };

    $scope.accept = function() {
      //alert($scope.player.id);
      Players.save($scope.player);
      $state.go('players', {
        team: $scope.team
      });
    };

    $scope.reject = function() {
      Players.reset();
      $state.go('players', {
        team: $scope.team
      });
    };

  }]);

/**
 * @class HistoryController
 * @memberOf scorer
 */
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
  };

  var board = Scoreboard;
  $scope.scoreboard = board.scoreboard;
  $scope.board = board;

  var history = parse_history(board.scoreboard.overs_history);
  var last_history = parse_history(board.scoreboard.last_overs_history);

  $scope.overs = history;
  $scope.last_overs = last_history;

  $('#navbar').collapse('hide');
}]);

/**
 * @class PlayersController
 * @memberOf scorer
 */
angular.module('scorer')
  .controller('PlayersController', ['$scope', '$stateParams', '$state', 'Players', function($scope, $stateParams, $state, Players) {

    'use strict';

    $scope.players = Players;
    $scope.team = $stateParams.team;
    $scope.players.set_team($scope.team); // "home" or "away"
    $scope.players.reset();

    $scope.edit = function(player) {
      $state.go('edit_player', {
        "playerId": player.id,
        "team": $scope.team
      });
    };

    $scope.accept = function() {
      $scope.players.accept();
      $state.go('scorer');
    };

    $scope.reject = function() {
      $scope.players.reset();
      $state.go('scorer');
    };

    $('#navbar').collapse('hide');

  }]);

/**
 * @class ScorerController
 * @memberOf scorer
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
   * @memberOf scorer
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
   * @memberOf scorer
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
   * @memberOf scorer
   */
  .controller('NewMatchController', ['$scope', '$stateParams', '$state', 'Scoreboard', function($scope, $stateParams, $state, Scoreboard) {
    $('#navbar').collapse('hide');
    var board = Scoreboard;
    board.new_match();
    $state.go('scorer');

  }]);
// alert('Bang!');

/**
 * @class BallFactory
 * @memberOf scorer
 */
angular.module("scorer").factory('Ball', [function() {

  /** Creates an instance of Ball
   *
   * @constructor Ball
   * @ball {Ball}
   * @param {Batsman} striker - The batsman who was on strike.
   * @param {integer} runs - The number runs scored off the bat.
   * @param {integer} extras - The number of extras.
   * @param {integer} wkt - Was a wicket taken? 1 = Yes, 0 = No
   * @param {integer} valid = Was the ball valid? 1 = Yes, 0 = No.
   * @return {Ball} The new Ball object.
   *
   * @property striker
   * @property runs
   * @property extras
   * @property wkt
   * @property valid
   */
  var Ball = function(striker, runs, extras, wkt, valid) {
    //alert('Bang '+JSON.stringify(arguments));
    if (typeof(striker) === 'undefined' || typeof(runs) === 'undefined' ||
      typeof(extras) === 'undefined' || typeof(wkt) === 'undefined' ||
      typeof(valid) === 'undefined') {
      alert("Ball requires 5 parameters");
      return false;
    }
    if (typeof(striker) != 'object') {
      alert("Striker must be a Batman object.");
      return false;
    }
    this.striker = jQuery.extend(true, {}, striker);
    this.runs = runs;
    this.extras = extras;
    this.wkt = wkt;
    this.valid = valid;
  };

  return Ball;
}]);

/**
 * @class BatsmonFactory
 * @memberOf scorer
 * @name Batsman
 * @class
 */
angular.module("scorer").factory('Batsman', [function() {

  /**
   * Creates an instance of Batsman
   *
   * @constructor Batsman
   * @this {Batsman}
   * @property {integer} no
   * @property {boolean} striker
   * @property {integer} runs
   * @property {boolean} bowler
   * @property {boolean} bowling
   *
   * @return {Batsman} The new Batsman object.
   */
  var Batsman = function() {
    this.no = 0;
    this.striker = false;
    this.runs = 0;
    this.bowler = false;
    this.bowling = false;
  };

  return Batsman;
}]);

/**
 * @class InningsFactory
 * @memberOf scorer
 * @name Innings
 * @class
 */
angular.module("scorer").factory('Innings', [
  function() {
    var Innings = function(Settings) {

      /** @constructor blank_scoreboard */
      this.overs_history = [];
      this.last_overs_history = [];
      this.total = 0;
      this.wickets = 0;
      this.extras = 0;
      this.last_innings = 0;
      this.target = 0;
      this.overs = 0;
      this.balls = 0;
      this.overs_and_balls = 0;
      /** @function */
      this.left_bat = {
        no: 1,
        striker: true,
        runs: 0
      };
      /** @function */
      this.right_bat = {
        no: 2,
        striker: false,
        runs: 0
      };
      this.bowler = {};
      this.next_bowler = {};
      this.game_over = false;
      /** @function */
      this.num_overs = function() {
        // alert(Settings.settings.match_type.name);
        if (Settings.settings.match_type.id == 1) {
          return Settings.settings.num_overs;
        }
        return false;
      }();
      this.innings_no = 1;
      this.batting_team = Settings.settings.team_batting_first.home_away;

    };

    return Innings;
  }
]);

/**
 * @class OthersFactory
 * @memberOf scorer
 */
angular.module("scorer").factory('Others', ['Scoreboard', 'Storage', function(Scoreboard, Storage) {

  var board = Scoreboard;

  var Extra = function(type) {
    this.type = type;
    this.runs = 0;
    this.extras = 0;
    this.is_clean = function() {
      return (this.runs === 0 && this.extras === 0) ? true : false;
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
    };
  };

  var others = {

    extras: {
    },
    reset:function(){
      this.extras = {
        no_ball: new Extra('no_ball'),
        wide: new Extra('wide'),
        bye: new Extra('bye'),
        leg_bye: new Extra('leg_bye')
      };
    },
    accept: function() {

      var count = 0;
      var extra;
      for (var e in this.extras) {
        if (!this.extras[e].is_clean()) {
          count += 1;
          // alert(e);
          extra = this.extras[e];
        }
      }

      if (count > 1) {
        alert("Please enter just one type of extra.");
        return false;
      }
      if (count === 0) {
        alert("Nothing has been entered.");
        return false;
      }

      extra.add();
      this.reset();
    }
  };
  others.reset();

  return others;
}]);

/**
 * @class OverFactory
 * @memberOf scorer
 */
angular.module("scorer").factory('Over', [function() {
/** Creates an instance of Over
 *
 * @constructor Over
 * @over {Over}
 * @param {integer} over_no - The over number.
 * @param {integer} bowler_no - The number of the bowler
 * @return {Over} The new Over Object.
 *
 * @property bowler_obj
 * @property over_no
 * @property balls
 * @property valid_balls - Number of valid balls bowled.
 * @property total_balls - Number of balls bowled including extras.
 * @property add_ball - Add a ball this.add_ball(striker, runs, extras, wkt, valid)
 */
var Over = function(over_no, bowler_obj) {
  /** @property over_no */
  this.over_no = over_no;
  this.bowler = jQuery.extend({}, bowler_obj); // Shallow copy / clone.
  this.balls = [];
  if (!over_no || !bowler_obj) {
    throw "Over object requires over_no and bowler_obj";
  }
  this.valid_balls = 0;
  this.total_balls = 0;
};

return Over;

}]);

/**
 * @class PlayersFactory
 * @memberOf scorer
 */
angular.module("scorer").factory('Players', ['Storage', '$rootScope', function(Storage, $rootScope) {

  'use strict';

  var home_players = [{
    id: 1,
    name: 'Home Player 1',
    batting_no: 1
  }, {
    id: 2,
    name: 'Home Player 2',
    batting_no: 2
  }, {
    id: 3,
    name: 'Home Player 3',
    batting_no: 3
  }, {
    id: 4,
    name: 'Home Player 4',
    batting_no: 4
  }, {
    id: 5,
    name: 'Home Player 5',
    batting_no: 5
  }, {
    id: 6,
    name: 'Home Player 6',
    batting_no: 6
  }, {
    id: 7,
    name: 'Home Player 7',
    batting_no: 7
  }, {
    id: 8,
    name: 'Home Player 8',
    batting_no: 8
  }, {
    id: 9,
    name: 'Home Player 9',
    batting_no: 9
  }, {
    id: 10,
    name: 'Home Player 10',
    batting_no: 10
  }, {
    id: 11,
    name: 'Home Player 11',
    batting_no: 11
  }];

  var away_players = [{
    id: 12,
    name: 'Away Player 1',
    batting_no: 1
  }, {
    id: 13,
    name: 'Away Player 2',
    batting_no: 2
  }, {
    id: 14,
    name: 'Away Player 3',
    batting_no: 3
  }, {
    id: 15,
    name: 'Away Player 4',
    batting_no: 4
  }, {
    id: 16,
    name: 'Away Player 5',
    batting_no: 5
  }, {
    id: 17,
    name: 'Away Player 6',
    batting_no: 6
  }, {
    id: 18,
    name: 'Away Player 7',
    batting_no: 7
  }, {
    id: 19,
    name: 'Away Player 8',
    batting_no: 8
  }, {
    id: 20,
    name: 'Away Player 9',
    batting_no: 9
  }, {
    id: 21,
    name: 'Away Player 10',
    batting_no: 10
  }, {
    id: 22,
    name: 'Away Player 11',
    batting_no: 11
  }];

  var obj = {

    players: [],

    lookup: function(player) {
      for (var i = 0; i < this.players.length; i++) {
        if (this.players[i].id == player.id) {
          return i;
        }
      }
      return -1;
    },

    up: function(player) {
      var i = this.lookup(player);
      if (i < 0) {
        return false;
      }
      if (i > 0) {
        var tmp = this.players[i];
        this.players[i] = this.players[i - 1];
        this.players[i - 1] = tmp;
        this.renumber();
      }
    },

    down: function(player) {
      var i = this.lookup(player);
      if (i < 0) {
        return false;
      }
      if (i < this.players.length - 1) {
        var tmp = this.players[i];
        this.players[i] = this.players[i + 1];
        this.players[i + 1] = tmp;
        this.renumber();
      }
    },

    save: function(player) {
      if (player.batting_no < 1 || player.batting_no > 11) {
        return false;
      }
      var i = this.lookup(player);
      if (i < 0) {
        return false;
      }
      //alert(player.batting_no +
      //  ' != ' + (i + 1));
      if (player.batting_no != i + 1) {
        //alert("Change");
        this.players.splice(i, 1);
        //alert("Removed item "+i);
        this.players.splice(player.batting_no - 1, 0, player);
        //alert("Added item "+ (player.batting_no - 1));
        this.renumber();
      } else {
        this.players[i] = player;
      }
      Storage.put(this.team, this.players);
      this.reset();
    },
    renumber: function() {
      // alert(this.players.length);
      for (var i = 0; i < this.players.length; i++) {
        this.players[i].batting_no = i + 1;
        this.players[i].old_batting_no = i + 1;
        // alert(this.players[i].name + " : " + this.players[i].batting_no);
      }
    },
    sort_by_batting_no: function() {
      this.players.sort(function(a, b) {
        // alert(a.batting_no + " : " + b.batting_no);
        return a.batting_no - b.batting_no;
      });
    },
    start_bowling: function(player) {
      var bowling = this.get_bowling();
      if (bowling.length >= 2) {
        return false;
      }
      // alert(1);
      var bowlers = this.get_bowlers();
      // alert(JSON.stringify(bowlers));
      var next_bowler_no = bowlers.length ? bowlers[bowlers.length - 1].bowler + 1 : 1;
      // alert("next_bowler_no " + next_bowler_no);
      var i = this.lookup(player);
      if (i >= 0) {
        this.players[i].bowler = next_bowler_no;
        this.players[i].bowling = true;
      }
      return true;
    },
    stop_bowling: function(player) {
      var i = this.lookup(player);
      if (i >= 0) {
        this.players[i].bowling = false;
        return true;
      }
      return false;
    },
    get_bowlers: function() {
      var bowlers = [];
      for (var i = 0; i < this.players.length; i++) {
        if (this.players[i].bowler) {
          bowlers.push(this.players[i]);
        }
      }
      bowlers = bowlers.sort(this.sort_by_bowler_no);
      return bowlers;
    },
    get_bowling: function() {
      var bowlers = this.get_bowlers();
      var bowling = [];
      for (var i = 0; i < bowlers.length; i++) {
        if (bowlers[i].bowling) {
          bowling.push(bowlers[i]);
        }
      }
      return bowling;
    },
    reset: function() {
      if (this.team) {
        var p = Storage.get(this.team);
        this.players = p ? p : this.team == "home" ? home_players : away_players;
        this.sort_by_batting_no();
        this.renumber();
      }
    },
    accept: function() {
      Storage.put(this.team, this.players);
      // alert('put '+this.team+' '+JSON.stringify(this.players));
      this.broadcast_players();
    },
    broadcast_players: function() {
      $rootScope.$broadcast('players_changed', {
        'home_players': Storage.get('home'),
        'away_players': Storage.get('away')
      });
    },
    set_team: function(team) {
      // alert(team);
      this.team = team;
    },
    clear_bowlers: function(team) {
      var players = Storage.get(team);
      for (var i = 0; i < players.length; i++) {
        players[i].bowling = false;
        players[i].bowler = false;
      }
      Storage.put(team, players);
      this.broadcast_players();
    },
    sort_by_bowler_no: function(a, b) {
      if (!a.bowler) {
        a.bowler = 0;
      }
      if (!b.bowler) {
        b.bowler = 0;
      }
      return parseInt(a.bowler) - parseInt(b.bowler);
    }
  };

  obj.set_team('home');
  obj.reset();
  obj.accept();
  obj.set_team('away');
  obj.reset();
  obj.accept();

  //alert('Here');
  return obj;

}]);

/**
 * @class ScoreboardFactory
 * @memberOf scorer
 * @name Scoreboard
 * @class
 */
angular.module("scorer").factory('Scoreboard', ['Storage', 'Settings', '$rootScope',
  'Players', 'Over', 'Batsman', 'Ball', 'ScoreboardTemplate',
  function(Storage, Settings, $rootScope, Players, Over, Batsman, Ball, ScoreboardTemplate) {

    var initial_scoreboard = Storage.get_scoreboard();
    console.log(JSON.stringify(ScoreboardTemplate));

    if (!initial_scoreboard) {
      console.log("Initialise");
      initial_scoreboard = ScoreboardTemplate;
    }

    /** @constructor */
    var Scoreboard = function(ScoreboardTemplate) {

      this.scoreboard = ScoreboardTemplate.innings[0];
      this.next_innings = ScoreboardTemplate.innings[1];

      console.log('scoreboard ' + JSON.stringify(this.scoreboard));

      /** @function change_ends
       * @memberOf Scoreboard
       */
      this.change_ends = function(num_runs) {

        if (num_runs % 2 === 0) {
          return true;
        }

        if (this.scoreboard.left_bat.striker === true) {
          this.scoreboard.left_bat.striker = false;
          this.scoreboard.right_bat.striker = true;
        } else {
          this.scoreboard.left_bat.striker = true;
          this.scoreboard.right_bat.striker = false;
        }
      };

      /**
       *  @function change_bowlers
       *  @memberOf Scoreboard
       */
      this.change_bowlers = function() {
        var tmp = this.scoreboard.bowler;
        this.scoreboard.bowler = this.scoreboard.next_bowler;
        this.scoreboard.next_bowler = tmp;
      };

      /** @function alert_game_over
       *  @memberOf Scoreboard
       */
      this.alert_game_over = function() {
        if (this.scoreboard.game_over === true) {
          alert("The game is over!");
          return true;
        }
        return this.alert_innings_over();
      };

      /** @function alert_innings_over
       *  @memberOf Scoreboard
       */
      this.alert_innings_over = function() {
        if (this.scoreboard.game_over === false && this.scoreboard.innings_over === true) {
          alert("The innings is over!");
          this.new_innings();
          return true;
        }
        return false;
      };

      /** @function alert_no_bowler
       *  @memberOf Scoreboard
       */
      this.alert_no_bowler = function() {
        if (!this.scoreboard.bowler.name) {
          alert("Please select a bowler.");
          return true;
        }
        return false;
      };

      /** @function bowls
       *  @memberOf Scoreboard
       */
      this.bowls = function(type, runs) {

        if (this.alert_game_over()) {
          return false;
        }

        if (this.alert_no_bowler()) {
          return false;
        }

        switch (type) {
          case 'wicket':
            this.wicket();
            break;
          case 'bye':
          case 'leg_bye':
            this.scoreboard.balls += 1;
            this.add_ball(this.scoreboard.left_bat.striker ? this.scoreboard.left_bat : this.scoreboard.right_bat, 0, 1, false, true);
            this.change_ends(1);
            this.scoreboard.extras += 1;
            this.scoreboard.total += 1;
            break;
          case 'no_ball':
          case 'wide':
            this.scoreboard.extras += 1;
            this.scoreboard.total += 1;
            this.add_ball(this.scoreboard.left_bat.striker ? this.scoreboard.left_bat : this.scoreboard.right_bat, 0, 1, false, false);
            break;
          case 'ball':
            this.ball(runs);
            this.change_ends(runs);
            break;
        }

        this.over();

        this.set_game_over();

        this.save();
      };

      /** @function set_game_over
       *  @memberOf Scoreboard
       */
      this.set_game_over = function() {
        this.set_innings_over();
        if (this.scoreboard.last_innings > 0 && this.scoreboard.total > this.scoreboard.last_innings) {
          this.scoreboard.game_over = true;
        }
        if (this.scoreboard.innings_over && this.scoreboard.innings_no > 1) {
          this.scoreboard.game_over = true;
        }
      };

      /** @function set_innings_over
       *  @memberOf Scoreboard
       */
      this.set_innings_over = function() {
        if (this.scoreboard.wickets >= 10) {
          this.scoreboard.innings_over = true;
        }
        //alert(this.scoreboard.num_overs + ' : ' + this.scoreboard.overs);
        if (this.scoreboard.num_overs && this.scoreboard.overs >= this.scoreboard.num_overs) {
          //alert(1);
          this.scoreboard.innings_over = true;
        }

        return this.scoreboard.innings_over;
      };

      /** @function over
       *  @memberOf Scoreboard
       */
      this.over = function() {
        if (this.scoreboard.balls >= 6) {
          this.scoreboard.balls = 0;
          this.scoreboard.overs += 1;
          this.scoreboard.overs_and_balls = this.scoreboard.overs;
          this.change_ends();
          this.change_bowlers();
          // alert("About to add over " + parseInt(this.scoreboard.overs + 1));
          this.add_over(parseInt(this.scoreboard.overs) + 1, this.scoreboard.bowler);
        } else {
          this.scoreboard.overs_and_balls = this.scoreboard.overs + '.' + this.scoreboard.balls;
        }
      };

      /** @function add_runs_to_striker
       *  @memberOf Scoreboard
       */
      this.add_runs_to_striker = function(runs) {
        if (this.scoreboard.left_bat.striker) {
          this.scoreboard.left_bat.runs += runs;
        } else {
          this.scoreboard.right_bat.runs += runs;
        }
      };

      /** @function ball
       *  @memberOf Scoreboard
       */
      this.ball = function(runs) {

        this.scoreboard.total += runs;
        this.scoreboard.balls++;

        this.add_runs_to_striker(runs);

        this.add_ball(this.scoreboard.left_bat.striker ? this.scoreboard.left_bat : this.scoreboard.right_bat, runs, 0, false, true);

      };

      /** @function wicket
       *  @memberOf Scoreboard
       */
      this.wicket = function() {
        this.scoreboard.balls++;
        this.scoreboard.wickets += 1;

        if (this.set_game_over()) {
          return true;
        }
        this.add_ball(this.scoreboard.left_bat.striker ? this.scoreboard.left_bat : this.scoreboard.right_bat, 0, 0, true, true);
        var next_batsman_no = (this.scoreboard.left_bat.no > this.scoreboard.right_bat.no) ?
          this.scoreboard.left_bat.no + 1 :
          this.scoreboard.right_bat.no + 1;

        if (this.scoreboard.left_bat.striker === true) {
          this.scoreboard.left_bat = new Batsman();
          this.scoreboard.left_bat.no = next_batsman_no;
          this.scoreboard.left_bat.striker = true;

        } else {
          this.scoreboard.right_bat = new Batsman();
          this.scoreboard.right_bat.no = next_batsman_no;
          this.scoreboard.right_bat.striker = true;
        }
        this.set_batsmen_details();
        this.save();
      };

      /** @function add_extra
       *  @memberOf Scoreboard
       */
      this.add_extra = function(extra) {
        if (this.alert_game_over()) {
          return false;
        }
        this.add_extras[extra.type](this, extra);
        this.set_game_over();
        this.save();
      };

      /** @function add_extras
       *  @memberOf Scoreboard
       */
      add_extras = {
        no_ball: function(obj, extra) {
          obj.scoreboard.total += (extra.runs + extra.extras);
          obj.add_runs_to_striker(extra.runs);
          obj.change_ends(extra.runs + extra.extras - 1);
          obj.add_ball(obj.scoreboard.left_bat.striker ?
            obj.scoreboard.left_bat : obj.scoreboard.right_bat, extra.runs, extra.extras, false, false);
        },
        wide: function(obj, extra) {
          obj.scoreboard.total += extra.extras;
          obj.add_ball(obj.scoreboard.left_bat.striker ?
            obj.scoreboard.left_bat : obj.scoreboard.right_bat, 0, extra.extras, false, false);
          if (extra.extras > 1) {
            obj.change_ends(extra.extras - 1);
          }
        },
        leg_bye: function(obj, extra) {
          obj.scoreboard.balls++;
          obj.scoreboard.total += extra.extras;
          obj.add_ball(obj.scoreboard.left_bat.striker ?
            obj.scoreboard.left_bat : obj.scoreboard.right_bat, 0, extra.extras, false, true);
          obj.change_ends(extra.extras);
          obj.over();
        },
        bye: function(obj, extra) {
          obj.scoreboard.balls++;
          obj.scoreboard.total += extra.extras;
          obj.add_ball(obj.scoreboard.left_bat.striker ?
            obj.scoreboard.left_bat : obj.scoreboard.right_bat, 0, extra.extras, false, true);
          obj.change_ends(extra.extras);
          obj.over();
        }
      };

      /** @function save
       *  @memberOf Scoreboard
       */
      this.save = function() {
        Storage.put_scoreboard(this.scoreboard);
      };

      /** @function new_match
       *  @memberOf Scoreboard
       */
      this.new_match = function() {
        this.scoreboard = ScoreboardTemplate;
        Storage.put_scoreboard(this.scoreboard);
        this.set_batsmen_details();
        Players.clear_bowlers('home');
        Players.clear_bowlers('away');
      };

      /** @function new_innings
       *  @memberOf Scoreboard
       */
      this.new_innings = function() {

        Storage.put('last_innings', this.scoreboard);
        var last_innings_runs = this.scoreboard.total;
        var last_overs_history = this.scoreboard.overs_history;
        var num_overs = this.scoreboard.num_overs;

        this.scoreboard = this.next_innings;

        this.scoreboard.last_innings = last_innings_runs;
        this.scoreboard.last_overs_history = last_overs_history;
        this.scoreboard.target = last_innings_runs + 1;
        this.scoreboard.innings_no += 1;
        this.scoreboard.batting_team = this.scoreboard.batting_team == "home" ? "away" : "home";
        this.scoreboard.num_overs = num_overs;

        this.set_batsmen_details();
      };

      /** @function set_batting_team
       *  @memberOf Scoreboard
       */
      this.set_batting_team = function(batting_team) {
        if (batting_team != this.scoreboard.batting_team) {
          this.scoreboard.batting_team = batting_team;
          this.set_batsmen_details();
          //alert("About to set_bowler_details");
          this.set_bowler_details();
          //alert("Done");
        }
      };

      /** @function set_batsmen_details
       *  @memberOf Scoreboard
       */
      this.set_batsmen_details = function() {

        var check = function(batsman, players) {
          for (var i = 0; i < players.length; i++) {
            if (batsman.no == players[i].batting_no) {
              batsman.name = players[i].name;
              batsman.id = players[i].id;
              batsman.description = players[i].description;
              batsman.bowling = players[i].bowling;
              batsman.bowler = players[i].bowler;
              return batsman;
            }
          }
          return false;
        };

        var players = this.scoreboard.batting_team == "home" ? this.home_players.players : this.away_players.players;
        console.log("set_batsmen_details");
        console.log(JSON.stringify(this.scoreboard));
        this.left_bat = check(this.scoreboard.innings.left_bat, players);
        this.right_bat = check(this.scoreboard.innings.right_bat, players);
        // alert(JSON.stringify(this.scoreboard.right_bat));

      };

      // ***********************************************************************
      /** @function set_bowler_details
       * @memberOf Scoreboard
       */
      this.set_bowler_details = function() {

        /** @function */
        var is_bowling = function(bowlers, bowler) {
          for (var i = 0; i < bowlers.length; i++) {
            if (bowlers[i].id == bowler.id) {
              return bowlers[i];
            }
          }
          return false;
        };
        /** @function @memberOf Scoreboard*/
        var set_bowler = function(bowlers, bowler) {
          if (!bowlers.length) {
            return {};
          }

          if (!bowler.id) {
            return bowlers.shift();
          } else if (!is_bowling(bowlers, bowler)) {
            return {};
          } else {
            return bowlers[0].id == bowler.id ? bowlers.shift() : bowlers.pop();
          }
          return bowler;
        };

        var bowling_team = this.scoreboard.batting_team == "home" ? this.away_players : this.home_players;
        var bowlers = bowling_team.get_bowlers();

        this.scoreboard.bowler = set_bowler(bowlers, this.scoreboard.bowler);

        //alert("next set_bowler: " + bowlers.length + " : " + JSON.stringify(this.scoreboard.next_bowler));
        this.scoreboard.next_bowler = set_bowler(bowlers, this.scoreboard.next_bowler);
      };

      // ***********************************************************************
      /** @function reset
       *  @memberOf Scoreboard
       */
      this.reset = function() {
        Players.set_team('home');
        Players.reset();
        this.home_players = jQuery.extend(true, {}, Players);

        Players.set_team('away');
        Players.reset();
        this.away_players = jQuery.extend(true, {}, Players);

        this.set_batsmen_details();
        this.set_bowler_details();

      };

      /** @function add_over
       *   @memberOf Scoreboard
       */
      this.add_over = function(over_no, bowler_obj) {
        this.scoreboard.overs_history.push(new Over(over_no, bowler_obj));
      };

      /** @function add_ball
       *   @memberOf Scoreboard
       */
      this.add_ball = function(striker, runs, extras, wkt, valid) {
        if (!this.scoreboard.overs_history.length) {
          this.add_over(1, this.scoreboard.bowler);
        }
        var over = this.scoreboard.overs_history[this.scoreboard.overs_history.length - 1];
        if (over.valid_balls >= 6) {
          alert("The over has finished.");
        }
        this.scoreboard.overs_history[this.scoreboard.overs_history.length - 1].balls.push(new Ball(
          striker, runs, extras, wkt, valid));
        if (valid) {
          this.scoreboard.overs_history[this.scoreboard.overs_history.length - 1].valid_balls += 1;
        }
        this.scoreboard.overs_history[this.scoreboard.overs_history.length - 1].total_balls += 1;
      };

      /** @function is_ready
       *  @memberOf Scoreboard
       */
      this.is_ready = function() {
        if (!this.scoreboard.overs_history.length) {
          return false;
        }
        if (this.scoreboard.overs_history[this.scoreboard.overs_history.length - 1].valid_balls >= 6) {
          return false;
        }
        return true;
      };

      /** @function clear
       *  @memberOf Scoreboard
       */
      this.clear = function() {
        this.scoreboard.overs_history = [];
      };

    };

    console.log("Initial Scoreboard: " + JSON.stringify(initial_scoreboard));

    var s = new Scoreboard(initial_scoreboard);

    $rootScope.$on('settings_changed', function(event, args) {
      s.scoreboard.num_overs = args.num_overs;
      alert('Hi ' + s.scoreboard.num_overs);
      s.set_batting_team(args.team_batting_first.home_away);
    });

    return s;
  }
]);

/**
 * @class ScoreboardTemplateService
 * @memberOf scorer
 * @name ScoreboardTemplate
 * @class
 */
angular.module("scorer").service('ScoreboardTemplate', ['Settings', 'Innings',
  function(Settings, Innings) {
    this.innings = [];

    // console.log("settings: "+JSON.stringify(Settings));
    var innings = Innings;
    for (var i = 0; i < Settings.settings.num_innings;i++) {
      this.innings.push(new innings(Settings));
    }
  }
]);

angular.module("scorer").factory('Settings', ['Storage', '$rootScope', function(Storage, $rootScope) {

  var get_settings = function() {
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
        num_innings: 2,
        home_team: {
          id: 1,
          name: 'Home Team',
          home_away: 'home'
        },
        away_team: {
          id: 2,
          name: 'Away Team',
          home_away: 'away'
        },
        team_batting_first: {
          id: 1,
          name: 'Home Team',
          home_away: 'home'
        }
      };
    }
    return settings;
  };

  var obj = {
    'settings': {},
    'reset': function() {
      this.settings = get_settings();
      $rootScope.$broadcast('settings_changed', this.settings);
    },
    'accept': function() {
      Storage.put('settings', this.settings);
      $rootScope.$broadcast('settings_changed', this.settings);
      // alert(9);
    }
  };

  obj.reset();
  return obj;
}]);

/**
 * @class StorageFactory
 * @memberOf scorer
 */
/**
 * @name Storage
 * @class
 */
angular.module("scorer").factory('Storage', function() {

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
