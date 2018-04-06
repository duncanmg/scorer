/**
 * @class Storage
 * @memberOf scorer.factory
 * @description The class which handles the storage currently just uses the browser
 *     session storage which is cleared when the browser is closed.
 *     It will need to be extended to access a database and possibly synchronize
 *     remote and local storage.
 */
angular.module("scorer").factory('Storage', [function() {

  return function() {

    // Private function.
    var get = function(key) {
      var value;
      try {
        value = JSON.parse(sessionStorage[key]);
        return value;
      } catch (e) {
        return false;
      }
    };

    // Private function.
    var put = function(key, value) {
      sessionStorage[key] = JSON.stringify(value);
      return true;
    };

    /**
     * @function get_match
     * @memberOf scorer.factory.Storage
     * @param {integer} match_id - Unique identifier of the match.
     */
    this.get_match = function(match_id) {
      return this.get(match_id);
    };

    /**
     * @function put_match
     * @memberOf scorer.factory.Storage
     * @param {integer} match_id - Unique identifier of the match.
     * @param {MatchData} match - The MatchData object.
     */
    this.put_match = function(match_id, match) {
      this.put(match_id, match);
      return true;
    };

    /**
     * @function get_team
     * @memberOf scorer.factory.Storage
     * @param {integer} team_id - Unique identifier of the team.
     */
    this.get_team = function(team_id) {
      return this.get(team_id);
    };

    /**
     * @function put_team
     * @memberOf scorer.factory.Storage
     * @param {integer} team_id - Unique identifier of the team.
     * @param {TeamData} match_id - The TeamData object.
     */
    this.put_team = function(team_id, team) {
      this.put(team_id, team);
      return true;
    };

    /**
     * @function get_settings
     * @memberOf scorer.factory.Storage
     * @param {integer} match_id - Unique identifier of the set of settings.
     */
    this.get_settings = function(settings_id) {
      return this.get(settings_id);
    };

    /**
     * @function put_settings
     * @memberOf scorer.factory.Storage
     * @param {integer} settings_id - Unique identifier of the set of settings.
     * @param {SettingsData} match_id - The SettingsData object.
     */
    this.put_settings = function(settings_id, settings) {
      this.put(settings_id, settings);
      return true;
    };

    this.get = get;
    this.put = put;

    this.get_scoreboard = function() {
      return this.get('scoreboard');
    };


  };

}]);
