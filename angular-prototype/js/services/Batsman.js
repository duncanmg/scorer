/**
 * @name Batsman
 * @class
 */
angular.module("scorer").factory('Batsman', [function() {

  /**
   * Creates an instance of Batsman
   *
   * @constructor Batsman
   * @this {Batsman}
   * @return {Batsman} The new Batsman object.
   */
  var Batsman = function() {
    this.no = 0;
    this.striker = false;
    this.runs = 0;
    this.bowler = false;
    this.bowling = false;
  };

  return Batsman;
}]);
