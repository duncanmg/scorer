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
