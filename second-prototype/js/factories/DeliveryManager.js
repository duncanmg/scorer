/**
 *

 */
angular.module("scorer").factory('DeliveryManager', ['DeliveryType', function(DeliveryType) {

  /** Creates an instance of DeliveryManager
   *
   * @class DeliveryManager
   * @memberOf scorer.factory
   * @classdesc - Handles changing the score, changing batsmen, changing ends.
   * @constructor DeliveryManager
   * @param {Match} match - The Match object.
   * @return {DeliveryManager} The new DeliveryManager object.
   * @description - Handles changing the score, changing batsmen, changing ends.
   */
  var DeliveryManager = function(DeliveryType) {

     this.deliveryType = new DeliveryType();

     /** @function bowls
      *  @memberOf scorer.factory.Scoreboard
      *  @return {boolean}
      */
     this.bowls = function(deliveryType, runs) {

       if (this.alert_game_over()) {
         return false;
       }

       if (this.alert_no_bowler()) {
         return false;
       }

       this.deliveryType(deliveryType).record(runs);

       this.over();

       this.set_game_over();

       this.save();
     };


  };

  return DeliveryManager;
}]);
