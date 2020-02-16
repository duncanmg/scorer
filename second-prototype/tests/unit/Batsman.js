describe("BatsmanTest", function() {
  beforeEach(module('scorer'));

  var batsman;

  beforeEach(inject(function(Batsman) {
    batsman = new Batsman();
  }));

  it("A batsman object can be created.", function() {
    expect(batsman.no).toEqual(0);
    expect(batsman.striker).toEqual(false);
    expect(batsman.runs).toEqual(0);
    expect(batsman.bowler).toEqual(false);
    expect(batsman.bowling).toEqual(false);
  });

  it("A batsman object have its attributes changed.", function() {
    batsman.no = 1;
    batsman.striker = true;
    batsman.runs = 5;
    batsman.bowler = true;
    batsman.bowling = true;

    expect(batsman.no).toEqual(1);
    expect(batsman.striker).toEqual(true);
    expect(batsman.runs).toEqual(5);
    expect(batsman.bowler).toEqual(true);
    expect(batsman.bowling).toEqual(true);
  });
});
