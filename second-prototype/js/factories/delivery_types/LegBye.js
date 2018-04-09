angular.module("scorer").factory('LegBye', [
  function() {

    /** Creates an instance of LegBye
     *
    * @class LegBye
       * @memberOf scorer.factory.DeliveryType
      * @classdesc - Returns an instance of a correct delivery class..
      * @constructor LegBye

      * @return {LegBye}
      * @description -
      */
    var LegBye = function() {

      /**
       * @function record
       * @memberOf scorer.factory.DeliveryType.LegBye
       * @param {Scoreboard} The scoreboard
       * @param type
       */
      this.record = function(scoreboard, details) {
        scoreboard.balls += 1;
        scoreboard.add_ball(scoreboard.left_bat.striker ?
          scoreboard.left_bat : scoreboard.right_bat, 0, 1, false, true);
        scoreboard.change_ends(1);
        scoreboard.extras += 1;
        scoreboard.total += 1;
      };

    };

    return LegBye;
  }
]);
