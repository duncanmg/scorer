/**
 *
 * https://www.jvandemo.com/how-to-properly-integrate-non-angularjs-libraries-in-your-angularjs-application/
 */

angular.module("scorer").factory('Sc', ['$window', function($window) {

  /** Creates an instance of Sc
   *
   * @class Sc
   * @memberOf scorer.factory
   * @description Factory which returns an Sc object. Properly integrates
   * lib/sc.js
   * @constructor Sc
   */

  if (window.sc) {
    return window.sc;
  } else {
    console.log('ERROR window.sc is not available.');
  }

}]);
