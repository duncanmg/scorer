/**
 * @class ScoreboardTemplate
 * @memberOf scorer.factory
 */
angular.module("scorer").factory('ScoreboardTemplate', ['Settings', 'Innings',
  function(Settings, Innings) {

    var obj = function() {
      this.innings = [];

      console.log("settings: " + JSON.stringify(Settings));
      var innings = Innings;
      for (var i = 0; i < Settings.settings.num_innings; i++) {
        this.innings.push(new innings(Settings));
      }
    };
    return obj;
  }
]);
