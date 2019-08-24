describe("ByeTest", function() {

  beforeEach(module('scorer'));

  var bye;
  var scoreboard;

  beforeEach(module(function($provide) {
    // console.log('provide');
    $provide.factory('Scoreboard', function() {
      var obj = function() {
        this.extras = 0;
        this.total = 0;
        this.balls = 2;
        this.overs_history = [];
        this.left_bat = {};
        this.right_bat = {};
        this.left_bat.striker = false;
        this.add_ball = function(striker, runs, extras, wkt, valid) {
          return true;
        };
        this.change_ends = function(runs) {
          return true;
        };
      };
      return obj;
    });
  }));

  beforeEach(inject(function(Bye, Scoreboard) {
    // console.log('inject');
    bye = new Bye();
    scoreboard = new Scoreboard();
  }));

  it("A Bye object can be created.", function() {
    expect(typeof(bye)).toEqual('object');
  });

  it("The record method works.", function() {
    // alert(ball);
    expect(typeof(bye)).toEqual('object');
    bye.record(scoreboard, {});
    expect(scoreboard.total).toEqual(1);
    expect(scoreboard.extras).toEqual(1);
    expect(scoreboard.balls).toEqual(3);
  });

});
