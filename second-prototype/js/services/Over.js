angular.module("scorer").factory('Over', [function() {
/** Creates an instance of Over
 *
 * @class Over
 * @memberOf scorer.factory
 * @constructor Over
 * @over {Over}
 * @param {integer} over_no - The over number.
 * @param {integer} bowler_no - The number of the bowler
 * @return {Over} The new Over Object.
 *
 * @property bowler_obj
 * @property over_no
 * @property balls
 * @property valid_balls - Number of valid balls bowled.
 * @property total_balls - Number of balls bowled including extras.
 * @property add_ball - Add a ball this.add_ball(striker, runs, extras, wkt, valid)
 */
var Over = function(over_no, bowler_obj) {
  /** @property over_no */
  this.over_no = over_no;
  this.bowler = jQuery.extend({}, bowler_obj); // Shallow copy / clone.
  this.balls = [];
  if (!over_no || !bowler_obj) {
    throw "Over object requires over_no and bowler_obj";
  }
  this.valid_balls = 0;
  this.total_balls = 0;
};

return Over;

}]);
