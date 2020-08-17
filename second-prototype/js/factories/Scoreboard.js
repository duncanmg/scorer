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
