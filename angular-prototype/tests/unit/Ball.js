describe("BallTest", function() {
  beforeEach(module('scorer'));

  var ball;

  //beforeEach(function() {
  //module('Ball');
  //});

  beforeEach(inject(function(Ball) {
    ball = new Ball(1, 2, 3, 4, 5);
  }));

  it("A ball object can be created.", function() {
    alert(ball);
    //expect(ball.striker).toEqual(1);
    expect(ball.runs).toEqual(2);
    expect(ball.extras).toEqual(3);
    expect(ball.wkt).toEqual(4);
    expect(ball.valid).toEqual(5);
    expect(1).toEqual(1);
  });
  it("does something cleverer", function() {
    expect(1 + 1).toEqual(2);
  });
});
