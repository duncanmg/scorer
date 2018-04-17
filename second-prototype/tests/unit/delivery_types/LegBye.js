describe("LegByeTest", function() {

  beforeEach(module('scorer'));

  var leg_bye;
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

  beforeEach(inject(function(LegBye, Scoreboard) {
    // console.log('inject');
    leg_bye = new LegBye();
    scoreboard = new Scoreboard();
  }));

  it("A LegBye object can be created.", function() {
    expect(typeof(leg_bye)).toEqual('object');
  });

  it("The record method works.", function() {
    // alert(ball);
    expect(typeof(leg_bye)).toEqual('object');
    leg_bye.record(scoreboard, {});
    expect(scoreboard.total).toEqual(1);
    expect(scoreboard.extras).toEqual(1);
    expect(scoreboard.balls).toEqual(1);
  });

});
