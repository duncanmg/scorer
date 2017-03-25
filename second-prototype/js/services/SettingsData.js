/**
 * @class SettingsData
 * @memberOf scorer.factory
 * A SettingsData object with default values.
 */
angular.module("scorer").factory('SettingsData', [ function() {

      return function() {
        this.match_type= {
          id: 1,
          name: 'Limited Overs'
        };
        this.match_types= [{
          id: 1,
          name: 'Limited Overs'
        }, {
          id: 2,
          name: 'Timed'
        }, {
          id: 3,
          name: 'Pairs'
        }];
        this.num_overs= 40;
        this.num_innings= 2;
        this.home_team= {
          id: 1,
          name: 'Home Team',
          home_away: 'home'
        };
        this.away_team= {
          id: 2,
          name: 'Away Team',
          home_away: 'away'
        };
        this.team_batting_first= {
          id: 1,
          name: 'Home Team',
          home_away: 'home'
        };
      };
}]);
