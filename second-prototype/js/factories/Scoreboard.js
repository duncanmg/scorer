angular.module("scorer").factory('Scoreboard', ['Sc', 'Storage', 'Settings', '$rootScope',
  'Players', 'Over', 'Batsman', 'Ball', 'ScoreboardTemplate',
  function(Sc, Storage, Settings, $rootScope, Players, Over, Batsman, Ball,
    ScoreboardTemplate) {

    // var delivery_manager = new DeliveryManager();
    var storage = new Storage();
    var initial_scoreboard = storage.get_scoreboard();
    console.log(JSON.stringify(ScoreboardTemplate));
    console.log(JSON.stringify('In Scoreboard, Players=' +
      JSON.stringify(Players)));

    if (!initial_scoreboard) {
      console.log("Initialise");
      initial_scoreboard = new ScoreboardTemplate(Settings);
      initial_scoreboard.fred = 1;
    }



    console.log("Initial Scoreboard: " + JSON.stringify(initial_scoreboard));

    var s = new Sc.Scoreboard(initial_scoreboard, Players);

    $rootScope.$on('settings_changed', function(event, args) {
      s.scoreboard.num_overs = args.num_overs;
      s.set_batting_team(args.team_batting_first.home_away);
    });

    return s;
  }
]);
