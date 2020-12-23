
// Transpiled from ES6 by gulp

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Demo module. Can be deleted at some point. May need to delete corresponding .js file as well.
var Car = function Car(name, year) {
  "use strict";

  _classCallCheck(this, Car);

  this.name = name;
  this.year = year;
};

var prius = new Car('Prius', 2020);