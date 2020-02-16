describe("DeliveryTest", function() {

  beforeEach(module('scorer'));

  var delivery;
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
        this.add_runs_to_striker = function(runs) {
          return true;
        };
      };
      return obj;
    });
  }));

  beforeEach(inject(function(Delivery, Scoreboard) {
    // console.log('inject');
    delivery = new Delivery();
    scoreboard = new Scoreboard();
  }));

  it("A Delivery object can be created.", function() {
    expect(typeof(delivery)).toEqual('object');
  });

  it("The record method works.", function() {
    // alert(ball);
    expect(typeof(delivery)).toEqual('object');
    console.log("delivery.record");
    delivery.record(scoreboard, {
      runs: 1
    });
    expect(scoreboard.total).toEqual(1);
    expect(scoreboard.extras).toEqual(0);
    expect(scoreboard.balls).toEqual(1);
    expect(scoreboard.wickets).toEqual(0);
  });

});
