describe("ScTest", function() {
  beforeEach(module('scorer'));

  var sc;

  beforeEach(inject(function(Sc) {
    sc = Sc;
  }));

  it("Sc is available", function() {

    expect(typeof(sc)).toEqual('object');
    expect(sc.test).toBeDefined();
    expect(sc.test()).toEqual('test');
  });

  it("Sc can contain objects", function() {

    expect(typeof(sc)).toEqual('object');
    expect(sc.test_object).toBeDefined();

    var o = new sc.test_object();
    expect(o.msg()).toEqual('test_object');
  });

});
