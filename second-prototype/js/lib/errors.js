// class InvalidParamError extends Error {
//   constructor(message) {
//     super(message); // (1)
//     this.name = "InvalidParamError"; // (2)
//   }
// }
//
// class MissingParamError extends Error {
//   constructor(message) {
//     super(message); // (1)
//     this.name = "MissingParamError"; // (2)
//   }
// }

// define([], function() {
//   console.log('Creating a new scoreboard module');
//
//   function addResult(newResult) {
//     return;
//   }
//
//   function updateScoreboard() {
//   return;
//   }
//   return {
//     addResult: addResult,
//     updateScoreboard: updateScoreboard
//   }
//});

var sc = sc || {};

// https://stackoverflow.com/questions/1382107/whats-a-good-way-to-extend-error-in-javascript

// There's something odd about custom errors in ES5. Gave up.

// These just add a prefix.

sc.InvalidParamError = function(msg) {
  return new Error('InvalidParamError ' + msg);
};

sc.MissingParamError = function(msg) {
  return new Error('MissingParamError ' + msg);
};
