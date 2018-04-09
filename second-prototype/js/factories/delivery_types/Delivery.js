angular.module("scorer").factory('Delivery', [
  function() {

    /** Creates an instance of Delivery
     *
    * @class Delivery
       * @memberOf scorer.factory.DeliveryType
      * @classdesc - Returns an instance of a correct delivery class..
      * @constructor Delivery

      * @return {Delivery}
      * @description -
      */
    var Delivery = function() {

      /**
       * @function record
       * @memberOf scorer.factory.DeliveryType.Delivery
       * @param {Scoreboard} The scoreboard
       * @param type
       */
      this.record = function(scoreboard, details) {
        scoreboard.ball(runs);
        scoreboard.change_ends(runs);
      };

    };

    return Delivery;
  }
]);
