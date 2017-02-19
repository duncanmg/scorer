/**
 * @name Ball
 * @class
 */
angular.module("scorer").factory('Ball', [function() {

  /** Creates an instance of Ball
   *
   * @constructor Ball
   * @ball {Ball}
   * @param {Batsman} striker - The batsman who was on strike.
   * @param {integer} runs - The number runs scored off the bat.
   * @param {integer} extras - The number of extras.
   * @param {integer} wkt - Was a wicket taken? 1 = Yes, 0 = No
   * @param {integer} valid = Was the ball valid? 1 = Yes, 0 = No.
   * @return {Ball} The new Ball object.
   *
   * @property striker
   * @property runs
   * @property extras
   * @property wkt
   * @property valid
   */
  var Ball = function(striker, runs, extras, wkt, valid) {
    //alert('Bang '+JSON.stringify(arguments));
    if (typeof(striker) === 'undefined' || typeof(runs) === 'undefined' ||
      typeof(extras) === 'undefined' || typeof(wkt) === 'undefined' ||
      typeof(valid) === 'undefined') {
      alert("Ball requires 5 parameters");
      return false;
    }
    if (typeof(striker) != 'object') {
      alert("Striker must be a Batman object.");
      return false;
    }
    this.striker = jQuery.extend(true, {}, striker);
    this.runs = runs;
    this.extras = extras;
    this.wkt = wkt;
    this.valid = valid;
  };

  return Ball;
}]);
