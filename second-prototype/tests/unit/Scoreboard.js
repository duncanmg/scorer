describe("ScoreboardTest", function() {
  beforeEach(module('scorer'));

  var mockTemplate;

  beforeEach(module(function($provide) {
    mockTemplate = {
      num_overs: 40,
      batting_team: {
        id: 1
      },
      bowling_team: {
        id: 2
      }
    };
  }));

  beforeEach(inject(function(Scoreboard) {
    //console.log(JSON.stringify(MockSettings));
    scoreboard = Scoreboard;
  }));

  it("A Scoreboard object has been created.",
    function() {
      expect(typeof(scoreboard)).toEqual('object');
    });

  it("A Scoreboard object has some of the correct attributes.", function() {
    //console.log(JSON.stringify(scoreboard.scoreboard));
    expect(scoreboard.scoreboard.num_overs).toEqual(40);
    expect(scoreboard.scoreboard.batting_team).toEqual("home");
    expect(scoreboard.scoreboard.overs_history.length).toEqual(0);

  });

  it("Scoreboard object.Set bowler details", function() {
    // expect(typeof(scoreboard.away_players)).toEqual('object');
    // expect(scoreboard.set_bowler_details()).toEqual(7);
  });

});
