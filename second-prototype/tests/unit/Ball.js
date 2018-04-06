describe("BallTest", function() {
  beforeEach(module('scorer'));

  var ball;
  var mockBatsman;

  beforeEach(module(function($provide) {
    mockBatsman = {
      no: 99
    };
  }));

  beforeEach(inject(function(Ball) {
    ball = new Ball(mockBatsman, 2, 3, 4, 5);
  }));

  it("A ball object can be created.", function() {
    // alert(ball);
    expect(typeof(ball.striker)).toEqual('object');
    expect(ball.striker.no).toEqual(99);
    expect(ball.runs).toEqual(2);
    expect(ball.extras).toEqual(3);
    expect(ball.wkt).toEqual(4);
    expect(ball.valid).toEqual(5);
    //expect(1).toEqual(1);
  });

});
