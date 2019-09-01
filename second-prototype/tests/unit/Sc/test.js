

describe("A suite is just a function", function() {
  var a;

  it("and so is a spec", function() {
    a = true;

    expect(a).toBe(true);
  });

  it("Test sc", function() {

    var sc = window.sc;

    expect(sc).toBeDefined();
    expect(sc.test()).toEqual('test');

    var o = new window.sc.test_object();
    expect(o.msg()).toEqual('test_object');
  });
});
    


