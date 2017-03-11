
angular.module("scorer").factory('Batsman', [function() {

  /**
   * Creates an instance of Batsman
   *
   * @class Batsman
   * @memberOf scorer.factory
   * @constructor Batsman
   * @this {Batsman}
   * @property {integer} no
   * @property {boolean} striker
   * @property {integer} runs
   * @property {boolean} bowler
   * @property {boolean} bowling
   *
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
