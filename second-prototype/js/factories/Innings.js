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
 * @constructor Innings
 */
angular.module("scorer").factory("Innings", [
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
      this.bowler = {};
      this.next_bowler = {};
      this.game_over = false;
      this.innings_over = false;

      /** @method left_bat
       *  @memberOf scorer.factory.Innings
       */
      this.left_bat = {
        no: 1,
        striker: true,
        runs: 0
      };
      /** @function right_bat
       *  @memberOf scorer.factory.innings
       */
      this.right_bat = {
        no: 2,
        striker: false,
        runs: 0
      };

      this.templates = {
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
        Over : function(over_no, bowler_obj) {
          /** @property over_no */
          this.over_no = over_no;
          this.bowler = jQuery.extend({}, bowler_obj); // Shallow copy / clone.
          this.balls = [];
          if (!over_no || !bowler_obj) {
            throw "Over object requires over_no and bowler_obj";
          }
          this.valid_balls = 0;
          this.total_balls = 0;
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
        Ball : function(striker, runs, extras, wkt, valid) {
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
        },
      };

      /** @method num_overs
       *  @memberOf scorer.factory.Innings
       */
      this.num_overs = (function() {
        // alert(Settings.settings.match_type.name);
        if (Settings.settings.match_type.id == 1) {
          return Settings.settings.num_overs;
        }
        return false;
      })();

      this.innings_no = 1;

      this.batting_team = Settings.settings.team_batting_first.home_away;
    };

    return Innings;
  }
]);
