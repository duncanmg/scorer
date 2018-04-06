/**
 * @class Settings
 * @memberOf scorer.factory
 */
angular.module("scorer").factory('Settings', ['Storage', '$rootScope', function(Storage, $rootScope) {

  var get_settings = function() {
    var storage = new Storage();
    var settings = storage.get('settings');

    if (!settings) {
      settings = {
        match_type: {
          id: 1,
          name: 'Limited Overs'
        },
        match_types: [{
          id: 1,
          name: 'Limited Overs'
        }, {
          id: 2,
          name: 'Timed'
        }, {
          id: 3,
          name: 'Pairs'
        }],
        num_overs: 40,
        num_innings: 2,
        home_team: {
          id: 1,
          name: 'Home Team',
          home_away: 'home'
        },
        away_team: {
          id: 2,
          name: 'Away Team',
          home_away: 'away'
        },
        team_batting_first: {
          id: 1,
          name: 'Home Team',
          home_away: 'home'
        }
      };
    }
    return settings;
  };

  var obj = {
    'settings': {},
    'reset': function() {
      this.settings = get_settings();
      $rootScope.$broadcast('settings_changed', this.settings);
    },
    'accept': function() {
      storage.put('settings', this.settings);
      $rootScope.$broadcast('settings_changed', this.settings);
      // alert(9);
    }
  };

  obj.reset();
  return obj;
}]);
