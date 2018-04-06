/**
 *

 */
angular.module("scorer").factory('BallManager', ['Ball', function(Ball) {

  /** Creates an instance of BallManager
   *
   * @class BallManager
   * @memberOf scorer.factory
   * @constructor BallManager
   * @param {Match} match - The Match object.
   * @return {BallManager} The new BallManager object.
   * @description - Handles changing the score, changing batsmen, changing ends.
   */
  var BallManager = function(match) {

     this.match = match;

  };

  return Ball;
}]);
