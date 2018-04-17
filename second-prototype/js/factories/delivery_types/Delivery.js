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
        //console.log("OK 1");
        this.ball(scoreboard,details.runs);
        //console.log("OK 2");
        scoreboard.change_ends(details.runs);
      };

      this.ball = function(scoreboard, runs) {
        //console.log("ok   xx");
        scoreboard.total += runs;
        scoreboard.balls++;

        //console.log("OK 1.1");
        scoreboard.add_runs_to_striker( runs);

        scoreboard.add_ball(scoreboard.left_bat.striker ? scoreboard.left_bat
          : scoreboard.right_bat, runs, 0, false, true);

      };



    };

    return Delivery;
  }
]);
