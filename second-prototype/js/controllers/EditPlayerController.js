/**
 * @class EditPlayerController
 * @memberOf scorer.controller
 */
angular.module('scorer')
  .controller('EditPlayerController',
    ['$scope', '$stateParams', '$state', 'Scoreboard', 'Sc', 'Players', 'team', 'Storage',
      function($scope, $stateParams, $state, Scoreboard, Sc, Players, team, Storage) {
        'use strict';

        $scope.playerId = $stateParams.playerId;
        $scope.team = $stateParams.team;

        var players = Players.players;
        for (var i = 0; i < players.length; i++) {
          //alert(players[i].id + ' == ' + $scope.playerId);
          if (players[i].id == $scope.playerId) {
            $scope.player = players[i];
            break;
          }
        }

        $scope.toggle_bowling = function(player) {
          console.log('toggle_bowling');
          // console.log(JSON.stringify(Scoreboard.scoreboard));
          console.log('player=' + JSON.stringify(player));
          if (player.bowling) {
            console.log('About to call stop bowling');
            Sc.Commands.Run(Sc.Commands.StopBowling, [Scoreboard.scoreboard, player]);
            player.bowling = false;
          } else {
            console.log('About to call start_bowling');
            if (!Sc.Commands.Run(Sc.Commands.StartBowling, [Scoreboard.scoreboard, player])) {
              alert("You already have two bowlers");
              return false;
            }
            player.bowling = true;
          }
          console.log('End toggle_bowling: ' + JSON.stringify(Scoreboard.scoreboard.away_players));
          console.log('player=' + JSON.stringify(player));
          return true;
        };

        $scope.accept = function(player) {
          console.log('accept');
          Sc.Commands.Run(Sc.Commands.ModifyPlayerDetails, [Scoreboard.scoreboard, player])
          var storage = new Storage();
          storage.put_scoreboard(Scoreboard.scoreboard);
          $state.go('players', {
            team: $scope.team
          });
        };

        $scope.reject = function() {
          Players.reset();
          $state.go('players', {
            team: $scope.team
          });
        };

      }
    ]);
