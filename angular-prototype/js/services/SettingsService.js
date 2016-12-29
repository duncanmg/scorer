angular.module("scorer").factory('Settings', ['Storage', '$rootScope', function(Storage, $rootScope) {

  var get_settings = function() {
    var settings = Storage.get('settings');

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
        num_innings: 1,
        home_team: {
          id: 1,
          name: 'England'
        },
        away_team: {
          id: 2,
          name: 'Australia'
        },
        team_batting_first: {
          id: 1,
          name: 'England'
        }
      };
    }
    return settings;
  };

  var obj = {
    'settings': {},
    'reset': function() {
      this.settings = get_settings();
    },
    'accept': function() {
      Storage.put('settings', this.settings);
      $rootScope.$broadcast('settings_changed', this.settings );
      alert(9);
    }
  };

  obj.reset();
  return obj;
}]);
