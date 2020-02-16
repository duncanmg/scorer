angular.module("scorer").factory('NoBall', [
  function() {

    /** Creates an instance of NoBall
     *
    * @class NoBall
      * @memberOf scorer.factory.DeliveryType
      * @classdesc - Returns an instance of a correct delivery class..
      * @constructor NoBall

      * @return {NoBall}
      * @description -
      */
    var NoBall = function() {

      /**
       * @function record
       * @memberOf scorer.factory.DeliveryType.NoBall
       * @param {Scoreboard} The scoreboard
       * @param type
       */
      this.record = function(scoreboard, details) {
        scoreboard.extras += 1;
        scoreboard.total += 1;
        scoreboard.add_ball(scoreboard.left_bat.striker ?
          scoreboard.left_bat :
          scoreboard.right_bat, 0, 1, false, false);

      };

    };

    return NoBall;
  }
]);
