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
