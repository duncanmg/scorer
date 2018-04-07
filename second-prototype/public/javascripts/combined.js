
// Evaluated by gulp

/**
* @namespace scorer
*
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
 * @memberOf scorer.controller
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
 * @memberOf scorer.controller
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
 * @memberOf scorer.controller
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
 * @memberOf scorer.controller
 */
angular.module('scorer').controller('ScorerController', ['$scope', '$stateParams', '$state', 'Scoreboard', function($scope, $stateParams, $state, Scoreboard) {

    'use strict';

    var board = Scoreboard;
    $scope.scoreboard = board.scoreboard;
    $scope.board = board;
    $scope.board.reset();
    alert('Bang!');
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

/**
* @namespace controller
* @memberOf scorer
*
*/

/**
* @namespace service
* @memberOf scorer
*
*/

/**
 *

 */
angular.module("scorer").factory('Ball', [function() {

  /** Creates an instance of Ball
   *
   * @class Ball
   * @memberOf scorer.factory
   * @constructor Ball
   * @ball {Ball}
   * @param {Batsman} striker - The batsman who was on strike.
   * @param {integer} runs - The number runs scored off the bat.
   * @param {integer} extras - The number of extras.
   * @param {integer} wkt - Was a wicket taken? 1 = Yes, 0 = No
   * @param {integer} valid - Was the ball valid? 1 = Yes, 0 = No.
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


angular.module("scorer").factory('Batsman', [function() {

  /**
   * Creates an instance of Batsman
   *
   * @class Batsman
   * @memberOf scorer.factory
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
 *

 */
angular.module("scorer").factory('DeliveryManager', ['DeliveryType', function(Ball) {

  /** Creates an instance of DeliveryManager
   *
   * @class DeliveryManager
   * @memberOf scorer.factory
   * @classdesc - Handles changing the score, changing batsmen, changing ends.
   * @constructor DeliveryManager
   * @param {Match} match - The Match object.
   * @return {DeliveryManager} The new DeliveryManager object.
   * @description - Handles changing the score, changing batsmen, changing ends.
   */
  var DeliveryManager = function(match) {

     this.match = match;

  };

  return DeliveryManager;
}]);

/**
 *

 */
angular.module("scorer").factory('DeliveryType', ['Wicket', 'Bye', 'LegBye', 'NoBall', 'Wide', 'Delivery',
function(Wicket, Bye, LegBye, NoBall, Wide, Delivery) {

  /** Creates an instance of DeliveryManager
   *
   * @class DeliveryType
   * @memberOf scorer.factory
   * @classdesc - Returns an instance of a correct delivery class..
   * @constructor DeliveryType
   * @param {Wicket}
   * @param {Bye}
   * @param {LegBye}
   * @param {NoBall}
   * @param {Wide}
   * @param {Delivery}
   * @return The an instance of the appropriate Delivery class.
   * @description -
   */
  var DeliveryType = function() {}

  /**
   * @function get
   * @memberOf scorer.factory.DeliveryType
   * @param {string} type - type of delivery.
   */
  this.get = function(type) {
    switch (type) {
      case 'wicket':
        return (new Wicket());
      case 'bye':
        return (new Bye());
      case 'leg_bye':
        return (new LegBye());
      case 'no_ball':
        return (new NoBall());
      case 'wide':
        return new Wide());
    case 'ball':
      return new Delivery();
    default:
      console.log('Invalid delivery type ' + type);
  };

};

return DeliveryType;
}]);

/**
 * @class Innings
 * @memberOf scorer.factory
 * @constructor Innings
 */
angular.module("scorer").factory('Innings', [
  function() {
    var Innings = function(Settings) {

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

angular.module("scorer").factory('Match', ['Storage', function(Storage) {

  /**
   * @class Match
   * @memberOf scorer.factory
   * @constructor Match
   * @returns {Match}
   * @description The Match object does the hard work. The constructor does very little,
   * the object must be set up before it can do much.
   */
  return function() {
    this.storage = new Storage();

    /**
     * @function setup
     * @memberOf scorer.factory.Match
     * @param {Settings} settings -  The Settings object which will dictate the format of the match.
     * @param {TeamData} home_team - The home team.
     * @param {TeamData} away_team - The away team.
     */
    this.setup = function(settings, home_team, away_team) {
       this.settings = settings;
       this.home_team = home_team;
       this.away_team = away_team;
    };

    /**
     * @function set_batting_team
     * @memberOf scorer.factory.Match
     * @param {TeamData} batting_team - The batting team.
     * @description Sets the team given as the batting team and the other as the bowling team.
     */
    this.set_batting_team = function(batting_team) {
       // http://stackoverflow.com/questions/1068834/object-comparison-in-javascript
       if (JSON.stringify(this.home_team) === JSON.stringify(batting_team)){
         this.batting_team = this.home_team;
         this.bowling_team = this.away_team;
       }
       else {
         this.batting_team = this.away_team;
         this.bowling_team = this.home_team;
       }
    };

    /**
     * @function set_bowler_end_1
     * @memberOf scorer.factory.Match
     * @param {TeamData.Player} bowler - The bowler at end 1.
     * @description Sets the bowler at end 1, overwriting the current bowler at that end.
     */
    this.set_bowler_end_1 = function(bowler) {
       this.bowler_end_1 = bowler;
    };

    /**
     * @function set_bowler_end_2
     * @memberOf scorer.factory.Match
     * @param {TeamData.Player} bowler - The bowler at end 2.
     * @description Sets the bowler at end 2, overwriting the current bowler at that end.
     */
    this.set_bowler_end_2 = function(bowler) {
       this.bowler_end_2 = bowler;
    };

    /**
     * @function set_batsman_end_1
     * @memberOf scorer.factory.Match
     * @param {TeamData.Player} batsman - The batsman at end 1.
     * @description Sets the batsman who will face the next ball at end 1, overwriting the current batsman at that end.
     */
    this.set_batsman_end_1 = function(batsman) {
       this.batsman_end_1 = batsman;
    };

    /**
     * @function set_batsman_end_2
     * @memberOf scorer.factory.Match
     * @param {TeamData.Player} batsman - The batsman at end 2.
     * @description Sets the batsman who will face the next ball at end 2, overwriting the current batsman at that end.
     */
    this.set_batsman_end_2 = function(batsman) {
       this.batsman_end_2 = batsman;
    };

  };

}]);

/**
 *

 */
angular.module("scorer").factory('NoBall', [
function() {

  /** Creates an instance of DeliveryManager
   *
   * @class NoBall
   * @memberOf scorer.factory
   * @classdesc - Returns an instance of a correct delivery class..
   * @constructor NoBall

   * @return {NoBall}
   * @description -
   */
  var NoBall = function() {}

  /**
   * @function record
   * @memberOf scorer.factory.DeliveryType
   * @param {Scoreboard} The scoreboard
   */
  this.record = function(scoreboard, details) {
    scoreboard.extras += 1;
    scoreboard.total += 1;
    this.add_ball(this.scoreboard.left_bat.striker ? this.scoreboard.left_bat : this.scoreboard.right_bat, 0, 1, false, false);
    break;
  };

};

return NoBall;
}]);

/**
 * @class Others
 * @memberOf scorer.factory
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

angular.module("scorer").factory('Over', [function() {
/** Creates an instance of Over
 *
 * @class Over
 * @memberOf scorer.factory
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
 * @class Players
 * @memberOf scorer.factory
 */
angular.module("scorer").factory('Players', ['Storage', '$rootScope', function(Storage, $rootScope) {

  'use strict';
  var storage = new Storage();

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
      storage.put(this.team, this.players);
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
        var p = storage.get(this.team);
        this.players = p ? p : this.team == "home" ? home_players : away_players;
        this.sort_by_batting_no();
        this.renumber();
      }
    },
    accept: function() {
      storage.put(this.team, this.players);
      // alert('put '+this.team+' '+JSON.stringify(this.players));
      this.broadcast_players();
    },
    broadcast_players: function() {
      $rootScope.$broadcast('players_changed', {
        'home_players': storage.get('home'),
        'away_players': storage.get('away')
      });
    },
    set_team: function(team) {
      // alert(team);
      this.team = team;
    },
    clear_bowlers: function(team) {
      var players = storage.get(team);
      for (var i = 0; i < players.length; i++) {
        players[i].bowling = false;
        players[i].bowler = false;
      }
      storage.put(team, players);
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

angular.module("scorer").factory('Scoreboard', ['Storage', 'Settings', '$rootScope',
  'Players', 'Over', 'Batsman', 'Ball', 'ScoreboardTemplate',
  function(Storage, Settings, $rootScope, Players, Over, Batsman, Ball, ScoreboardTemplate) {

    var storage = new Storage();
    var initial_scoreboard = storage.get_scoreboard();
    console.log(JSON.stringify(ScoreboardTemplate));

    if (!initial_scoreboard) {
      console.log("Initialise");
      initial_scoreboard = new ScoreboardTemplate(Settings);
      initial_scoreboard.fred = 1;
    }

    /**
     * @class Scoreboard
     * @memberOf scorer.factory
     * @constructor Scoreboard
     * @param {ScoreboardTemplate} scoreboard_template
     */
    var Scoreboard = function(scoreboard_template) {

      var s = jQuery.extend(true, {}, scoreboard_template);
      this.scoreboard = s.innings[0];
      this.next_innings = s.innings[1];

      console.log('scoreboard ' + JSON.stringify(this.scoreboard));

      /**
       * @function change_ends
       * @memberOf scorer.factory.Scoreboard
       * @param {integer} num_runs - Number of times the batsmen ran on the last ball.
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
       *  @memberOf scorer.factory.Scoreboard
       */
      this.change_bowlers = function() {
        var tmp = this.scoreboard.bowler;
        this.scoreboard.bowler = this.scoreboard.next_bowler;
        this.scoreboard.next_bowler = tmp;
      };

      /** @function alert_game_over
       *  @memberOf scorer.factory.Scoreboard
       */
      this.alert_game_over = function() {
        if (this.scoreboard.game_over === true) {
          alert("The game is over!");
          return true;
        }
        return this.alert_innings_over();
      };

      /** @function alert_innings_over
       *  @memberOf scorer.factory.Scoreboard
       *  @return {boolean}
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
       *  @memberOf scorer.factory.Scoreboard
       *  @return boolean
       */
      this.alert_no_bowler = function() {
        if (!this.scoreboard.bowler.name) {
          alert("Please select a bowler.");
          return true;
        }
        return false;
      };

      /** @function bowls
       *  @memberOf scorer.factory.Scoreboard
       *  @return {boolean}
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
       *  @memberOf scorer.factory.Scoreboard
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
       *  @memberOf scorer.factory.Scoreboard
       * return {boolean}
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
       *  @memberOf scorer.factory.Scoreboard
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
       *  @memberOf scorer.factory.Scoreboard
       *  @param {integer} runs - Number of runs to be added.
       */
      this.add_runs_to_striker = function(runs) {
        if (this.scoreboard.left_bat.striker) {
          this.scoreboard.left_bat.runs += runs;
        } else {
          this.scoreboard.right_bat.runs += runs;
        }
      };

      /** @function ball
       *  @memberOf scorer.factory.Scoreboard
       *  @param {integer} - Number of runs scored off the ball.
       */
      this.ball = function(runs) {

        this.scoreboard.total += runs;
        this.scoreboard.balls++;

        this.add_runs_to_striker(runs);

        this.add_ball(this.scoreboard.left_bat.striker ? this.scoreboard.left_bat : this.scoreboard.right_bat, runs, 0, false, true);

      };

      /** @function wicket
       *  @memberOf scorer.factory.Scoreboard
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
       *  @memberOf scorer.factory.Scoreboard
       *  @param {Extra} extra - The Extra object for the ball.
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
       *  @memberOf scorer.factory.Scoreboard
       *  @param {Scoreboard} obj - ?????
       *  @param {Extra} extra - The Extra object for the ball.
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
       *  @memberOf scorer.factory.Scoreboard
       */
      this.save = function() {
        storage.put_scoreboard(this.scoreboard);
      };

      /** @function new_match
       *  @memberOf scorer.factory.Scoreboard
       */
      this.new_match = function() {
        var s = new ScoreboardTemplate(Settings);
        console.log("new_match s.innings[0].overs_history");
        console.log(JSON.stringify(s.innings[0].overs_history));
        console.log("new_match this.scoreboard.overs_history");
        console.log(JSON.stringify(this.scoreboard.overs_history));
        this.scoreboard = s.innings[0];
        this.next_innings = s.innings[1];
        console.log("new_match");
        console.log(JSON.stringify(this));
        this.save();
      };

      /** @function new_innings
       *  @memberOf scorer.factory.Scoreboard
       */
      this.new_innings = function() {

        storage.put('last_innings', this.scoreboard);
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
       *  @memberOf scorer.factory.Scoreboard
       *  @param {Players} - batting_team - The batting team.
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
       *  @memberOf scorer.factory.Scoreboard
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
        this.left_bat = check(this.scoreboard.left_bat, players);
        this.right_bat = check(this.scoreboard.right_bat, players);
        // alert(JSON.stringify(this.scoreboard.right_bat));

      };

      // ***********************************************************************
      /** @function set_bowler_details
       * @memberOf scorer.factory.Scoreboard
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
        /** @function */
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
       *  @memberOf scorer.factory.Scoreboard
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
       *  @memberOf scorer.factory.Scoreboard
       *  @param {integer} over_no - The number of the over.
       *  @param {Player}  bowler_obj - The bowler of the over.
       */
      this.add_over = function(over_no, bowler_obj) {
        this.scoreboard.overs_history.push(new Over(over_no, bowler_obj));
      };

      /** @function add_ball
       *  @memberOf scorer.factory.Scoreboard
       *  @param striker
       *  @param runs
       *  @param extras
       *  @param wkt
       *  @param valid
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
       *  @memberOf scorer.factory.Scoreboard
       *  @return {boolean}
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
       *  @memberOf scorer.factory.Scoreboard
       */
      this.clear = function() {
        this.scoreboard.overs_history = [];
      };

    };

    console.log("Initial Scoreboard: " + JSON.stringify(initial_scoreboard));

    var s = new Scoreboard(initial_scoreboard);

    $rootScope.$on('settings_changed', function(event, args) {
      s.scoreboard.num_overs = args.num_overs;
      s.set_batting_team(args.team_batting_first.home_away);
    });

    return s;
  }
]);

/**
 * @class ScoreboardTemplate
 * @memberOf scorer.factory
 */
angular.module("scorer").factory('ScoreboardTemplate', ['Settings', 'Innings',
  function(Settings, Innings) {

    var obj = function() {
      this.innings = [];

      // console.log("settings: " + JSON.stringify(Settings));
      var innings = Innings;
      for (var i = 0; i < Settings.settings.num_innings; i++) {
        this.innings.push(new innings(Settings));
      }
    };
    return obj;
  }
]);

/**
 * @class Settings
 * @memberOf scorer.factory
 */
angular.module("scorer").factory('Settings', ['Storage', '$rootScope', function(Storage, $rootScope) {

  var get_settings = function() {
    var storage = new Storage();
    var settings = storage.get('settings');

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
      storage.put('settings', this.settings);
      $rootScope.$broadcast('settings_changed', this.settings);
      // alert(9);
    }
  };

  obj.reset();
  return obj;
}]);

/**
 * @class SettingsData
 * @memberOf scorer.factory
 * A SettingsData object with default values.
 */
angular.module("scorer").factory('SettingsData', [ function() {

      return function() {
        this.match_type= {
          id: 1,
          name: 'Limited Overs'
        };
        this.match_types= [{
          id: 1,
          name: 'Limited Overs'
        }, {
          id: 2,
          name: 'Timed'
        }, {
          id: 3,
          name: 'Pairs'
        }];
        this.num_overs= 40;
        this.num_innings= 2;
        this.home_team= {
          id: 1,
          name: 'Home Team',
          home_away: 'home'
        };
        this.away_team= {
          id: 2,
          name: 'Away Team',
          home_away: 'away'
        };
        this.team_batting_first= {
          id: 1,
          name: 'Home Team',
          home_away: 'home'
        };
      };
}]);

/**
 * @class Storage
 * @memberOf scorer.factory
 * @description The class which handles the storage currently just uses the browser
 *     session storage which is cleared when the browser is closed.
 *     It will need to be extended to access a database and possibly synchronize
 *     remote and local storage.
 */
angular.module("scorer").factory('Storage', [function() {

  return function() {

    // Private function.
    var get = function(key) {
      var value;
      try {
        value = JSON.parse(sessionStorage[key]);
        return value;
      } catch (e) {
        return false;
      }
    };

    // Private function.
    var put = function(key, value) {
      sessionStorage[key] = JSON.stringify(value);
      return true;
    };

    /**
     * @function get_match
     * @memberOf scorer.factory.Storage
     * @param {integer} match_id - Unique identifier of the match.
     */
    this.get_match = function(match_id) {
      return this.get(match_id);
    };

    /**
     * @function put_match
     * @memberOf scorer.factory.Storage
     * @param {integer} match_id - Unique identifier of the match.
     * @param {MatchData} match - The MatchData object.
     */
    this.put_match = function(match_id, match) {
      this.put(match_id, match);
      return true;
    };

    /**
     * @function get_team
     * @memberOf scorer.factory.Storage
     * @param {integer} team_id - Unique identifier of the team.
     */
    this.get_team = function(team_id) {
      return this.get(team_id);
    };

    /**
     * @function put_team
     * @memberOf scorer.factory.Storage
     * @param {integer} team_id - Unique identifier of the team.
     * @param {TeamData} match_id - The TeamData object.
     */
    this.put_team = function(team_id, team) {
      this.put(team_id, team);
      return true;
    };

    /**
     * @function get_settings
     * @memberOf scorer.factory.Storage
     * @param {integer} match_id - Unique identifier of the set of settings.
     */
    this.get_settings = function(settings_id) {
      return this.get(settings_id);
    };

    /**
     * @function put_settings
     * @memberOf scorer.factory.Storage
     * @param {integer} settings_id - Unique identifier of the set of settings.
     * @param {SettingsData} match_id - The SettingsData object.
     */
    this.put_settings = function(settings_id, settings) {
      this.put(settings_id, settings);
      return true;
    };

    this.get = get;
    this.put = put;

    this.get_scoreboard = function() {
      return this.get('scoreboard');
    };

    this.put_scoreboard = function() {
      return this.put('scoreboard');
    };


  };

}]);

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
  };

}]);

/**
* @namespace factory
* @memberOf scorer
*
*/

/**
* @namespace factory
* @memberOf scorer
*
*/
