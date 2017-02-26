/**
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
