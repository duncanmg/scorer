
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
  .controller('EditPlayerController',
    ['$scope', '$stateParams', '$state', 'Scoreboard', 'Sc', 'Players', 'team', 'Storage',
      function($scope, $stateParams, $state, Scoreboard, Sc, Players, team, Storage) {
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
          console.log('toggle_bowling');
          // console.log(JSON.stringify(Scoreboard.scoreboard));
          console.log('player=' + JSON.stringify(player));
          if (player.bowling) {
            console.log('About to call stop bowling');
            Sc.Commands.Run(Sc.Commands.StopBowling, [Scoreboard.scoreboard, player]);
            player.bowling = false;
          } else {
            console.log('About to call start_bowling');
            if (!Sc.Commands.Run(Sc.Commands.StartBowling, [Scoreboard.scoreboard, player])) {
              alert("You already have two bowlers");
              return false;
            }
            player.bowling = true;
          }
          console.log('End toggle_bowling: ' + JSON.stringify(Scoreboard.scoreboard.away_players));
          console.log('player=' + JSON.stringify(player));
          return true;
        };

        $scope.accept = function(player) {
          console.log('accept');
          Sc.Commands.Run(Sc.Commands.ModifyPlayerDetails, [Scoreboard.scoreboard, player])
          var storage = new Storage();
          storage.put_scoreboard(Scoreboard.scoreboard);
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

      }
    ]);

/**
 * @class HistoryController
 * @memberOf scorer.controller
 */
angular.module('scorer').controller('HistoryController', ['$scope', '$stateParams', '$state', 'Scoreboard', function($scope, $stateParams, $state, Scoreboard) {

  'use strict';

  var parse_history = function(history) {
    var h = history.slice();
    console.log("........................History.......................");
    //console.log("h=" + JSON.stringify(h));
    h.reverse();
    // console.log("h reversed=" + JSON.stringify(h));
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
angular.module('scorer').controller('ScorerController',
  ['$scope', '$stateParams', '$state', 'Scoreboard',
  function($scope, $stateParams, $state, Scoreboard) {

    'use strict';

    var board = Scoreboard;
    if (! board.scoreboard) {
      board.initialize();
    }
    $scope.scoreboard = board.scoreboard;
    // console.log(JSON.stringify(board.scoreboard));
    $scope.board = board;
    $scope.board.reset();
    // alert('Bang!');
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
    board = undefined;
    // console.log('NewMatchController. Redirect to scorer.');
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

/**
 *

 */
angular.module("scorer").factory('BallManager', ['Ball', function(Ball) {

  /** Creates an instance of BallManager
   *
   * @class BallManager
   * @memberOf scorer.factory
   * @constructor BallManager
   * @param {Match} match - The Match object.
   * @return {BallManager} The new BallManager object.
   * @description - Handles changing the score, changing batsmen, changing ends.
   */
  var BallManager = function(match) {

     this.match = match;

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
angular.module("scorer").factory('DeliveryManager', ['DeliveryType', function(DeliveryType) {

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
  var DeliveryManager = function(DeliveryType) {

     this.deliveryType = new DeliveryType();

     /** @function bowls
      *  @memberOf scorer.factory.Scoreboard
      *  @return {boolean}
      */
     this.bowls = function(deliveryType, runs) {

       if (this.alert_game_over()) {
         return false;
       }

       if (this.alert_no_bowler()) {
         return false;
       }

       this.deliveryType(deliveryType).record(runs);

       this.over();

       this.set_game_over();

       this.save();
     };


  };

  return DeliveryManager;
}]);

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
    var DeliveryType = function(Wicket, Bye, LegBye, NoBall, Wide, Delivery) {

      console.log('DeliveryType called');
      this.Wicket = Wicket;
      this.Bye = Bye;
      this.LegBye = LegBye;
      this.NoBall = NoBall;
      this.Wide = Wide;
      this.Delivery = Delivery;

      /**
       * @function get
       * @memberOf scorer.factory.DeliveryType
       * @param {string} type - type of delivery.
       */
      this.get = function(type) {
        switch (type) {
          case 'wicket':
            return (new this.Wicket());
          case 'bye':
            return (new this.Bye());
          case 'leg_bye':
            return (new this.LegBye());
          case 'no_ball':
            return (new this.NoBall());
          case 'wide':
            return (new this.Wide());
          case 'ball':
            return new this.Delivery();
          default:
            console.log('Invalid delivery type ' + type);
        }
      };
      this.test = function() {
        console.log('DeliveryType went BANG');
      };
    };

    return DeliveryType;
  }
]);

/**
 * @class Innings
 * @memberOf scorer.factory
 * @description Represents a single innings in a match.
 * @property {array} overs_history - List of completed overs.
 * @property {array} last_overs_history - ??
 * @property {number} total - Total runs so far in innings.
 * @property {number} wickets - Total wickets taken so far in innings.
 * @property {number} extras - Total extras so far in innings.
 * @property {number} last_innings - ??
 * @property {number} target - Runs required to win.
 * @property {number} overs - Number of completed overs so far.
 * @property {number} balls - Number of balls bowled in current over.
 * @property {number} overs_and_balls - Combined overs and balls in curent over as pseudo decimal eg 6.
 * @property {object} bowler
 * @property {object} next_bowler
 * @property {object} game_over
 * @property {object} innings_no
 * @property {object} batting_team
 * @property {number} left_bat_no
 * @property {number} right_bat_no
 * @property {number} next_batsman_no
 * @constructor Innings
 */
angular.module("scorer").factory("Innings", [
  function() {
    var obj = function(Settings) {
      this.innings = {
        overs_history: [],
        last_overs_history: [],
        total: 0,
        wickets: 0,
        extras: 0,
        last_innings: 0,
        target: 0,
        overs: 0,
        balls: 0,
        overs_and_balls: 0,
        bowler: {},
        next_bowler: {},
        game_over: false,
        innings_over: false,
        left_bat_no: 1,
        right_bat_no: 2,
        next_batsman_no: 3,

        /** @method left_bat
         *  @memberOf scorer.factory.Innings
         */
        left_bat: {
          no: 1,
          striker: true,
          runs: 0
        },
        /** @function right_bat
         *  @memberOf scorer.factory.innings
         */
        right_bat: {
          no: 2,
          striker: false,
          runs: 0
        },

        templates: {
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
          // Over: function(over_no, bowler_obj) {
          //   /** @property over_no */
          //   this.over_no = over_no;
          //   this.bowler = jQuery.extend({}, bowler_obj); // Shallow copy / clone.
          //   this.balls = [];
          //   if (!over_no || !bowler_obj) {
          //     throw "Over object requires over_no and bowler_obj";
          //   }
          //   this.valid_balls = 0;
          //   this.total_balls = 0;
          // },
          Over: {
            /** @property over_no */
            over_no: 0,
            bowler: {},
            balls: [],
            valid_balls: 0,
            total_balls: 0,
          },

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
          // Ball: function(striker, runs, extras, wkt, valid) {
          //   //alert('Bang '+JSON.stringify(arguments));
          //   if (
          //     typeof striker === "undefined" ||
          //     typeof runs === "undefined" ||
          //     typeof extras === "undefined" ||
          //     typeof wkt === "undefined" ||
          //     typeof valid === "undefined"
          //   ) {
          //     alert("Ball requires 5 parameters");
          //     return false;
          //   }
          //   if (typeof striker != "object") {
          //     alert("Striker must be a Batman object.");
          //     return false;
          //   }
          //   this.striker = jQuery.extend(true, {}, striker);
          //   this.runs = runs;
          //   this.extras = extras;
          //   this.wkt = wkt;
          //   this.valid = valid;
          // },
          Ball: {
            //alert('Bang '+JSON.stringify(arguments));
            striker: {},
            runs: 0,
            extras: 0,
            wkt: false,
            valid: 1,
          },
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
          Batsman: {
            no: 0,
            striker: false,
            runs: 0,
            bowler: false,
            bowling: false,
            name: '',
            id: ''
          },
          /**
           * Creates an instance of Bowler
           *
           * @class Bowler
           * @memberOf scorer.factory
           * @constructor Bowler
           * @this {Batsman}
           * @property {integer} no
           * @property {boolean} striker
           * @property {integer} runs
           * @property {boolean} bowler
           * @property {boolean} bowling
           *
           * @return {Bowler} The new Batsman object.
           */
          Bowler: {
            "no": 0,
            "striker": false,
            "runs": 0,
            "bowler": false,
            "bowling": false
          },

          HomePlayers: [{
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
          }],

          AwayPlayers: [{
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
          }],

        },
        // End templates

        num_overs: 0,
        // over_no: 0,
        batting_team: "",
        home_players: [],
        away_players: []
      };

      /** @method num_overs
       *  @memberOf scorer.factory.Innings
       */
      //if (Settings) {
      this.innings.num_overs = function(Settings) {
        // alert(Settings.settings.match_type.name);
        if (Settings.settings.match_type.id == 1) {
          return Settings.settings.num_overs;
        }
        return false;
      };


      this.innings.batting_team = Settings.settings.team_batting_first.home_away;
      //}
      this.innings.innings_no = 1;

      //return Innings;
    };
    return obj;
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
 * @description Puts two Players objects in storage, then returns itself. Seems very strange.
 * Broadcasts "home_players" and "away_players".
 * @memberOf scorer.factory
 */
angular.module("scorer").factory('Players', ['Storage', '$rootScope', function(Storage, $rootScope) {

  'use strict';
  var storage = new Storage();

  // var home_players = [{
  //   id: 1,
  //   name: 'Home Player 1',
  //   batting_no: 1
  // }, {
  //   id: 2,
  //   name: 'Home Player 2',
  //   batting_no: 2
  // }, {
  //   id: 3,
  //   name: 'Home Player 3',
  //   batting_no: 3
  // }, {
  //   id: 4,
  //   name: 'Home Player 4',
  //   batting_no: 4
  // }, {
  //   id: 5,
  //   name: 'Home Player 5',
  //   batting_no: 5
  // }, {
  //   id: 6,
  //   name: 'Home Player 6',
  //   batting_no: 6
  // }, {
  //   id: 7,
  //   name: 'Home Player 7',
  //   batting_no: 7
  // }, {
  //   id: 8,
  //   name: 'Home Player 8',
  //   batting_no: 8
  // }, {
  //   id: 9,
  //   name: 'Home Player 9',
  //   batting_no: 9
  // }, {
  //   id: 10,
  //   name: 'Home Player 10',
  //   batting_no: 10
  // }, {
  //   id: 11,
  //   name: 'Home Player 11',
  //   batting_no: 11
  // }];
  //
  // var away_players = [{
  //   id: 12,
  //   name: 'Away Player 1',
  //   batting_no: 1
  // }, {
  //   id: 13,
  //   name: 'Away Player 2',
  //   batting_no: 2
  // }, {
  //   id: 14,
  //   name: 'Away Player 3',
  //   batting_no: 3
  // }, {
  //   id: 15,
  //   name: 'Away Player 4',
  //   batting_no: 4
  // }, {
  //   id: 16,
  //   name: 'Away Player 5',
  //   batting_no: 5
  // }, {
  //   id: 17,
  //   name: 'Away Player 6',
  //   batting_no: 6
  // }, {
  //   id: 18,
  //   name: 'Away Player 7',
  //   batting_no: 7
  // }, {
  //   id: 19,
  //   name: 'Away Player 8',
  //   batting_no: 8
  // }, {
  //   id: 20,
  //   name: 'Away Player 9',
  //   batting_no: 9
  // }, {
  //   id: 21,
  //   name: 'Away Player 10',
  //   batting_no: 10
  // }, {
  //   id: 22,
  //   name: 'Away Player 11',
  //   batting_no: 11
  // }];

  var obj = {

    players: [],

    // ***********************************************************************
    /** @function lookup
     * @description Accept a Player object and returns its position in the
     * Players list.
     * @memberOf scorer.factory.Players
     * @param {Player} player
     * @returns {Int} Position of Player in list of Players. 0 based.
     *
     */

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
      console.log('1 Players save ' + JSON.stringify(player));
      if (player.batting_no < 1 || player.batting_no > 11) {
        return false;
      }
      console.log('2 Players save');
      var i = this.lookup(player);
      if (i < 0) {
        return false;
      }
      console.log('3 Players save');
      //alert(player.batting_no +
      //  ' != ' + (i + 1));
      if (player.batting_no != i + 1) {
        //alert("Change");
        this.players.splice(i, 1);
        //alert("Removed item "+i);
        this.players.splice(player.batting_no - 1, 0, player);
        //alert("Added item "+ (player.batting_no - 1));
        this.renumber();
        console.log('4 Players save');
      } else {
        this.players[i] = player;
        console.log('5 Players save');
      }
      console.log('6 Players save');
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
    // // ***********************************************************************
    // /** @function start_bowling
    //  * @description Accept a Player object and add it to the list of current
    //  * bowlers as the next bowler.
    //  * Returns false if two players are already bowling.
    //  * Returns true on success.
    //  * @memberOf scorer.factory.Players
    //  * @param {Player} player
    //  * @returns {Boolean}
    //  *
    //  */
    // start_bowling: function(player) {
    //   console.log("--");
    //   console.log("In start_bowling");
    //   var bowling = this.get_bowling();
    //   if (bowling.length >= 2) {
    //     return false;
    //   }
    //   // alert(1);
    //   console.log("Still in start_bowling");
    //   var bowlers = this.get_bowlers();
    //   // alert(JSON.stringify(bowlers));
    //   var next_bowler_no = bowlers.length ?
    //     bowlers[bowlers.length - 1].bowler + 1 : 1;
    //   console.log("next_bowler_no " + next_bowler_no);
    //   var i = this.lookup(player);
    //   if (i >= 0) {
    //     this.players[i].bowler = next_bowler_no;
    //     this.players[i].bowling = true;
    //     console.log("i=" + i + " .bowler=" + next_bowler_no);
    //   }
    //   console.log("End start_bowling");
    //   return true;
    // },
    //
    // stop_bowling: function(player) {
    //   var i = this.lookup(player);
    //   if (i >= 0) {
    //     this.players[i].bowling = false;
    //     return true;
    //   }
    //   return false;
    // },
    // get_bowlers: function() {
    //   var bowlers = [];
    //   for (var i = 0; i < this.players.length; i++) {
    //     if (this.players[i].bowler) {
    //       bowlers.push(this.players[i]);
    //     }
    //   }
    //   bowlers = bowlers.sort(this.sort_by_bowler_no);
    //   return bowlers;
    // },
    // get_bowling: function() {
    //   var bowlers = this.get_bowlers();
    //   var bowling = [];
    //   for (var i = 0; i < bowlers.length; i++) {
    //     if (bowlers[i].bowling) {
    //       bowling.push(bowlers[i]);
    //     }
    //   }
    //   return bowling;
    // },

    /** @function reset
     * @description Reads the Players object from storage and writes it to
     * this.players. Initializes this.players if there is nothing in storage.
     * @memberOf scorer.factory.Players
     */
    reset: function() {
      if (this.team) {
        var p = storage.get_scoreboard();
        // console.log('Players.reset scoreboard: ' + JSON.stringify(p));
        this.players = this.team == "home" ? p.home_players : p.away_players;
        // console.log('Players.reset team: ' + this.team + ' home_players: ' + JSON.stringify(this.players));
        // this.players = p ? p : this.team == "home" ? home_players : away_players;
        if (this.players) {
          this.sort_by_batting_no();
          this.renumber();
        }
        else {
          this.players = [];
        }
      }
    },

    /** @function accept
     * @description Stores the Players object with the key in the "team"
     * attribute (ie "home" or "away") and call broadcast_players
     * @memberOf scorer.factory.Players
     */
    accept: function() {
      storage.put(this.team, this.players);
      // alert('put '+this.team+' '+JSON.stringify(this.players));
      this.broadcast_players();
    },

    /** @function broadcast_players
     * @description Called when the Players object in storage is updated.
     * Broadcasts both the "home_players" and "away_players" objects.
     * @memberOf scorer.factory.Players
     */
    broadcast_players: function() {
      $rootScope.$broadcast('players_changed', {
        'home_players': storage.get('home'),
        'away_players': storage.get('away')
      });
    },

    /** @function set_team
     * @description Identifies this object as representing the home team
     * or the way team.
     * @param {string} team - "home" or "away"
     * @memberOf scorer.factory.Players
     */
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

/**
 *
 * https://www.jvandemo.com/how-to-properly-integrate-non-angularjs-libraries-in-your-angularjs-application/
 */

angular.module("scorer").factory('Sc', ['$window', '$http',
  function($window, $http) {

    /** Creates an instance of Sc
     *
     * @class Sc
     * @memberOf scorer.factory
     * @description Factory which returns an Sc object. Properly integrates
     * lib/sc.js
     * @constructor Sc
     */

    if (window.sc) {
      window.sc.LoggerHttp = $http;
      return window.sc;
    } else {
      console.log('ERROR window.sc is not available.');
    }

  }
]);

/**
 * @class Scoreboard
 * @memberOf scorer.factory
 * @description Factory which returns an Sc.Scoreboard object.
 *
 */
angular.module("scorer").factory('Scoreboard',
['Sc', 'Storage', 'Settings', '$rootScope',
  'Players', 'Over', 'Batsman', 'Ball', 'ScoreboardTemplate',
  function(Sc, Storage, Settings, $rootScope, Players, Over, Batsman, Ball,
    ScoreboardTemplate) {

    var storage = new Storage();

    // var scoreboard_template = prepare_match_in_progress(storage);

    var s = new Sc.Scoreboard(ScoreboardTemplate, Settings, Players, Over, Storage);

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
 * @property {number} balls - The number of balls bowled in the current over so far.
 * @property {array} overs_history - Array of all overs bowled in the current innings.
 * Last element is the current over.
 * @property {type} bowler - The current bowler
 * @property {type} next_bowler - The next bowler
 * @property {boolean} game_over - true if the game is over.
 * @property {number} extras - Number of extras in innings so far.
 * @property {number} total - Total runs (including extras) in innings so far.
 * @property {number} wickets - Total number of wickets taken so far in innings.
 * @property {boolean} innings_over - True if the innings is over.
 * @property {number} overs - Number of completed overs so far in innings.
 * @property {number} num_overs - Number of overs scheduled for innings.
 * @property {number} overs_and_balls - Pseudo decimal. eg 6 overs and three
 * balls = 6.3. 7 overs and no balls = 7.
 * @property {type} left_bat - The batsman on the left hand side of the board.
 * @property {type} right_bat - The batsman on the right hand side of the board.
 * @property {number} target - The total runs required to win the match.
 * @property {string} batting_team - Signifies the batting team. "home" or "away".
 *
 */
angular.module("scorer").factory('ScoreboardTemplate', ['Settings', 'Innings',
  function(Settings, Innings) {

    var obj = function() {
      this.innings = [];

      // Deep copy of simple JSON object.
      var clone = function(o) {
        return JSON.parse(JSON.stringify(o))
      };

      // console.log("settings: " + JSON.stringify(Settings));
      // var innings = Innings;
      for (var i = 0; i < Settings.settings.num_innings; i++) {

        var innings = new Innings(Settings);
        innings = innings.innings;

        innings.left_bat = clone(innings.templates.Batsman);
        innings.left_bat.no = 1;
        innings.left_bat.striker = true;

        innings.right_bat = clone(innings.templates.Batsman);
        innings.right_bat.no = 2;
        innings.right_bat.striker = false;

        this.innings.push(innings);
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

    // Private function. Mapped to this.get later.
    var get = function(key) {
      var value;
      try {
        value = JSON.parse(sessionStorage[key]);
        this.logger.debug('get ' + key + ' = ' + JSON.stringify(value));
        return value;
      } catch (e) {
        return false;
      }
    };

    // Private function. Mapped to this.put later.
    var put = function(key, value) {
      this.logger.debug('put ' + key + ' = ' + JSON.stringify(value));
      sc.validators.is_json(value);
      sessionStorage[key] = JSON.stringify(value);
      return true;
    };

    this.logger = new sc.Logger('Storage');

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
      this.logger.debug('get_scoreboard');
      var scoreboard = this.get('scoreboard');
      this.logger.debug("bowler=" + JSON.stringify(scoreboard.bowler));
      if (is.existy(scoreboard.away_players)) {
        this.logger.debug("away_player 0 " + JSON.stringify(scoreboard.away_players[0]));
      }
      return scoreboard;
    };

    this.put_scoreboard = function(scoreboard) {
      this.logger.debug('put_scoreboard');
      // this.logger.debug("put_scoreboard: " + JSON.stringify(scoreboard));
      if (!scoreboard) {
        throw new Error('Storage.put_scoreboard require 1 parameter');
      }
      this.logger.debug("bowler=" + JSON.stringify(scoreboard.bowler));
      return this.put('scoreboard', scoreboard);
    };

    this.clear = function() {
      sessionStorage.clear();
      this.logger.info("All session storage cleared.");
    }

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

angular.module("scorer").factory('Bye', [
  function() {

    /** Creates an instance of Bye
     *
    * @class Bye
       * @memberOf scorer.factory.DeliveryType
      * @classdesc - Returns an instance of a correct delivery class..
      * @constructor Bye

      * @return {Bye}
      * @description -
      */
    var Bye = function() {

      /**
       * @function record
       * @memberOf scorer.factory.DeliveryType.Bye
       * @param {Scoreboard} The scoreboard
       * @param type
       */
      this.record = function(scoreboard, details) {
        scoreboard.balls += 1;
        scoreboard.add_ball(scoreboard.left_bat.striker ?
          scoreboard.left_bat : scoreboard.right_bat, 0, 1, false, true);
        scoreboard.change_ends(1);
        scoreboard.extras += 1;
        scoreboard.total += 1;
      };

    };

    return Bye;
  }
]);

angular.module("scorer").factory('Delivery', [
  function() {

    /** Creates an instance of Delivery
     *
    * @class Delivery
       * @memberOf scorer.factory.DeliveryType
      * @classdesc - Returns an instance of a correct delivery class..
      * @constructor Delivery

      * @return {Delivery}
      * @description -
      */
    var Delivery = function() {

      /**
       * @function record
       * @memberOf scorer.factory.DeliveryType.Delivery
       * @param {Scoreboard} The scoreboard
       * @param type
       */
      this.record = function(scoreboard, details) {
        //console.log("OK 1");
        this.ball(scoreboard,details.runs);
        //console.log("OK 2");
        scoreboard.change_ends(details.runs);
      };

      this.ball = function(scoreboard, runs) {
        //console.log("ok   xx");
        scoreboard.total += runs;
        scoreboard.balls++;

        //console.log("OK 1.1");
        scoreboard.add_runs_to_striker( runs);

        scoreboard.add_ball(scoreboard.left_bat.striker ? scoreboard.left_bat
          : scoreboard.right_bat, runs, 0, false, true);

      };



    };

    return Delivery;
  }
]);

angular.module("scorer").factory('LegBye', [
  function() {

    /** Creates an instance of LegBye
     *
    * @class LegBye
       * @memberOf scorer.factory.DeliveryType
      * @classdesc - Returns an instance of a correct delivery class..
      * @constructor LegBye

      * @return {LegBye}
      * @description -
      */
    var LegBye = function() {

      /**
       * @function record
       * @memberOf scorer.factory.DeliveryType.LegBye
       * @param {Scoreboard} The scoreboard
       * @param type
       */
      this.record = function(scoreboard, details) {
        scoreboard.balls += 1;
        scoreboard.add_ball(scoreboard.left_bat.striker ?
          scoreboard.left_bat : scoreboard.right_bat, 0, 1, false, true);
        scoreboard.change_ends(1);
        scoreboard.extras += 1;
        scoreboard.total += 1;
      };

    };

    return LegBye;
  }
]);

angular.module("scorer").factory('NoBall', [
  function() {

    /** Creates an instance of NoBall
     *
    * @class NoBall
      * @memberOf scorer.factory.DeliveryType
      * @classdesc - Returns an instance of a correct delivery class..
      * @constructor NoBall

      * @return {NoBall}
      * @description -
      */
    var NoBall = function() {

      /**
       * @function record
       * @memberOf scorer.factory.DeliveryType.NoBall
       * @param {Scoreboard} The scoreboard
       * @param type
       */
      this.record = function(scoreboard, details) {
        scoreboard.extras += 1;
        scoreboard.total += 1;
        scoreboard.add_ball(scoreboard.left_bat.striker ?
          scoreboard.left_bat :
          scoreboard.right_bat, 0, 1, false, false);

      };

    };

    return NoBall;
  }
]);

angular.module("scorer").factory('Wicket', [
  function() {

    /** Creates an instance of Wicket
     *
    * @class Wicket
       * @memberOf scorer.factory.DeliveryType
      * @classdesc - Returns an instance of a correct delivery class..
      * @constructor Wicket

      * @return {Wicket}
      * @description -
      */
    var Wicket = function() {

      /**
       * @function record
       * @memberOf scorer.factory.DeliveryType.Wicket
       * @param {Scoreboard} The scoreboard
       * @param type
       */
      this.record = function(scoreboard, details) {
        console.log("record wicket");
        this.wwicket(scoreboard,details);
      };

      this.wwicket = function(scoreboard, details) {
        console.log("wicket.wicket");
        scoreboard.balls++;
        scoreboard.wickets += 1;

        scoreboard.add_ball(scoreboard.left_bat.striker ? scoreboard.left_bat :
          scoreboard.right_bat, 0, 0, true, true);
        // var next_batsman_no = (scoreboard.left_bat.no > scoreboard.right_bat.no) ?
        //   scoreboard.left_bat.no + 1 :
        //   scoreboard.right_bat.no + 1;
        //
        // if (scoreboard.left_bat.striker === true) {
        //   scoreboard.left_bat = new Batsman();
        //   scoreboard.left_bat.no = next_batsman_no;
        //   scoreboard.left_bat.striker = true;
        //
        // } else {
        //   scoreboard.right_bat = new Batsman();
        //   scoreboard.right_bat.no = next_batsman_no;
        //   scoreboard.right_bat.striker = true;
        // }
      };


    };

    return Wicket;
  }
]);

angular.module("scorer").factory('Wide', [
  function() {

    /** Creates an instance of Wide
     *
    * @class Wide
       * @memberOf scorer.factory.DeliveryType
      * @classdesc - Returns an instance of a correct delivery class..
      * @constructor Wide

      * @return {Wide}
      * @description -
      */
    var Wide = function() {

      /**
       * @function record
       * @memberOf scorer.factory.DeliveryType.Wide
       * @param {Scoreboard} The scoreboard
       * @param type
       */
      this.record = function(scoreboard, details) {
        scoreboard.extras += 1;
        scoreboard.total += 1;
        scoreboard.add_ball(scoreboard.left_bat.striker ? scoreboard.left_bat :
          scoreboard.right_bat, 0, 1, false, false);
      };

    };

    return Wide;
  }
]);

/**
* @namespace DeliveryType
* @memberOf scorer.factory
*
*/

var sc = sc || {};

/**
 * @namespace Command
 * @memberOf sc
 *
 */

/**
 * @class Command
 * @memberOf sc
 * @constructor Command
 */

sc.Command = function() {
  this.test = "test";

  /** @function set_innings_over
   *  @memberOf sc.Command
   *  @description Set the innings over flag if 10 wickets have been taken
   *  or the last over has been completed.
   *  @return {boolean}
   */
  this.set_innings_over = function() {
    if (this.data.wickets >= 10) {
      this.data.innings_over = true;
    }
    //alert(this.scoreboard.num_overs + ' : ' + this.scoreboard.overs);
    if (this.data.num_overs && this.data.overs >= this.data.num_overs) {
      //alert(1);
      this.data.innings_over = true;
    }
    return this.data.innings_over;
  };

  /** @function set_game_over
   *  @description Calls set_innings_over and then sets game_over if the
   *  second innings has ended.
   *  @memberOf sc.Command
   *  @return {boolean}
   */
  this.set_game_over = function() {
    this.set_innings_over();

    if (this.data.innings_no <= 1) {
      return false;
    }

    if (this.data.total > this.data.last_innings) {
      this.data.game_over = true;
      return true;
    }

    if (this.data.innings_over) {
      this.data.game_over = true;
      return true;
    }

    return false;
  };

  /**
   * @function over_manager
   * @memberOf sc.Command
   * @description Return a new OverManager object.
   * @return {OverManager}
   */
  this.over_manager = function() {
    return new sc.OverManager(this.data);
  };

  /**
   * @function player_manager
   * @memberOf sc.Command
   * @description Return a new PlayerManager object.
   * @return {PlayerManager}
   */
  this.player_manager = function() {
    return new sc.PlayerManager();
  };

  /**
   * @function validator
   * @memberOf sc.Command
   * @param name {String} A name to be used in the error messages
   * @description Return a new Validator object.
   * @return {Validator}
   */
  this.validator = function(name) {
    /**
     * @class Validator
     * @memberOf sc.Command.validator
     * @constructor Validator
     * @param name {String} A name to be used in the error messages.
     * @return {Validator}
     */
    var Validator = function(name) {
      this.name = name;
      this.msg = this.name + ". A mandatory parameter is missing: ";

      this.check_namespaces_defined = function(obj, element) {
        var namespaces = element.split(".");
        var done = "";
        var context = obj;
        for (var i = 0; i < namespaces.length; i++) {
          context = context[namespaces[i]];
          done = done + "." + namespaces[i];
          if (!is.existy(context)) {
            throw new Error(this.msg + done);
          }
        }
      };

      /**
       * @function check_all_defined
       * @memberOf validator
       * @description Accepts an object and a list of properties it
       * should have. Throws an error if any do not exist.
       * @param obj {Object} The object to be tested.
       * @param list {Array} List of properties
       * @return {void}
       * @throws {Error}
       */
      this.check_all_defined = function(obj, list) {
        for (var x = 0; x < list.length; x++) {
          var p = list[x];
          this.check_namespaces_defined(obj, p);
        }
      };
    };
    return new Validator(name);
  };

  /** @function over
   *  @memberOf sc.Command
   *  @description Test if the over has been completed. If it has, then
   * prepare for the next one.
   *  @memberOf sc.Scoreboard
   */
  this.over = function() {
    this.validator("over").check_all_defined(this.data, [
      "balls",
      "overs",
      "overs_and_balls",
      "bowler"
    ]);

    if (this.over_manager().over_complete()) {
      this.player_manager().change_ends(this.data, 1);

      this.player_manager().change_bowlers(this.data);

      this.over_manager().add_over(
        parseInt(this.over_manager().completed_overs()) + 1,
        this.data.bowler
      );
    }
    this.data.overs_and_balls = this.over_manager().overs_and_balls();
  };
};

var sc = sc || {};

/**
 * @namespace Commands
 * @memberOf sc
 *
 */

sc.Commands = {
  Wicket: function(data) {
    sc.Command.call(this, data);
    this.data = data;
    this.logger = new sc.Logger('Wicket');
    this.run = function() {
      data.balls++;
      data.wickets += 1;

      if (this.set_game_over()) {
        return true;
      }

      this.over_manager().add_ball(
        data.left_bat.striker ? data.left_bat : data.right_bat,
        0,
        0,
        true,
        true
      );

      this.set_striker_as_new(data);

      this.player_manager().set_batsmen_details(data);

      this.over();
    };

    // Allocate the next batsman's number. If current batsmen are
    // 3 and 6. Next batman will be 7.
    this.get_next_batsman_no = function(data) {
      this.logger.debug(JSON.stringify(data.left_bat) + ' : ' + JSON.stringify(data.right_bat));
      var next_batsman_no =
        data.left_bat.no > data.right_bat.no ?
        data.left_bat.no + 1 :
        data.right_bat.no + 1;
      this.logger.debug('get_next_batsman_no returning: ' + next_batsman_no);
      return next_batsman_no;
    };

    // Make the next batsman the striker.
    this.set_striker_as_new = function(data) {
      if (data.left_bat.striker === true) {
        data.left_bat = sc.Utils.clone(data.templates.Batsman);
        data.left_bat.no = data.next_batsman_no;
        data.left_bat.striker = true;
      } else {
        data.right_bat = sc.Utils.clone(data.templates.Batsman);
        data.right_bat.no = data.next_batsman_no;
        data.right_bat.striker = true;
      }
      data.next_batsman_no = this.get_next_batsman_no(data);
    };
  },

  StandardBall: function(args) {
    if (!(args instanceof Array) || args.length != 2) {
      throw new Error(
        "StandardBall Parameter args must be an array of length 2"
      );
    }

    this.logger = new sc.Logger('StandardBall');

    this.data = args[0];
    this.runs = args[1];

    if (!this.data) {
      throw new Error("StandardBall Parameter data is mandatory");
    }

    if (typeof this.runs === "undefined") {
      throw new Error("StandardBall Parameter runs is mandatory");
    }

    if (typeof this.data.total === "undefined") {
      throw new Error("StandardBall data.total must be defined");
    }

    if (typeof this.data.balls === "undefined") {
      throw new Error("StandardBall data.balls must be defined");
    }

    if (typeof this.data.left_bat === "undefined") {
      throw new Error("StandardBall data.left_bat must be defined");
    }

    if (typeof this.data.left_bat.striker === "undefined") {
      throw new Error("StandardBall data.left_bat.striker must be defined");
    }

    if (typeof this.data.right_bat === "undefined") {
      throw new Error("StandardBall data.right_bat must be defined");
    }

    sc.Command.call(this, this.data);

    this.run = function() {
      this.data.total += this.runs;
      this.data.balls++;

      sc.validators.is_batsman(this.data.left_bat);
      sc.validators.is_batsman(this.data.right_bat);
      this.logger.debug("About to call add_runs_to_striker " + JSON.stringify(this.data.left_bat));
      this.player_manager().add_runs_to_striker(this.data, this.runs);

      this.logger.debug("About to call add_ball " + JSON.stringify(this.data.left_bat));
      this.over_manager().add_ball(
        this.data.left_bat.striker ? this.data.left_bat : this.data.right_bat,
        this.runs,
        0,
        false,
        true
      );

      this.player_manager().change_ends(this.data, this.runs);
      this.over();
    };
  },

  Wide: function(args) {
    this.data = args;

    sc.Command.call(this, this.data);

    this.validator("Wide").check_all_defined(this, [
      "data",
      "data.total",
      "data.extras",
      "data.left_bat.striker",
      "data.right_bat"
    ]);

    this.run = function() {
      this.data.extras += 1;
      this.data.total += 1;

      this.over_manager().add_ball(
        this.data.left_bat.striker ? this.data.left_bat : this.data.right_bat,
        0,
        1,
        false,
        false
      );
      this.over();
    };
  },
  NoBall: function(args) {
    this.data = args;

    sc.Command.call(this, this.data);

    this.validator("NoBall").check_all_defined(this, [
      "data",
      "data.total",
      "data.extras",
      "data.left_bat.striker",
      "data.right_bat"
    ]);

    this.run = function() {
      this.data.extras += 1;
      this.data.total += 1;

      this.over_manager().add_ball(
        this.data.left_bat.striker ? this.data.left_bat : this.data.right_bat,
        0,
        1,
        false,
        false
      );
      this.over();
    };
  },

  Bye: function(args) {
    this.data = args;

    sc.Command.call(this, this.data);

    this.validator("Bye").check_all_defined(this, [
      "data",
      "data.total",
      "data.extras",
      "data.balls",
      "data.left_bat.striker",
      "data.right_bat"
    ]);

    this.run = function() {
      this.data.extras += 1;
      this.data.total += 1;
      this.data.balls += 1;

      this.over_manager().add_ball(
        this.data.left_bat.striker ? this.data.left_bat : this.data.right_bat,
        0,
        1,
        false,
        true
      );

      this.over();
    };
    this.player_manager().change_ends(this.data, 1);
  },

  LegBye: function(args) {
    this.name = "LegBye";

    this.data = args;

    sc.Command.call(this, this.data);

    this.validator("Bye").check_all_defined(this, [
      "data",
      "data.total",
      "data.extras",
      "data.balls",
      "data.left_bat.striker",
      "data.right_bat"
    ]);

    this.run = function() {
      this.data.extras += 1;
      this.data.total += 1;
      this.data.balls += 1;

      this.over_manager().add_ball(
        this.data.left_bat.striker ? this.data.left_bat : this.data.right_bat,
        0,
        1,
        false,
        true
      );

      this.player_manager().change_ends(this.data, 1);

      this.over();
    };
  },

  StartBowling: function(args) {
    this.name = "StartBowling";
    this.logger = new sc.Logger(this.name);

    if ((!is.array(args)) || args.length != 2) {
      this.logger.error(JSON.stringify(args));
      throw new Error(this.name + " expects an array with two elements");
    }

    this.data = args[0];
    this.player = args[1];

    sc.Command.call(this, this.data);

    this.validator("StartBowling").check_all_defined(this, [
      "data",
      "data.total",
      "data.extras",
      "data.balls",
      "data.left_bat.striker",
      "data.right_bat"
    ]);

    this.run = function() {

      // this.logger.debug("--");
      this.logger.debug("StartBowling.run. Batting team=" + this.data.batting_team);

      var bowling_team_players = this.player_manager().get_team_players(this.data, 'bowling');

      var bowling = this.player_manager().get_bowling(bowling_team_players);
      if (bowling.length >= 2) {
        throw new Error("Two bowlers are already bowling.")
      }
      // alert(1);
      this.logger.debug("Still in start_bowling");
      var bowlers = this.player_manager().get_bowlers(bowling_team_players);
      // alert(JSON.stringify(bowlers));
      var next_bowler_no = bowlers.length ?
        bowlers[bowlers.length - 1].bowler + 1 : 1;

      this.logger.debug("next_bowler_no " + next_bowler_no);

      var i = this.player_manager().lookup(bowling_team_players, this.player);
      if (i >= 0) {
        bowling_team_players[i].bowler = next_bowler_no;
        bowling_team_players[i].bowling = true;
        this.logger.debug("i=" + i + " .bowler=" + next_bowler_no);
      } else {
        throw new Error('Player not found in bowling team.');
      }

      this.player_manager().set_bowler_details(this.data);

      this.logger.debug("End start_bowling");
      return true;

    };
  },

  StopBowling: function(args) {
    this.name = "StopBowling";
    this.logger = new sc.Logger(this.name);

    // this.logger.debug("XXXXXXXXXXXXXXXXXXXXXXXXXXX "+JSON.stringify(args));
    if ((!is.array(args)) || args.length != 2) {
      this.logger.error(JSON.stringify(args));
      throw new Error(this.name + " expects an array with two elements");
    }

    this.data = args[0];
    this.player = args[1];

    sc.Command.call(this, this.data);

    this.validator("StopBowling").check_all_defined(this, [
      "data",
      "data.away_players",
      "data.home_players",
      "player",
      "player"
    ]);

    sc.validators.is_bowler(this.player);

    this.run = function() {

      this.logger.debug("StopBowling.run");

      var bowling_team_players = this.player_manager().get_team_players(this.data, 'bowling');

      var i = this.player_manager().lookup(bowling_team_players, this.player);
      if (i >= 0) {
        bowling_team_players[i].bowling = false;
        // this.player_manager().set_bowler_details(this.data);
        this.logger.debug("End StopBowling.run");
        return true;
      }

      this.logger.debug("StopBowling.run. Player was not bowling");
      return false;

    };
  },

  ModifyPlayerDetails: function(args) {
    this.name = "ModifyPlayerDetails";
    this.logger = new sc.Logger(this.name);

    // this.logger.debug("XXXXXXXXXXXXXXXXXXXXXXXXXXX "+JSON.stringify(args));
    if ((!is.array(args)) || args.length != 2) {
      this.logger.error(JSON.stringify(args));
      throw new Error(this.name + " expects an array with two elements");
    }

    this.data = args[0];
    this.player = args[1];

    sc.Command.call(this, this.data);

    // this.validator("StopBowling").check_all_defined(this, [
    //   "data",
    //   "data.away_players",
    //   "data.home_players",
    //   "player",
    //   "player"
    // ]);

    // sc.validators.is_bowler(this.player);

    this.run = function() {

      this.logger.debug("ModifyPlayerDetails.run");

      // var bowling_team_players = this.player_manager().get_team_players(this.data, 'bowling');
      // var batting_team_players = this.player_manager().get_team_players(this.data, 'batting');
      // var all_players = bowling_team_players.concat(batting_team_players)

      // var i = this.player_manager().lookup(all_players, this.player);

      var doit = function(obj, team) {
        var players = obj.player_manager().get_team_players(obj.data, team);
        var i = obj.player_manager().lookup(players, obj.player);
        if (i >= 0) {
          players[i].name = obj.player.name;
          players[i].description = obj.player.description;
          return true;
        }
        return false;
      };

      var ok = false;
      if (doit(this, 'batting')) {
        this.logger.debug('batting player: ' + JSON.stringify(this.player));
        this.player_manager().set_batsmen_details(this.data);
        ok = true;
      }
      else if(doit(this, 'bowling')) {
        ok = true;
      }

      this.logger.debug(JSON.stringify(this.data));
      this.logger.debug("ModifyPlayerDetails.run returning " + ok);

      return ok;

    };
  },

  Run: function(object, args) {
    object.prototype = Object.create(sc.Command.prototype);
    // object.prototype.Constructor = sc.Command.Wicket;

    var o = new object(args);

    o.run();
    return 1;
  }
  //Wicket.prototype = Command;
};

/*jslint vars:true, plusplus:true, devel:true, nomen:true, indent:4, maxerr:50*/

/**
 * @namespace Logger
 * @memberOf sc
 *
 */
var sc = sc || {};

/**
 * @class Logger
 * @memberOf sc
 * @constructor Logger
 *
 */

sc.LoggerHttp = undefined;

sc.LoggerLevels = {
  'OFF': 0,
  'DEBUG': 1,
  'INFO': 2,
  'WARN': 3,
  'ERROR': 4,
};

sc.LoggerConfig = {
  'Command': sc.LoggerLevels.DEBUG,
  'Commands': sc.LoggerLevels.DEBUG,
  'ModifyPlayerDetails': sc.LoggerLevels.DEBUG,
  'OverManager': sc.LoggerLevels.DEBUG,
  'PlayerManager': sc.LoggerLevels.DEBUG,
  'Scoreboard': sc.LoggerLevels.DEBUG,
  'StandardBall': sc.LoggerLevels.INFO,
  'StartBowling': sc.LoggerLevels.DEBUG,
  'StopBowling': sc.LoggerLevels.DEBUG,
  'Storage': sc.LoggerLevels.INFO,
  'Wicket': sc.LoggerLevels.INFO,
};

sc.Logger = function(name) {

  if (!name) {
    throw new Error("Logger needs name");
  }
  this.name = name;

  this.verbose = 0;

  var label = ['', 'DEBUG', 'INFO', 'WARN', 'ERROR'];

  var config = sc.LoggerConfig;

  this.debug = function(text) {
    if (this.log(sc.LoggerLevels.DEBUG)) {
      this.output('DEBUG ' + this.name + ' ' + text);
    }
  };

  this.info = function(text) {

    if (this.log(sc.LoggerLevels.INFO)) {
      this.output('INFO ' + this.name + ' ' + text);
    }
  };

  this.warn = function(text) {

    if (this.log(sc.LoggerLevels.WARN)) {
      this.output('WARN ' + this.name + ' ' + text);
    }

  };

  this.error = function(text) {

    if (this.log(sc.LoggerLevels.ERROR)) {
      this.output('ERROR ' + this.name + ' ' + text);
    }

  };

  // private
  this.log = function(method_level) {
    var level = this.get_level();
    this.verbose_msg(
      'level=' + level + ' method_level=' + method_level);

    if (is.existy(level) && level <= method_level) {
      this.verbose_msg('Log it');
      return true;
    }
    return false;
  }

  // private
  this.level = undefined;

  var validate_level = function(level) {
    var level_ok = 0;

    if (!is.existy(level)) {
      return 1;
    }

    for (k in sc.LoggerLevels) {
      // console.log("k=" + k + " level=" + level);
      if (sc.LoggerLevels[k] === level) {
        level_ok = 1;
      }
    }
    if (!level_ok) {
      throw new sc.InvalidParamError('Invalid logger level ' + level);
    }
    return 1;
  };

  // Override the level in the configuration. Set to undefine to disable.
  this.set_level = function(level) {
    validate_level(level);
    this.level = level;
  };

  this.get_level = function() {
    if (is.existy(this.level)) {
      if (this.verbose) {
        console.log("Attribute level set to " + this.level);
      }
      return this.level;
    }
    this.verbose_msg(
      config[this.name] ?
      "Configured level is " + config[this.name] :
      "Level is not configured");
    validate_level(config[this.name]);
    return config[this.name];
  };

  this.verbose_msg = function(msg) {
    if (this.verbose) {
      console.log('In Logger ' + this.name + ': ' + msg);
    }
  }

  this.output = function(msg) {
    if (!sc.LoggerHttp) {
      console.log(msg);
    } else {
      sc.LoggerHttp.post('/log', { 'msg' : msg });
    }
  };

};

var sc = sc || {};

sc.OverManager = function(data) {
  this.data = data;

  this.logger = new sc.Logger('OverManager');

  if (typeof this.data.overs_history != "object") {
    throw new Error("data.overs_history must be an array");
  }

  if (typeof this.data.templates != "object") {
    throw new Error("data.templates must be an object");
  }

  sc.validators.is_ball(this.data.templates.Ball);

  /** @function add_ball
   *  @description Add a ball
   *  @memberOf sc.OverManager
   *  @param striker
   *  @param runs
   *  @param extras
   *  @param wkt
   *  @param valid
   */
  this.add_ball = function(striker, runs, extras, wkt, valid) {
    if (arguments.length != 5) {
      throw new Error(
        "OverManager.add_ball requires five arguments. Got " + arguments.length
      );
    }

    if (typeof striker != "object") {
      throw new Error(
        "OverManager.add_ball argument 1 must be an object. Got " +
        typeof striker
      );
    }

    sc.validators.is_batsman(striker);

    if (!(wkt == 0 || wkt == 1)) {
      throw new Error("OverManager.add_ball wkt must be 0 or 1");
    }

    if (!(valid == 0 || valid == 1)) {
      throw new Error("OverManager.add_ball valid must be 0 or 1");
    }

    if (runs !== parseInt(runs)) {
      throw new Error("OverManager.add_ball run must be an integer");
    }

    if (extras !== parseInt(extras)) {
      throw new Error("OverManager.add_ball errors must be an integer");
    }

    if (typeof striker != "object") {
      throw new Error(
        "OverManager.add_ball argument 1 must be an object. Got " +
        typeof striker
      );
    }

    if (!this.data.overs_history.length) {
      this.add_over(1, this.data.bowler);
    }

    var over = this.data.overs_history[this.data.overs_history.length - 1];
    if (this.over_complete()) {
      throw new Error("The over has finished.");
    }

    var b = sc.Utils.clone(data.templates.Ball);
    b.striker = striker;
    b.runs = runs;
    b.extras = extras;
    b.wkt = wkt;
    b.valid = valid;
    this.data.overs_history[this.data.overs_history.length - 1].balls.push(b);

    if (valid) {
      this.data.overs_history[
        this.data.overs_history.length - 1
      ].valid_balls += 1;
    }

    this.data.overs_history[
      this.data.overs_history.length - 1
    ].total_balls += 1;

    this.data.overs_and_balls = this.overs_and_balls();
    this.data.balls = this.current_over().valid_balls;

  };

  this.add_over = function(over_no, bowler_obj) {
    if (arguments.length != 2) {
      throw new Error("OverManager add_over requires two arguments");
    }

    if (over_no !== parseInt(over_no)) {
      throw new Error("OverManager add_over. over_no must be an integer");
    }

    if (typeof bowler_obj != "object") {
      throw new Error("OverManager add_over. bowler_obj must be an object");
    }

    sc.validators.is_bowler(bowler_obj);

    if (this.current_over_no()) {
      var bowler_of_last_over = this.current_over().bowler.no;
      if (bowler_of_last_over === bowler_obj.no) {
        this.logger.error('New bowler: ' + JSON.stringify(bowler_obj));
        this.logger.error('Last bowler: ' + JSON.stringify(this.current_over().bowler));
        throw new Error("New bowler cannot be same as last bowler");
      }
    }

    if (this.current_over_no() + 1 !== over_no) {
      throw new Error(
        "Over number must increment." +
        " Current over: " +
        this.current_over_no()
      );
    }


    var o = sc.Utils.clone(this.data.templates.Over);
    o.over_no = over_no;
    o.bowler = bowler_obj;
    this.data.overs_history.push(o);

    this.data.balls = 0;
    this.data.overs = this.completed_overs();
    //alert("Over");
  };

  this.current_over = function() {
    if (this.data.overs_history.length == 0) {
      throw new Error("No overs have been bowled");
    }
    return this.data.overs_history[this.data.overs_history.length - 1];
  };

  this.current_over_no = function() {
    return this.data.overs_history.length;
  };

  this.over_complete = function() {
    return this.current_over().valid_balls >= 6 ? 1 : 0;
  };

  this.completed_overs = function() {
    var n = this.over_complete() ? this.current_over_no() : this.current_over_no() - 1;
    return n;
  };

  this.overs_and_balls = function() {
    if (this.current_over().valid_balls == 0) {
      return this.completed_overs();
    }
    return this.completed_overs() + "." + this.current_over().valid_balls;
  };
};

/*jslint vars:true, plusplus:true, devel:true, nomen:true, indent:4, maxerr:50*/

var sc = sc || {};

/**
 * @namespace PlayerManager
 * @memberOf sc
 */

/**
 * @constructor PlayerManager
 * @param data
 * @param {Players} Players
 *
 */
sc.PlayerManager = function() {

  // Deep copy of simple JSON object.
  var clone = function(o) {
    return JSON.parse(JSON.stringify(o))
  };

  this.logger = new sc.Logger('PlayerManager', sc.LoggerLevels.DEBUG);

  /**
   * @method change_ends
   * @memberOf PlayerManager
   * @description Accept the number of times the batsmen ran and calculate whether
   * the batsmen changed ends. If they did, toggle the values of scoreboard.left_bat.striker
   * and scoreboard.right_bat.striker.
   * @param data {json} - JSON data structure.
   * @param num_runs {integer} - Number of times the batsmen ran on the last ball.
   */
  this.change_ends = function(data, num_runs) {
    if (!data) {
      throw new Error("Parameter data is mandatory");
    }
    if (typeof num_runs === "undefined") {
      throw new Error("Parameter runs is mandatory");
    }

    if (num_runs % 2 === 0) {
      return true;
    }

    if (data.left_bat.striker === true) {
      data.left_bat.striker = false;
      data.right_bat.striker = true;
    } else {
      data.left_bat.striker = true;
      data.right_bat.striker = false;
    }
  };

  /**
   * @method validator
   * @memberOf PlayerManager
   * @param name {String} A name to be used in the error messages
   * @description Return a new Validator object.
   * @return {Validator}
   */
  this.validator = function(name) {
    /**
     * @class Validator
     * @constructor Validator
     * @param name {String} A name to be used in the error messages.
     * @return {Validator}
     */
    var Validator = function(name) {
      this.name = name;
      this.msg = this.name + ". A mandatory parameter is missing: ";

      this.check_namespaces_defined = function(obj, element) {
        var namespaces = element.split(".");
        var done = "";
        var context = obj;
        for (var i = 0; i < namespaces.length; i++) {
          context = context[namespaces[i]];
          done = done + "." + namespaces[i];
          if (!is.existy(context)) {
            throw new Error(this.msg + done);
          }
        }
      };

      /**
       * @function check_all_defined
       * @memberOf validator
       * @description Accepts an object and a list of properties it
       * should have. Throws an error if any do not exist.
       * @param obj {Object} The object to be tested.
       * @param list {Array} List of properties
       * @return {void}
       * @throws {Error}
       */
      this.check_all_defined = function(obj, list) {
        for (var x = 0; x < list.length; x++) {
          var p = list[x];
          this.check_namespaces_defined(obj, p);
        }
      };
    };
    return new Validator(name);
  };

  /**
   *  @function change_bowlers
   *  @memberOf PlayerManager
   *  @param {Object} data
   *  @description Swop the objects in data.bowler and data.next_bowler.
   *  Called at the end of each over.
   *  The next bowler may not have been selected at this point.
   *
   */
  this.change_bowlers = function(data) {
    var tmp = data.bowler;
    sc.validators.is_bowler(data.bowler);

    // If next_bowler is true, it must be a Bowler object or an empty JSON object.
    if (data.next_bowler && JSON.stringify(data.next_bowler) != "{}") {
      sc.validators.is_bowler(data.next_bowler);
    }
    data.bowler = data.next_bowler;

    data.next_bowler = tmp;
    this.logger.debug("After change_bowlers: bowler " + JSON.stringify(data.bowler));
    this.logger.debug(
      "After change_bowlers: next " + JSON.stringify(data.next_bowler)
    );
  };

  /**
   *  @method alert_no_bowler
   *  @memberOf PlayerManager
   *  @description Alert if the bowler is not set.
   *  @return boolean
   */
  this.alert_no_bowler = function() {
    if (!this.scoreboard.bowler.name) {
      alert("Please select a bowlerrrrr.");
      return true;
    }
    return false;
  };

  /** @function add_runs_to_striker
   *  @description Add the runs to the batsman's score.
   *  @memberOf PlayerManager
   *  @param {objects} data - Data
   *  @param {integer} runs - Number of runs to be added.
   */
  this.add_runs_to_striker = function(data, runs) {
    if (!data) {
      throw new Error("add_runs_to_striker data is mandatory");
    }
    if (typeof runs === "undefined") {
      throw new Error("add_runs_to_striker runs is mandatory");
    }

    if (data.left_bat.striker) {
      data.left_bat.runs += runs;
    } else {
      data.right_bat.runs += runs;
    }
  };

  /** @function set_batting_team
   *  @description Set the batting team.
   *  @memberOf PlayerManager
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

  /** @method set_batsmen_details
   *  @memberOf PlayerManager
   *  @description Uses the list of players to flesh out the left_bat and
   *  right_bat_no with details such as name and description.
   *  @param {objects} data - Data
   *  @return {void}
   */
  this.set_batsmen_details = function(data) {
    // this.logger.debug("set_batsmen_details " + JSON.stringify(data));

    var m = "PlayerManager set_batsmen_details. ";

    if (!data) {
      throw new Error(m + "Parameter data is mandatory");
    }
    if (!(data.batting_team != "home" || data.batting_team != "away")) {
      throw new Error(m + "data.batting_team must be home or away");
    }
    if (!data.home_players) {
      throw new Error(m + "data.home_players must be defined");
    }
    if (!data.away_players) {
      throw new Error(m + "data.away_players must be defined");
    }

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

    var players =
      data.batting_team == "home" ? data.home_players : data.away_players;

    data.left_bat = check(data.left_bat, players);
    data.right_bat = check(data.right_bat, players);
    // alert(JSON.stringify(this.scoreboard.right_bat));
  };

  /**
   * @method get_team_players
   * @memberOf PlayerManager
   * @param data {object} - data
   * @param batting_or_bowling {string} "batting" or "bowling"
   * @return {array}
   */
  this.get_team_players = function(data, batting_or_bowling) {
    var team;
    this.validator('get_team_players').check_all_defined(data, ['batting_team',
      'home_players',
      'away_players'
    ]);
    if (batting_or_bowling == 'batting') {
      team = data.batting_team == "home" ? data.home_players : data.away_players;
    } else if (batting_or_bowling == 'bowling') {
      team = data.batting_team == "home" ? data.away_players : data.home_players;
    } else {
      throw new Error("Parameter value must be 'batting' or 'bowling'");
    }
    // this.logger.debug("get_team_players returning " + JSON.stringify(team));
    return team;
  };

  // ***********************************************************************
  /** @method set_bowler_details
   * @description Sets the data.bowler and data.next_bowler elements
   * based on the bowler and bowling elements in the bowling team's
   * list of players.
   * @memberOf PlayerManager
   * @param data {object} - Data
   */
  this.set_bowler_details = function(data) {
    //this.logger.debug("Start set_bowler_details");

    var logger = this.logger;

    this.validator('set_bowler_details').check_all_defined(data,
      ['batting_team', 'home_players', 'away_players', 'bowler', 'next_bowler']);

    // Private function
    /** @function is_bowling
     * @description Accept a list of bowler objects and a bowler. Return true
     * if the bowler is current bowling.
     */
    var is_bowling = function(bowlers, bowler) {
      for (var i = 0; i < bowlers.length; i++) {
        if (bowlers[i].id == bowler.id) {
          logger.debug(
            "set_bowler_details is_bowling true for bowler.id " + bowler.id
          );
          return bowlers[i];
        }
      }
      logger.debug(
        "set_bowler_details is_bowling false for bowler.id " + bowler.id
      );
      return false;
    };

    // Private function
    /** @function set_bowler
     * @description Accept a list of bowlers and a bowler. */
    var set_bowler = function(bowlers, bowler, logger) {
      // logger.debug('set_bowler TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT');
      if (!bowlers.length) {
        logger.warn("set_bowler_details. No bowlers!");
        return {};
      }
      if (!bowler.id) {
        // No bowler id. Just return first bowler in list.
        logger.info("set_bowler_details. Return first bowler in list.");
        return bowlers.shift();
      } else if (!is_bowling(bowlers, bowler)) {
        logger.warn(
          "set_bowler_details. Bowler " + bowler.id + " is not bowling."
        );
        return {};
      } else {
        var b = bowlers[0].id == bowler.id ? bowlers.shift() : bowlers.pop();
        logger.info("set_bowler_details. Return bowler " + b.id);
        return b;
      }
      logger.info("set_bowler_details. Return bowler " + bowler.id);
      return bowler;
    };

    var bowling_team =
      data.batting_team == "home" ?
      data.away_players :
      data.home_players;

    // Bowlers is a sorted list of the players in the bowling list who
    // are currently bowling. Rebuilt each time, so it
    // can be modified safely. Two entries max!
    var bowlers = this.get_bowling(bowling_team);
    this.logger.debug("set_bowler_details: bowlers list:" + JSON.stringify(bowlers));
    data.bowler = set_bowler(bowlers, data.bowler, this.logger);
    this.logger.debug(
      "set_bowler_details: bowler  : " + JSON.stringify(data.bowler)
    );
    data.next_bowler = set_bowler(
      bowlers,
      data.next_bowler,
      this.logger
    );
    this.logger.debug(
      "set_bowler_details: next_bowler : " +
      JSON.stringify(data.next_bowler)
    );
    if (!data.bowler.id) {
      data.bowler = set_bowler(bowlers, data.bowler, this.logger);
    }
    if (!data.next_bowler.id) {
      data.next_bowler = set_bowler(
        bowlers,
        data.next_bowler,
        this.logger
      );

    }

    this.logger.debug(
      "set_bowler_details: bowler  : " +
      JSON.stringify(data.bowler)
    );

    this.logger.debug(
      "set_bowler_details: next_bowler : " +
      JSON.stringify(data.next_bowler)
    );

    sc.validators.is_json(data.bowler);
    sc.validators.is_json(data.next_bowler);

    // End set_bowler_details.
  };

  /**
   * @method get_bowlers
   * @memberOf PlayerManager
   * @param players {array}
   * @description list of players who have bowled in innings.
   * @returns {array}
   */
  this.get_bowlers = function(players) {
    if (!players) {
      throw new Error("get_bowlers requires a list of players");
    }
    var bowlers = [];
    for (var i = 0; i < players.length; i++) {
      if (players[i].bowler) {
        bowlers.push(players[i]);
      }
    }
    bowlers = bowlers.sort(this.sort_by_bowler_no);
    return bowlers;
  };

  /**
   * @method get_bowling
   * @memberOf PlayerManager
   * @description Return a list of the current bowlers. (0, 1 or 2 bowlers.)
   * @param players {array} - List of players in bowling team
   * @returns {array}
   */
  this.get_bowling = function(players) {
    // this.logger.debug("get_bowling received " + JSON.stringify(players));
    if (!players) {
      throw new Error("get_bowling requires a list of players");
    }
    var bowlers = this.get_bowlers(players);
    var bowling = [];
    for (var i = 0; i < bowlers.length; i++) {
      if (bowlers[i].bowling) {
        bowling.push(bowlers[i]);
      }
    }
    return bowling;
  };

  /**
   * @method sort_by_bowler_no
   * @description Does this work?
   * @memberOf PlayerManager
   * returns {integer}
   */
  this.sort_by_bowler_no = function(a, b) {
    if (!a.bowler) {
      a.bowler = 0;
    }
    if (!b.bowler) {
      b.bowler = 0;
    }
    return parseInt(a.bowler) - parseInt(b.bowler);
  }

  /**
   * @method init_players
   * @memberOf PlayerManager
   * @description Returns a list of player objects for the home team or
   * the away team. The list is cloned from the template.
   * @param data {JSON} - Data
   * @param action {string} - "home" or "away"
   * returns {array}
   */
  this.init_players = function(data, action) {

    this.logger.debug('Start init_players. ' + action);
    if (action != 'home' && action != 'away') {
      throw new Error('Parameter "action" must be "home" or "away"');
    }

    var doit = function(base, output, logger) {
      output = [];
      base.forEach(
        function(p, i) {
          logger.debug('init_players data.templates.Batsman: ' +
            JSON.stringify(data.templates.Batsman));
          var player = clone(data.templates.Batsman);
          var keys = Object.keys(p);
          keys.forEach(
            function(k, i) {
              player[k] = p[k];
            }
          );
          player.no = player.batting_no;
          // delete player.batting_no;
          // this.logger.debug('push: ' + JSON.stringify(player));
          output.push(player);
          // this.logger.debug('X output:' + JSON.stringify(output));
        }
      );
      // this.logger.debug('output:' + JSON.stringify(output));
      return output;
    };

    if (action == 'home') {
      return doit(data.templates.HomePlayers, data.home_players, this.logger);
    } else {
      return doit(data.templates.AwayPlayers, data.away_players, this.logger);
    }
  };

  /**
   * @method lookup
   * @memberOf PlayerManager
   * @param players {array} - List of players in a team
   * @param player {Batsman} - Player to be returned
   * @returns {integer}
   */
  this.lookup = function(players, player) {
    for (var i = 0; i < players.length; i++) {
      if (players[i].id == player.id) {
        return i;
      }
    }
    return -1;
  };

};

var sc = sc || {};

sc.Utils = {
  // Deep copy of simple JSON object.
  clone: function(o) {
    return JSON.parse(JSON.stringify(o))
  }
};

var sc = sc || {};

sc.validators = {
  is_batsman: function(batsman) {
    var b = batsman;
    var errors = [];
    ['no', 'striker', 'runs', 'name', 'id', 'bowler', 'bowling'].forEach(function(m, i) {
      // console.log("Does method " + m +" of Batsman exist: " + is.existy(b[m]));
      if (!is.existy(b[m])) {
        errors.push(m);
      }
    });

    if (errors.length) {
      throw new Error("Not a Batsman. Must have the following properties: " +
        JSON.stringify(errors) +
        '. Got:' + JSON.stringify(b));
    }
  },
  is_bowler: function(bowler) {
    var b = bowler;
    if (!is.all.existy(b.no, b.striker, b.runs, b.bowler, b.bowling)) {
      throw new Error("Not a Bowler: " + JSON.stringify(b));
    }
  },
  is_ball: function(ball) {
    var b = ball;
    if (!is.existy(b) || !is.all.existy(b.striker, b.runs, b.extras, b.wkt, b.valid)) {
      throw new Error("Not a Ball: " + JSON.stringify(b));
    }
  },
  is_json: function(json) {
    if (!is.json) {
      throw new Error("Not pure JSON: " + json);
    }
  }
};

/**
* @namespace lib
* @memberOf scorer
*
*/

// class InvalidParamError extends Error {
//   constructor(message) {
//     super(message); // (1)
//     this.name = "InvalidParamError"; // (2)
//   }
// }
//
// class MissingParamError extends Error {
//   constructor(message) {
//     super(message); // (1)
//     this.name = "MissingParamError"; // (2)
//   }
// }

// define([], function() {
//   console.log('Creating a new scoreboard module');
//
//   function addResult(newResult) {
//     return;
//   }
//
//   function updateScoreboard() {
//   return;
//   }
//   return {
//     addResult: addResult,
//     updateScoreboard: updateScoreboard
//   }
//});

var sc = sc || {};

// https://stackoverflow.com/questions/1382107/whats-a-good-way-to-extend-error-in-javascript

// There's something odd about custom errors in ES5. Gave up.

// These just add a prefix.

sc.InvalidParamError = function(msg) {
  return new Error('InvalidParamError ' + msg);
};

sc.MissingParamError = function(msg) {
  return new Error('MissingParamError ' + msg);
};

/*!
 * is.js 0.9.0
 * Author: Aras Atasaygin
 */

// AMD with global, Node, or global
;(function(root, factory) {    // eslint-disable-line no-extra-semi
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(function() {
            // Also create a global in case some scripts
            // that are loaded still are looking for
            // a global even when an AMD loader is in use.
            return (root.is = factory());
        });
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is self)
        root.is = factory();
    }
}(this, function() {

    // Baseline
    /* -------------------------------------------------------------------------- */

    // define 'is' object and current version
    var is = {};
    is.VERSION = '0.9.0';

    // define interfaces
    is.not = {};
    is.all = {};
    is.any = {};

    // cache some methods to call later on
    var toString = Object.prototype.toString;
    var slice = Array.prototype.slice;
    var hasOwnProperty = Object.prototype.hasOwnProperty;

    // helper function which reverses the sense of predicate result
    function not(func) {
        return function() {
            return !func.apply(null, slice.call(arguments));
        };
    }

    // helper function which call predicate function per parameter and return true if all pass
    function all(func) {
        return function() {
            var params = getParams(arguments);
            var length = params.length;
            for (var i = 0; i < length; i++) {
                if (!func.call(null, params[i])) {
                    return false;
                }
            }
            return true;
        };
    }

    // helper function which call predicate function per parameter and return true if any pass
    function any(func) {
        return function() {
            var params = getParams(arguments);
            var length = params.length;
            for (var i = 0; i < length; i++) {
                if (func.call(null, params[i])) {
                    return true;
                }
            }
            return false;
        };
    }

    // build a 'comparator' object for various comparison checks
    var comparator = {
        '<': function(a, b) { return a < b; },
        '<=': function(a, b) { return a <= b; },
        '>': function(a, b) { return a > b; },
        '>=': function(a, b) { return a >= b; }
    };

    // helper function which compares a version to a range
    function compareVersion(version, range) {
        var string = (range + '');
        var n = +(string.match(/\d+/) || NaN);
        var op = string.match(/^[<>]=?|/)[0];
        return comparator[op] ? comparator[op](version, n) : (version == n || n !== n);
    }

    // helper function which extracts params from arguments
    function getParams(args) {
        var params = slice.call(args);
        var length = params.length;
        if (length === 1 && is.array(params[0])) {    // support array
            params = params[0];
        }
        return params;
    }

    // Type checks
    /* -------------------------------------------------------------------------- */

    // is a given value Arguments?
    is.arguments = function(value) {    // fallback check is for IE
        return toString.call(value) === '[object Arguments]' ||
            (value != null && typeof value === 'object' && 'callee' in value);
    };

    // is a given value Array?
    is.array = Array.isArray || function(value) {    // check native isArray first
        return toString.call(value) === '[object Array]';
    };

    // is a given value Boolean?
    is.boolean = function(value) {
        return value === true || value === false || toString.call(value) === '[object Boolean]';
    };

    // is a given value Char?
    is.char = function(value) {
        return is.string(value) && value.length === 1;
    };

    // is a given value Date Object?
    is.date = function(value) {
        return toString.call(value) === '[object Date]';
    };

    // is a given object a DOM node?
    is.domNode = function(object) {
        return is.object(object) && object.nodeType > 0;
    };

    // is a given value Error object?
    is.error = function(value) {
        return toString.call(value) === '[object Error]';
    };

    // is a given value function?
    is['function'] = function(value) {    // fallback check is for IE
        return toString.call(value) === '[object Function]' || typeof value === 'function';
    };

    // is given value a pure JSON object?
    is.json = function(value) {
        return toString.call(value) === '[object Object]';
    };

    // is a given value NaN?
    is.nan = function(value) {    // NaN is number :) Also it is the only value which does not equal itself
        return value !== value;
    };

    // is a given value null?
    is['null'] = function(value) {
        return value === null;
    };

    // is a given value number?
    is.number = function(value) {
        return is.not.nan(value) && toString.call(value) === '[object Number]';
    };

    // is a given value object?
    is.object = function(value) {
        return Object(value) === value;
    };

    // is a given value RegExp?
    is.regexp = function(value) {
        return toString.call(value) === '[object RegExp]';
    };

    // are given values same type?
    // prevent NaN, Number same type check
    is.sameType = function(value, other) {
        var tag = toString.call(value);
        if (tag !== toString.call(other)) {
            return false;
        }
        if (tag === '[object Number]') {
            return !is.any.nan(value, other) || is.all.nan(value, other);
        }
        return true;
    };
    // sameType method does not support 'all' and 'any' interfaces
    is.sameType.api = ['not'];

    // is a given value String?
    is.string = function(value) {
        return toString.call(value) === '[object String]';
    };

    // is a given value undefined?
    is.undefined = function(value) {
        return value === void 0;
    };

    // is a given value window?
    // setInterval method is only available for window object
    is.windowObject = function(value) {
        return value != null && typeof value === 'object' && 'setInterval' in value;
    };

    // Presence checks
    /* -------------------------------------------------------------------------- */

    //is a given value empty? Objects, arrays, strings
    is.empty = function(value) {
        if (is.object(value)) {
            var length = Object.getOwnPropertyNames(value).length;
            if (length === 0 || (length === 1 && is.array(value)) ||
                    (length === 2 && is.arguments(value))) {
                return true;
            }
            return false;
        }
        return value === '';
    };

    // is a given value existy?
    is.existy = function(value) {
        return value != null;
    };

    // is a given value falsy?
    is.falsy = function(value) {
        return !value;
    };

    // is a given value truthy?
    is.truthy = not(is.falsy);

    // Arithmetic checks
    /* -------------------------------------------------------------------------- */

    // is a given number above minimum parameter?
    is.above = function(n, min) {
        return is.all.number(n, min) && n > min;
    };
    // above method does not support 'all' and 'any' interfaces
    is.above.api = ['not'];

    // is a given number decimal?
    is.decimal = function(n) {
        return is.number(n) && n % 1 !== 0;
    };

    // are given values equal? supports numbers, strings, regexes, booleans
    // TODO: Add object and array support
    is.equal = function(value, other) {
        // check 0 and -0 equity with Infinity and -Infinity
        if (is.all.number(value, other)) {
            return value === other && 1 / value === 1 / other;
        }
        // check regexes as strings too
        if (is.all.string(value, other) || is.all.regexp(value, other)) {
            return '' + value === '' + other;
        }
        if (is.all.boolean(value, other)) {
            return value === other;
        }
        return false;
    };
    // equal method does not support 'all' and 'any' interfaces
    is.equal.api = ['not'];

    // is a given number even?
    is.even = function(n) {
        return is.number(n) && n % 2 === 0;
    };

    // is a given number finite?
    is.finite = isFinite || function(n) {
        return is.not.infinite(n) && is.not.nan(n);
    };

    // is a given number infinite?
    is.infinite = function(n) {
        return n === Infinity || n === -Infinity;
    };

    // is a given number integer?
    is.integer = function(n) {
        return is.number(n) && n % 1 === 0;
    };

    // is a given number negative?
    is.negative = function(n) {
        return is.number(n) && n < 0;
    };

    // is a given number odd?
    is.odd = function(n) {
        return is.number(n) && (n % 2 === 1 || n % 2 === -1);
    };

    // is a given number positive?
    is.positive = function(n) {
        return is.number(n) && n > 0;
    };

    // is a given number above maximum parameter?
    is.under = function(n, max) {
        return is.all.number(n, max) && n < max;
    };
    // least method does not support 'all' and 'any' interfaces
    is.under.api = ['not'];

    // is a given number within minimum and maximum parameters?
    is.within = function(n, min, max) {
        return is.all.number(n, min, max) && n > min && n < max;
    };
    // within method does not support 'all' and 'any' interfaces
    is.within.api = ['not'];

    // Regexp checks
    /* -------------------------------------------------------------------------- */
    // Steven Levithan, Jan Goyvaerts: Regular Expressions Cookbook
    // Scott Gonzalez: Email address validation

    // dateString match m/d/yy and mm/dd/yyyy, allowing any combination of one or two digits for the day and month, and two or four digits for the year
    // eppPhone match extensible provisioning protocol format
    // nanpPhone match north american number plan format
    // time match hours, minutes, and seconds, 24-hour clock
    var regexes = {
        affirmative: /^(?:1|t(?:rue)?|y(?:es)?|ok(?:ay)?)$/,
        alphaNumeric: /^[A-Za-z0-9]+$/,
        caPostalCode: /^(?!.*[DFIOQU])[A-VXY][0-9][A-Z]\s?[0-9][A-Z][0-9]$/,
        creditCard: /^(?:(4[0-9]{12}(?:[0-9]{3})?)|(5[1-5][0-9]{14})|(6(?:011|5[0-9]{2})[0-9]{12})|(3[47][0-9]{13})|(3(?:0[0-5]|[68][0-9])[0-9]{11})|((?:2131|1800|35[0-9]{3})[0-9]{11}))$/,
        dateString: /^(1[0-2]|0?[1-9])([\/-])(3[01]|[12][0-9]|0?[1-9])(?:\2)(?:[0-9]{2})?[0-9]{2}$/,
        email: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i, // eslint-disable-line no-control-regex
        eppPhone: /^\+[0-9]{1,3}\.[0-9]{4,14}(?:x.+)?$/,
        hexadecimal: /^(?:0x)?[0-9a-fA-F]+$/,
        hexColor: /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
        ipv4: /^(?:(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/,
        ipv6: /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i,
        nanpPhone: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
        socialSecurityNumber: /^(?!000|666)[0-8][0-9]{2}-?(?!00)[0-9]{2}-?(?!0000)[0-9]{4}$/,
        timeString: /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9])$/,
        ukPostCode: /^[A-Z]{1,2}[0-9RCHNQ][0-9A-Z]?\s?[0-9][ABD-HJLNP-UW-Z]{2}$|^[A-Z]{2}-?[0-9]{4}$/,
        url: /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/i,
        usZipCode: /^[0-9]{5}(?:-[0-9]{4})?$/
    };

    function regexpCheck(regexp, regexes) {
        is[regexp] = function(value) {
            return is.existy(value) && regexes[regexp].test(value);
        };
    }

    // create regexp checks methods from 'regexes' object
    for (var regexp in regexes) {
        if (regexes.hasOwnProperty(regexp)) {
            regexpCheck(regexp, regexes);
        }
    }

    // simplify IP checks by calling the regex helpers for IPv4 and IPv6
    is.ip = function(value) {
        return is.ipv4(value) || is.ipv6(value);
    };

    // String checks
    /* -------------------------------------------------------------------------- */

    // is a given string or sentence capitalized?
    is.capitalized = function(string) {
        if (is.not.string(string)) {
            return false;
        }
        var words = string.split(' ');
        for (var i = 0; i < words.length; i++) {
            var word = words[i];
            if (word.length) {
                var chr = word.charAt(0);
                if (chr !== chr.toUpperCase()) {
                    return false;
                }
            }
        }
        return true;
    };

    // is string end with a given target parameter?
    is.endWith = function(string, target) {
        if (is.not.string(string)) {
            return false;
        }
        target += '';
        var position = string.length - target.length;
        return position >= 0 && string.indexOf(target, position) === position;
    };
    // endWith method does not support 'all' and 'any' interfaces
    is.endWith.api = ['not'];

    // is a given string include parameter target?
    is.include = function(string, target) {
        return string.indexOf(target) > -1;
    };
    // include method does not support 'all' and 'any' interfaces
    is.include.api = ['not'];

    // is a given string all lowercase?
    is.lowerCase = function(string) {
        return is.string(string) && string === string.toLowerCase();
    };

    // is a given string palindrome?
    is.palindrome = function(string) {
        if (is.not.string(string)) {
            return false;
        }
        string = string.replace(/[^a-zA-Z0-9]+/g, '').toLowerCase();
        var length = string.length - 1;
        for (var i = 0, half = Math.floor(length / 2); i <= half; i++) {
            if (string.charAt(i) !== string.charAt(length - i)) {
                return false;
            }
        }
        return true;
    };

    // is a given value space?
    // horizontal tab: 9, line feed: 10, vertical tab: 11, form feed: 12, carriage return: 13, space: 32
    is.space = function(value) {
        if (is.not.char(value)) {
            return false;
        }
        var charCode = value.charCodeAt(0);
        return (charCode > 8 && charCode < 14) || charCode === 32;
    };

    // is string start with a given target parameter?
    is.startWith = function(string, target) {
        return is.string(string) && string.indexOf(target) === 0;
    };
    // startWith method does not support 'all' and 'any' interfaces
    is.startWith.api = ['not'];

    // is a given string all uppercase?
    is.upperCase = function(string) {
        return is.string(string) && string === string.toUpperCase();
    };

    // Time checks
    /* -------------------------------------------------------------------------- */

    var days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    var months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

    // is a given dates day equal given day parameter?
    is.day = function(date, day) {
        return is.date(date) && day.toLowerCase() === days[date.getDay()];
    };
    // day method does not support 'all' and 'any' interfaces
    is.day.api = ['not'];

    // is a given date in daylight saving time?
    is.dayLightSavingTime = function(date) {
        var january = new Date(date.getFullYear(), 0, 1);
        var july = new Date(date.getFullYear(), 6, 1);
        var stdTimezoneOffset = Math.max(january.getTimezoneOffset(), july.getTimezoneOffset());
        return date.getTimezoneOffset() < stdTimezoneOffset;
    };

    // is a given date future?
    is.future = function(date) {
        var now = new Date();
        return is.date(date) && date.getTime() > now.getTime();
    };

    // is date within given range?
    is.inDateRange = function(date, start, end) {
        if (is.not.date(date) || is.not.date(start) || is.not.date(end)) {
            return false;
        }
        var stamp = date.getTime();
        return stamp > start.getTime() && stamp < end.getTime();
    };
    // inDateRange method does not support 'all' and 'any' interfaces
    is.inDateRange.api = ['not'];

    // is a given date in last month range?
    is.inLastMonth = function(date) {
        return is.inDateRange(date, new Date(new Date().setMonth(new Date().getMonth() - 1)), new Date());
    };

    // is a given date in last week range?
    is.inLastWeek = function(date) {
        return is.inDateRange(date, new Date(new Date().setDate(new Date().getDate() - 7)), new Date());
    };

    // is a given date in last year range?
    is.inLastYear = function(date) {
        return is.inDateRange(date, new Date(new Date().setFullYear(new Date().getFullYear() - 1)), new Date());
    };

    // is a given date in next month range?
    is.inNextMonth = function(date) {
        return is.inDateRange(date, new Date(), new Date(new Date().setMonth(new Date().getMonth() + 1)));
    };

    // is a given date in next week range?
    is.inNextWeek = function(date) {
        return is.inDateRange(date, new Date(), new Date(new Date().setDate(new Date().getDate() + 7)));
    };

    // is a given date in next year range?
    is.inNextYear = function(date) {
        return is.inDateRange(date, new Date(), new Date(new Date().setFullYear(new Date().getFullYear() + 1)));
    };

    // is the given year a leap year?
    is.leapYear = function(year) {
        return is.number(year) && ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0);
    };

    // is a given dates month equal given month parameter?
    is.month = function(date, month) {
        return is.date(date) && month.toLowerCase() === months[date.getMonth()];
    };
    // month method does not support 'all' and 'any' interfaces
    is.month.api = ['not'];

    // is a given date past?
    is.past = function(date) {
        var now = new Date();
        return is.date(date) && date.getTime() < now.getTime();
    };

    // is a given date in the parameter quarter?
    is.quarterOfYear = function(date, quarter) {
        return is.date(date) && is.number(quarter) && quarter === Math.floor((date.getMonth() + 3) / 3);
    };
    // quarterOfYear method does not support 'all' and 'any' interfaces
    is.quarterOfYear.api = ['not'];

    // is a given date indicate today?
    is.today = function(date) {
        var now = new Date();
        var todayString = now.toDateString();
        return is.date(date) && date.toDateString() === todayString;
    };

    // is a given date indicate tomorrow?
    is.tomorrow = function(date) {
        var now = new Date();
        var tomorrowString = new Date(now.setDate(now.getDate() + 1)).toDateString();
        return is.date(date) && date.toDateString() === tomorrowString;
    };

    // is a given date weekend?
    // 6: Saturday, 0: Sunday
    is.weekend = function(date) {
        return is.date(date) && (date.getDay() === 6 || date.getDay() === 0);
    };

    // is a given date weekday?
    is.weekday = not(is.weekend);

    // is a given dates year equal given year parameter?
    is.year = function(date, year) {
        return is.date(date) && is.number(year) && year === date.getFullYear();
    };
    // year method does not support 'all' and 'any' interfaces
    is.year.api = ['not'];

    // is a given date indicate yesterday?
    is.yesterday = function(date) {
        var now = new Date();
        var yesterdayString = new Date(now.setDate(now.getDate() - 1)).toDateString();
        return is.date(date) && date.toDateString() === yesterdayString;
    };

    // Environment checks
    /* -------------------------------------------------------------------------- */

    var freeGlobal = is.windowObject(typeof global == 'object' && global) && global;
    var freeSelf = is.windowObject(typeof self == 'object' && self) && self;
    var thisGlobal = is.windowObject(typeof this == 'object' && this) && this;
    var root = freeGlobal || freeSelf || thisGlobal || Function('return this')();

    var document = freeSelf && freeSelf.document;
    var previousIs = root.is;

    // store navigator properties to use later
    var navigator = freeSelf && freeSelf.navigator;
    var platform = (navigator && navigator.platform || '').toLowerCase();
    var userAgent = (navigator && navigator.userAgent || '').toLowerCase();
    var vendor = (navigator && navigator.vendor || '').toLowerCase();

    // is current device android?
    is.android = function() {
        return /android/.test(userAgent);
    };
    // android method does not support 'all' and 'any' interfaces
    is.android.api = ['not'];

    // is current device android phone?
    is.androidPhone = function() {
        return /android/.test(userAgent) && /mobile/.test(userAgent);
    };
    // androidPhone method does not support 'all' and 'any' interfaces
    is.androidPhone.api = ['not'];

    // is current device android tablet?
    is.androidTablet = function() {
        return /android/.test(userAgent) && !/mobile/.test(userAgent);
    };
    // androidTablet method does not support 'all' and 'any' interfaces
    is.androidTablet.api = ['not'];

    // is current device blackberry?
    is.blackberry = function() {
        return /blackberry/.test(userAgent) || /bb10/.test(userAgent);
    };
    // blackberry method does not support 'all' and 'any' interfaces
    is.blackberry.api = ['not'];

    // is current browser chrome?
    // parameter is optional
    is.chrome = function(range) {
        var match = /google inc/.test(vendor) ? userAgent.match(/(?:chrome|crios)\/(\d+)/) : null;
        return match !== null && is.not.opera() && compareVersion(match[1], range);
    };
    // chrome method does not support 'all' and 'any' interfaces
    is.chrome.api = ['not'];

    // is current device desktop?
    is.desktop = function() {
        return is.not.mobile() && is.not.tablet();
    };
    // desktop method does not support 'all' and 'any' interfaces
    is.desktop.api = ['not'];

    // is current browser edge?
    // parameter is optional
    is.edge = function(range) {
        var match = userAgent.match(/edge\/(\d+)/);
        return match !== null && compareVersion(match[1], range);
    };
    // edge method does not support 'all' and 'any' interfaces
    is.edge.api = ['not'];

    // is current browser firefox?
    // parameter is optional
    is.firefox = function(range) {
        var match = userAgent.match(/(?:firefox|fxios)\/(\d+)/);
        return match !== null && compareVersion(match[1], range);
    };
    // firefox method does not support 'all' and 'any' interfaces
    is.firefox.api = ['not'];

    // is current browser internet explorer?
    // parameter is optional
    is.ie = function(range) {
        var match = userAgent.match(/(?:msie |trident.+?; rv:)(\d+)/);
        return match !== null && compareVersion(match[1], range);
    };
    // ie method does not support 'all' and 'any' interfaces
    is.ie.api = ['not'];

    // is current device ios?
    is.ios = function() {
        return is.iphone() || is.ipad() || is.ipod();
    };
    // ios method does not support 'all' and 'any' interfaces
    is.ios.api = ['not'];

    // is current device ipad?
    // parameter is optional
    is.ipad = function(range) {
        var match = userAgent.match(/ipad.+?os (\d+)/);
        return match !== null && compareVersion(match[1], range);
    };
    // ipad method does not support 'all' and 'any' interfaces
    is.ipad.api = ['not'];

    // is current device iphone?
    // parameter is optional
    is.iphone = function(range) {
        // avoid false positive for Facebook in-app browser on ipad;
        // original iphone doesn't have the OS portion of the UA
        var match = is.ipad() ? null : userAgent.match(/iphone(?:.+?os (\d+))?/);
        return match !== null && compareVersion(match[1] || 1, range);
    };
    // iphone method does not support 'all' and 'any' interfaces
    is.iphone.api = ['not'];

    // is current device ipod?
    // parameter is optional
    is.ipod = function(range) {
        var match = userAgent.match(/ipod.+?os (\d+)/);
        return match !== null && compareVersion(match[1], range);
    };
    // ipod method does not support 'all' and 'any' interfaces
    is.ipod.api = ['not'];

    // is current operating system linux?
    is.linux = function() {
        return /linux/.test(platform) && is.not.android();
    };
    // linux method does not support 'all' and 'any' interfaces
    is.linux.api = ['not'];

    // is current operating system mac?
    is.mac = function() {
        return /mac/.test(platform);
    };
    // mac method does not support 'all' and 'any' interfaces
    is.mac.api = ['not'];

    // is current device mobile?
    is.mobile = function() {
        return is.iphone() || is.ipod() || is.androidPhone() || is.blackberry() || is.windowsPhone();
    };
    // mobile method does not support 'all' and 'any' interfaces
    is.mobile.api = ['not'];

    // is current state offline?
    is.offline = not(is.online);
    // offline method does not support 'all' and 'any' interfaces
    is.offline.api = ['not'];

    // is current state online?
    is.online = function() {
        return !navigator || navigator.onLine === true;
    };
    // online method does not support 'all' and 'any' interfaces
    is.online.api = ['not'];

    // is current browser opera?
    // parameter is optional
    is.opera = function(range) {
        var match = userAgent.match(/(?:^opera.+?version|opr)\/(\d+)/);
        return match !== null && compareVersion(match[1], range);
    };
    // opera method does not support 'all' and 'any' interfaces
    is.opera.api = ['not'];

    // is current browser opera mini?
    // parameter is optional
    is.operaMini = function(range) {
        var match = userAgent.match(/opera mini\/(\d+)/);
        return match !== null && compareVersion(match[1], range);
    };
    // operaMini method does not support 'all' and 'any' interfaces
    is.operaMini.api = ['not'];

    // is current browser phantomjs?
    // parameter is optional
    is.phantom = function(range) {
        var match = userAgent.match(/phantomjs\/(\d+)/);
        return match !== null && compareVersion(match[1], range);
    };
    // phantom method does not support 'all' and 'any' interfaces
    is.phantom.api = ['not'];

    // is current browser safari?
    // parameter is optional
    is.safari = function(range) {
        var match = userAgent.match(/version\/(\d+).+?safari/);
        return match !== null && compareVersion(match[1], range);
    };
    // safari method does not support 'all' and 'any' interfaces
    is.safari.api = ['not'];

    // is current device tablet?
    is.tablet = function() {
        return is.ipad() || is.androidTablet() || is.windowsTablet();
    };
    // tablet method does not support 'all' and 'any' interfaces
    is.tablet.api = ['not'];

    // is current device supports touch?
    is.touchDevice = function() {
        return !!document && ('ontouchstart' in freeSelf ||
            ('DocumentTouch' in freeSelf && document instanceof DocumentTouch));
    };
    // touchDevice method does not support 'all' and 'any' interfaces
    is.touchDevice.api = ['not'];

    // is current operating system windows?
    is.windows = function() {
        return /win/.test(platform);
    };
    // windows method does not support 'all' and 'any' interfaces
    is.windows.api = ['not'];

    // is current device windows phone?
    is.windowsPhone = function() {
        return is.windows() && /phone/.test(userAgent);
    };
    // windowsPhone method does not support 'all' and 'any' interfaces
    is.windowsPhone.api = ['not'];

    // is current device windows tablet?
    is.windowsTablet = function() {
        return is.windows() && is.not.windowsPhone() && /touch/.test(userAgent);
    };
    // windowsTablet method does not support 'all' and 'any' interfaces
    is.windowsTablet.api = ['not'];

    // Object checks
    /* -------------------------------------------------------------------------- */

    // has a given object got parameterized count property?
    is.propertyCount = function(object, count) {
        if (is.not.object(object) || is.not.number(count)) {
            return false;
        }
        var n = 0;
        for (var property in object) {
            if (hasOwnProperty.call(object, property) && ++n > count) {
                return false;
            }
        }
        return n === count;
    };
    // propertyCount method does not support 'all' and 'any' interfaces
    is.propertyCount.api = ['not'];

    // is given object has parameterized property?
    is.propertyDefined = function(object, property) {
        return is.object(object) && is.string(property) && property in object;
    };
    // propertyDefined method does not support 'all' and 'any' interfaces
    is.propertyDefined.api = ['not'];

    // is a given value thenable (like Promise)?
    is.thenable = function(value) {
        return is.object(value) && typeof value.then === 'function';
    };

    // Array checks
    /* -------------------------------------------------------------------------- */

    // is a given item in an array?
    is.inArray = function(value, array) {
        if (is.not.array(array)) {
            return false;
        }
        for (var i = 0; i < array.length; i++) {
            if (array[i] === value) {
                return true;
            }
        }
        return false;
    };
    // inArray method does not support 'all' and 'any' interfaces
    is.inArray.api = ['not'];

    // is a given array sorted?
    is.sorted = function(array, sign) {
        if (is.not.array(array)) {
            return false;
        }
        var predicate = comparator[sign] || comparator['>='];
        for (var i = 1; i < array.length; i++) {
            if (!predicate(array[i], array[i - 1])) {
                return false;
            }
        }
        return true;
    };


    // API
    // Set 'not', 'all' and 'any' interfaces to methods based on their api property
    /* -------------------------------------------------------------------------- */

    function setInterfaces() {
        var options = is;
        for (var option in options) {
            if (hasOwnProperty.call(options, option) && is['function'](options[option])) {
                var interfaces = options[option].api || ['not', 'all', 'any'];
                for (var i = 0; i < interfaces.length; i++) {
                    if (interfaces[i] === 'not') {
                        is.not[option] = not(is[option]);
                    }
                    if (interfaces[i] === 'all') {
                        is.all[option] = all(is[option]);
                    }
                    if (interfaces[i] === 'any') {
                        is.any[option] = any(is[option]);
                    }
                }
            }
        }
    }
    setInterfaces();

    // Configuration methods
    // Intentionally added after setInterfaces function
    /* -------------------------------------------------------------------------- */

    // change namespace of library to prevent name collisions
    // var preferredName = is.setNamespace();
    // preferredName.odd(3);
    // => true
    is.setNamespace = function() {
        root.is = previousIs;
        return this;
    };

    // set optional regexes to methods
    is.setRegexp = function(regexp, name) {
        for (var r in regexes) {
            if (hasOwnProperty.call(regexes, r) && (name === r)) {
                regexes[r] = regexp;
            }
        }
    };

    return is;
}));

/*jslint vars:true, plusplus:true, devel:true, nomen:true, indent:4, maxerr:50*/

/**
 * @namespace sc
 *
 */
var sc = sc || {};

/*jslint vars:true, plusplus:true, devel:true, nomen:true, indent:4, maxerr:50*/
sc.test = function() {
  /*jslint vars:true, plusplus:true, devel:true, nomen:true, indent:4, maxerr:50*/
  console.log("Hello from sc.test");
  return "test";
};

sc.test_object = function() {
  this.msg = function() {
    console.log("Hello from sc.test_object");
    return "test_object";
  };
};

/**
 * @class Scoreboard
 * @memberOf sc
 * @constructor Scoreboard
 * @param {ScoreboardTemplate} scoreboard_template
 * @param {Players} Players
 * @param {Over} Over
 * @property {number} scoreboard - The current innings. Always innings[0] of the ScoreboardTemplate object.
 * @property {array} next_innings - The next innings. Always innings[1] of the ScoreboardTemplate object.
 * @property {Players} home_players -
 * @property {Players} away_players -
 * @property {boolean} is_ready -
 * @property {Players} home_players -
 */
sc.Scoreboard = function(ScoreboardTemplate, Settings, Players, Over, Storage) {

  // The constructor statements are at the bottom because they rely on a couple
  // of methods having been defined.
  if (arguments.length != 5) {
    throw new Error('sc.Scoreboard requires 5 parameters Got ' + arguments.length);
  }

  this.prepare_match_in_progress = function(ScoreboardTemplate, Settings, Storage) {

    if (arguments.length != 3) {
      throw new Error("prepare_match_in_progress requires 3 arguments. Got " + arguments.length);
    }
    var scoreboard_template = new ScoreboardTemplate(Settings);

    storage = new Storage();
    var scoreboard_data = storage.get_scoreboard();

    if (scoreboard_data) {
      this.logger.debug('No need to initialise. Using stored scoreboard.');
      this.logger.debug("Data retrieved from storage: " + JSON.stringify(scoreboard_data));
      scoreboard_template.innings[0] = scoreboard_data;
    }

    // initial_scoreboard.innings[0] = stored_scoreboard;
    this.logger.debug("Modified scoreboard template: " + JSON.stringify(scoreboard_template));

    return scoreboard_template;
  };

  /**
   * @method change_ends
   * @memberOf sc.Scoreboard
   * @description Accept the number of times the batsmen ran and calculate whether
   * the batsmen changed ends. If they did, toggle the values of scoreboard.left_bat.striker
   * and scoreboard.right_bat.striker.
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
   *  @description Swop the objects in scoreboard.bowler and scoreboard.next_bowler. Called at the end of each over.
   *  @memberOf sc.Scoreboard
   */
  this.change_bowlers = function() {
    var tmp = this.scoreboard.bowler;
    this.scoreboard.bowler = this.scoreboard.next_bowler;
    this.scoreboard.next_bowler = tmp;
    this.logger.debug(
      "After change_bowlers: bowler " + JSON.stringify(this.scoreboard.bowler)
    );
    this.logger.debug(
      "After change_bowlers: next " +
      JSON.stringify(this.scoreboard.next_bowler)
    );
  };

  /** @function alert_game_over
   *  @description Alert if the scoreboard.game_over flag is true.
   *  @memberOf sc.Scoreboard
   *  @private
   */
  this.alert_game_over = function() {
    if (this.scoreboard.game_over === true) {
      alert("The game is over!");
      return true;
    }
    return this.alert_innings_over();
  };

  /** @function alert_innings_over
   *  @description Alert if the scoreboard.gamer_over flag is false and the
   *  scoreboard.innings_overs flag is true.
   *  @memberOf sc.Scoreboard
   *  @private
   *  @return {boolean}
   */
  this.alert_innings_over = function() {
    if (
      this.scoreboard.game_over === false &&
      this.scoreboard.innings_over === true
    ) {
      alert("The innings is over!");
      this.new_innings();
      return true;
    }
    return false;
  };

  /** @function alert_no_bowler
   *  @description Alert if the bowler is not set.
   *  @memberOf sc.Scoreboard
   *  @private
   *  @return boolean
   */
  this.alert_no_bowler = function() {
    if (!this.scoreboard.bowler.name) {
      this.logger.error("alert_no_bowler. No bowler. " + JSON.stringify(this.scoreboard));
      alert("Please select a bowler for the current over.");
      return true;
    }
    if (!this.scoreboard.next_bowler.name) {
      this.logger.error("alert_no_bowler. No bowler. " + JSON.stringify(this.scoreboard));
      alert("Please select a bowler for the next over.");
      return true;
    }
    return false;
  };

  /** @function bowls
   *  @description Called when a delivery is anything except "other".
   *  @memberOf sc.Scoreboard
   *  @return {boolean}
   */
  this.bowls = function(type, runs) {
    this.scoreboard = this.storage.get_scoreboard();
    // this.logger.debug("In bowls(). scoreboard= " + JSON.stringify(this.scoreboard));
    if (this.alert_game_over()) {
      return false;
    }
    if (this.alert_no_bowler()) {
      return false;
    }

    switch (type) {
      case "wicket":
        this.wicket();
        break;
      case "bye":
        sc.Commands.Run(sc.Commands.Bye, this.scoreboard);
        break;
      case "leg_bye":
        sc.Commands.Run(sc.Commands.LegBye, this.scoreboard);
        break;
      case "no_ball":
        sc.Commands.Run(sc.Commands.NoBall, this.scoreboard);
        break;
      case "wide":
        sc.Commands.Run(sc.Commands.Wide, this.scoreboard);
        break;
      case "ball":
        this.ball(runs);
        // this.change_ends(runs);
        break;
    }
    // this.over();
    this.set_game_over();
    this.save();
  };

  /** @function set_game_over
   *  @description Calls set_innings_over and then sets game_over if there are no
   *  more innings.
   *  @memberOf sc.Scoreboard
   */
  this.set_game_over = function() {
    this.set_innings_over();
    if (
      this.scoreboard.last_innings > 0 &&
      this.scoreboard.total > this.scoreboard.last_innings
    ) {
      this.scoreboard.game_over = true;
    }
    if (this.scoreboard.innings_over && this.scoreboard.innings_no > 1) {
      this.scoreboard.game_over = true;
    }
  };

  /** @function set_innings_over
   *  @description Set the innings over flag if 10 wickets have been taken
   *  or the last over has been completed.
   *  @memberOf sc.Scoreboard
   * return {boolean}
   */
  this.set_innings_over = function() {
    this.logger.debug('set_innings_over. wickets:' + this.scoreboard.wickets +
      ' num_overs:' + this.scoreboard.num_overs + ' overs:' + this.scoreboard.overs);
    if (this.scoreboard.wickets >= 10) {
      this.scoreboard.innings_over = true;
    }
    //alert(this.scoreboard.num_overs + ' : ' + this.scoreboard.overs);
    if (
      this.scoreboard.num_overs &&
      this.scoreboard.overs >= this.scoreboard.num_overs
    ) {
      //alert(1);
      this.scoreboard.innings_over = true;
    }
    this.logger.debug('set_innings_over. innings_over:' + this.scoreboard.innings_over);
    return this.scoreboard.innings_over;
  };

  /** @function add_runs_to_striker
   *  @description Add the runs to the batsman's score.
   *  @memberOf sc.Scoreboard
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
   *  @description Handle valid ball/delivery.
   *  @memberOf sc.Scoreboard
   *  @param {integer} - Number of runs scored off the ball.
   */
  this.ball = function(runs) {
    var s = sc.Commands.Run(sc.Commands.StandardBall, [this.scoreboard, runs]);
  };

  /** @function wicket
   *  @description Called when a wicket is taken.
   *  @memberOf sc.Scoreboard
   */
  this.wicket = function() {
    var w = sc.Commands.Run(sc.Commands.Wicket, this.scoreboard);

    //this.logger.warn("NOT IMPLEMENTED save");
    // this.save();
  };

  /** @function add_extra
   *  @description Called when an extra is bowled.
   *  @memberOf sc.Scoreboard
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

  /** @function save
   *  @description Save the current scoreboard object.
   *  @memberOf sc.Scoreboard
   */
  this.save = function() {
    this.storage.put_scoreboard(this.scoreboard);
  };

  /** @function new_match
   *  @description Initialise a new match.
   *  @memberOf sc.Scoreboard
   */
  this.new_match = function() {

    this.logger.debug("Start new_match");
    this.storage.clear();
    this.scoreboard = this.storage.get_scoreboard();
    this.logger.debug("End new_match");
  };

  /** @function new_innings
   *  @description Start a new innings.
   *  @memberOf sc.Scoreboard
   */
  this.new_innings = function() {
    storage.put("last_innings", this.scoreboard);
    var last_scoreboard = sc.Utils.clone(this.scoreboard);

    var last_innings_runs = this.scoreboard.total;
    var last_overs_history =
      sc.Utils.clone(this.scoreboard.overs_history);
    var num_overs = this.scoreboard.num_overs;

    this.scoreboard = this.next_innings;

    this.scoreboard.last_innings = last_innings_runs;

    this.scoreboard.last_overs_history = last_overs_history;
    this.scoreboard.overs_history = [];

    this.scoreboard.target = last_innings_runs + 1;
    this.scoreboard.innings_no += 1;

    this.scoreboard.batting_team =
      this.scoreboard.batting_team == "home" ? "away" : "home";

    this.scoreboard.home_players = sc.Utils.clone(last_scoreboard.home_players);
    this.scoreboard.away_players = sc.Utils.clone(last_scoreboard.away_players);

    this.scoreboard.num_overs = num_overs;
    this.scoreboard.innings_over = false;
    this.player_manager.set_batsmen_details(this.scoreboard);
    this.logger.debug('batting_team=' + this.scoreboard.batting_team);
    this.save();
  };

  /** @function set_batting_team
   * @description Set the batting team.
   *  @memberOf sc.Scoreboard
   *  @param {Players} - batting_team - The batting team.
   */
  this.set_batting_team = function(batting_team) {
    if (batting_team != this.scoreboard.batting_team) {
      this.scoreboard.batting_team = batting_team;
      this.set_batsmen_details();

      this.set_bowler_details();
      //alert("Done");
    }
  };

  // ***********************************************************************
  /** @function reset
   *  @description Reset the list of players. This means reading the latest data
   *  from storage and setting home_players and away_players.
   *  @memberOf sc.Scoreboard
   */
  this.reset = function() {
    this.logger.debug("Start reset");
    // this.logger.debug("2 reset");
    // this.logger.debug("Players: " + JSON.stringify(Players));
    Players.set_team("home");
    // Players.reset();
    // this.logger.debug("4 reset");
    // this.scoreboard.home_players = this.player_manager.init_players(this.scoreboard, "home");
    Players.set_team("away");
    // Players.reset();
    // this.logger.debug("5 reset");
    // this.scoreboard.away_players = this.player_manager.init_players(this.scoreboard, "away");
    this.player_manager.set_batsmen_details(this.scoreboard);
    // this.logger.debug("6 reset");
    this.player_manager.set_bowler_details(this.scoreboard);
    this.logger.debug("End sc reset");
  };

  /** @function is_ready
   * @description True if the set up is complete.
   *  @memberOf scorer.factory.Scoreboard
   *  @return {boolean}
   */
  this.is_ready = function() {
    if (!this.scoreboard.overs_history.length) {
      return false;
    }
    if (
      this.scoreboard.overs_history[this.scoreboard.overs_history.length - 1]
      .valid_balls >= 6
    ) {
      return false;
    }
    return true;
  };

  /** @function clear
   *  @description Clear the overs history.
   *  @memberOf sc.Scoreboard
   */
  this.clear = function() {
    this.scoreboard.overs_history = [];
  };

  // Start constructor

  this.initialize = function() {
    this.logger = new sc.Logger('Scoreboard');

    if (!is.object(ScoreboardTemplate)) {
      throw new Error('sc.Scoreboard ScoreboardTemplate must be an object. Got ' + typeof(ScoreboardTemplate));
    }

    if (!is.object(Settings)) {
      throw new Error('sc.Scoreboard Settings must be an object');
    }

    if (!is.object(Storage)) {
      throw new Error('sc.Scoreboard Storage must be an object. Got ' + typeof(Storage));
    }

    this.logger.debug('About to call prepare_match_in_progress');
    var scoreboard_template = this.prepare_match_in_progress(ScoreboardTemplate, Settings, Storage);

    var s = jQuery.extend(true, {}, scoreboard_template);

    this.scoreboard = s.innings[0];

    this.player_manager = new sc.PlayerManager();

    // this.logger.debug("About to call Storage " + JSON.stringify(Storage));
    this.storage = new Storage();

    if (!this.scoreboard.home_players.length) {
      this.logger.debug('XXXXXXXXXXXXXXXXXX Before: ' + JSON.stringify(this.scoreboard.home_players));
      this.scoreboard.home_players = this.player_manager.init_players(this.scoreboard, "home");
      this.logger.debug('XXXXXXXXXXXXXXXXXX After: ' + JSON.stringify(this.scoreboard.home_players));
    }
    if (!this.scoreboard.away_players.length) {
      this.scoreboard.away_players = this.player_manager.init_players(this.scoreboard, "away");
    }

    this.next_innings = s.innings[1];
    this.logger.debug("Scoreboard start left_bat " + JSON.stringify(this.scoreboard.left_bat));
    this.logger.debug("scoreboard " + JSON.stringify(this.scoreboard));

    this.logger.debug("Settings: " + JSON.stringify(Settings));
    this.scoreboard.num_overs = Settings.settings.num_overs;
    this.logger.debug("num_overs:" + this.scoreboard.num_overs);

    this.save();
  };

  this.initialize();

  // End constructor

};
