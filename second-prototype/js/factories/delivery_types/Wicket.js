angular.module("scorer").factory('Wicket', [
  function() {

    /** Creates an instance of Wicket
     *
    * @class Wicket
       * @memberOf scorer.factory.DeliveryType
      * @classdesc - Returns an instance of a correct delivery class..
      * @constructor Wicket

      * @return {Wicket}
      * @description -
      */
    var Wicket = function() {

      /**
       * @function record
       * @memberOf scorer.factory.DeliveryType.Wicket
       * @param {Scoreboard} The scoreboard
       * @param type
       */
      this.record = function(scoreboard, details) {
         scoreboard.wicket();
      };

    };

    return Wicket;
  }
]);
