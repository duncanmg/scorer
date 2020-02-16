describe("StorageTest", function() {
  beforeEach(module('scorer'));

  var storage;
  var key = 'abc';

  beforeEach(module(function($provide) {

  }));

  beforeEach(inject(function(Storage) {
    storage = new Storage();
  }));

  it("A Storage object has been created.",
    function() {
      expect(typeof(storage)).toEqual('object');
    });

  it("A Storage object can put and get an object.", function() {

    expect(key).toEqual('abc');

    storage.put(key, {
      one: 1,
      two: 2
    });

    expect(storage.get(key).one).toEqual(1);
    expect(storage.get(key).two).toEqual(2);
  });

});
