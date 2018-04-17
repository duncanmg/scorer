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
        console.log("record wicket");
        this.wwicket(scoreboard,details);
      };

      this.wwicket = function(scoreboard, details) {
        console.log("wicket.wicket");
        scoreboard.balls++;
        scoreboard.wickets += 1;

        scoreboard.add_ball(scoreboard.left_bat.striker ? scoreboard.left_bat :
          scoreboard.right_bat, 0, 0, true, true);
        // var next_batsman_no = (scoreboard.left_bat.no > scoreboard.right_bat.no) ?
        //   scoreboard.left_bat.no + 1 :
        //   scoreboard.right_bat.no + 1;
        //
        // if (scoreboard.left_bat.striker === true) {
        //   scoreboard.left_bat = new Batsman();
        //   scoreboard.left_bat.no = next_batsman_no;
        //   scoreboard.left_bat.striker = true;
        //
        // } else {
        //   scoreboard.right_bat = new Batsman();
        //   scoreboard.right_bat.no = next_batsman_no;
        //   scoreboard.right_bat.striker = true;
        // }
      };


    };

    return Wicket;
  }
]);
