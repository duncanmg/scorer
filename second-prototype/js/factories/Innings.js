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
