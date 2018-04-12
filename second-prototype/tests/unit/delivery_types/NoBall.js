describe("NoBallTest", function() {

  beforeEach(module('scorer'));

  var no_ball;
  var scoreboard;

  beforeEach(module(function($provide) {
    console.log('provide');
    $provide.factory('Scoreboard', function() {
      var obj = function() {
        this.extras = 0;
        this.total = 0;
        this.balls = [];
        this.left_bat = {};
        this.right_bat = {};
        this.left_bat.striker = false;
        this.add_ball = function(ball) {
           this.balls.push(ball);
        };
      };
      return obj;
    });
  }));

  beforeEach(inject(function(NoBall, Scoreboard) {
    console.log('inject');
    no_ball = new NoBall();
    scoreboard = new Scoreboard();
  }));

  it("A NoBall object can be created.", function() {
    expect(typeof(no_ball)).toEqual('object');
  });

  it("The record method works.", function() {
    // alert(ball);
    expect(typeof(no_ball)).toEqual('object');
    no_ball.record(scoreboard, {});
    expect(scoreboard.total).toEqual(1);
    expect(scoreboard.extras).toEqual(1);
    expect(scoreboard.balls.length).toEqual(1);
  });

});
