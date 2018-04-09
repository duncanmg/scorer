angular.module("scorer").factory('Wide', [
  function() {

    /** Creates an instance of Wide
     *
    * @class Wide
       * @memberOf scorer.factory.DeliveryType
      * @classdesc - Returns an instance of a correct delivery class..
      * @constructor Wide

      * @return {Wide}
      * @description -
      */
    var Wide = function() {

      /**
       * @function record
       * @memberOf scorer.factory.DeliveryType.Wide
       * @param {Scoreboard} The scoreboard
       * @param type
       */
      this.record = function(scoreboard, details) {
        scoreboard.extras += 1;
        scoreboard.total += 1;
        scoreboard.add_ball(scoreboard.left_bat.striker
          ? scoreboard.left_bat
          : scoreboard.right_bat, 0, 1, false, false);

      };

    };

    return Wide;
  }
]);
