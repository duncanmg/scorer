describe("Errors", function() {

beforeEach(module("scorer"));

it("InvalidParamError constructor", function() {

  var e = new sc.InvalidParamError('test1');

  expect(e).toBeDefined();

  expect(e.message).toBe('InvalidParamError test1');
});

it("InvalidParamError", function() {
  expect(function() {
    throw new sc.InvalidParamError('test');
  }).toThrow(new Error("InvalidParamError test"));
});

it("MissingParamError constructor", function() {

  var e = new sc.MissingParamError('test1');

  expect(e).toBeDefined();

  expect(e.message).toBe('MissingParamError test1');
});

it("MissingParamError", function() {
  expect(function() {
    throw new sc.MissingParamError('test');
  }).toThrow(new Error("MissingParamError test"));
});
});
