describe("OverTest", function() {
  beforeEach(module('scorer'));

  var over;
  var mockBowler;
  var mockBall;

  beforeEach(module(function($provide) {
    mockBowler = {
      no: 50
    };
    mockBall = {
      runs: 2
    };
  }));

  beforeEach(inject(function(Over) {
    over = new Over(7, mockBowler);
  }));

  it("An Over object can be created.", function() {
    expect(typeof(over.bowler)).toEqual('object');
    expect(over.bowler.no).toEqual(50);
    expect(over.over_no).toEqual(7);
    expect(over.balls.length).toEqual(0);
    expect(over.valid_balls).toEqual(0);
    expect(over.total_balls).toEqual(0);
  });

  it("The attributes of an Over object can be set and got.", function() {
    over.balls.push(mockBall);
    over.valid_balls += 1;
    over.total_balls += 2;
    expect(over.balls.length).toEqual(1);
    expect(over.valid_balls).toEqual(1);
    expect(over.total_balls).toEqual(2);
  });

});
