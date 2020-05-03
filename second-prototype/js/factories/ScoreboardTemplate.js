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
