/**
 * @name Storage
 * @class
 */
angular.module("scorer").factory('Storage', function() {

  return {
    get_scoreboard: function() {
      return this.get('scoreboard');
    },
    put_scoreboard: function(scoreboard) {
      this.put('scoreboard', scoreboard);
      return true;
    },
    get: function(key) {
      var value;
      try {
        value = JSON.parse(sessionStorage[key]);
        return value;
      } catch (e) {
        return false;
      }
    },
    put: function(key, value) {
      sessionStorage[key] = JSON.stringify(value);
      return true;
    }
  };

});
