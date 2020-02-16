describe("WicketTest", function() {

  beforeEach(module('scorer'));

  var wicket;
  var scoreboard;

  beforeEach(module(function($provide) {
    // console.log('provide');
    $provide.factory('Scoreboard', function() {
      var obj = function() {
        this.extras = 0;
        this.total = 0;
        this.balls = 0;
        this.overs_history = [];
        this.left_bat = {};
        this.right_bat = {};
        this.wickets = 0;
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

  beforeEach(inject(function(Wicket, Scoreboard) {
    // console.log('inject');
    wicket = new Wicket();
    scoreboard = new Scoreboard();
  }));

  it("A Wicket object can be created.", function() {
    expect(typeof(wicket)).toEqual('object');
  });

  it("The record method works.", function() {
    // alert(ball);
    expect(typeof(wicket)).toEqual('object');
    wicket.record(scoreboard, {});
    expect(scoreboard.total).toEqual(0);
    expect(scoreboard.extras).toEqual(0);
    expect(scoreboard.balls).toEqual(1);
    expect(scoreboard.wickets).toEqual(1);
  });

});
