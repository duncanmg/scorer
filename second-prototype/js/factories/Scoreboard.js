/**
 * @class Scoreboard
 * @memberOf scorer.factory
 * @description Factory which returns an Sc.Scoreboard object.
 *
 */
angular.module("scorer").factory('Scoreboard', ['Sc', 'Storage', 'Settings', '$rootScope',
  'Players', 'Over', 'Batsman', 'Ball', 'ScoreboardTemplate',
  function(Sc, Storage, Settings, $rootScope, Players, Over, Batsman, Ball,
    ScoreboardTemplate) {

    // var delivery_manager = new DeliveryManager();
    var storage = new Storage();
    var stored_scoreboard = storage.get_scoreboard();
    console.log(JSON.stringify(ScoreboardTemplate));
    console.log(JSON.stringify('In Scoreboard, Players=' +
      JSON.stringify(Players)));

    var initial_scoreboard = new ScoreboardTemplate(Settings);
    if (!stored_scoreboard) {
      console.log("Initialise");
      // storage.get_scoreboard(initial_scoreboard); // ?? What's this.
      console.log("Initial Scoreboard: " + JSON.stringify(initial_scoreboard));
    }
    else {
      initial_scoreboard.innings[0] = stored_scoreboard;
      console.log('No need to initialise. Using stored scoreboard.');
      console.log("Scoreboard from storage: " + JSON.stringify(initial_scoreboard));
    }

    var s = new Sc.Scoreboard(initial_scoreboard, Players, Over, Storage);

    storage.put_scoreboard(s.scoreboard);

    $rootScope.$on('settings_changed', function(event, args) {
      s.scoreboard.num_overs = args.num_overs;
      s.set_batting_team(args.team_batting_first.home_away);
    });

    return s;
  }
]);
