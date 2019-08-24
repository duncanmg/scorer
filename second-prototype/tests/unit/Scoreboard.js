describe("ScoreboardTest", function() {
  beforeEach(module('scorer'));

  var mockTemplate;
  var mockPlayers;

  beforeEach(module(function($provide) {

    $provide.factory('ScoreboardTemplate', function() {
      var mockTemplate = function() {

        this.innings = [{

          num_overs: 41,
          batting_team: 'home',
          bowling_team: 'away',
          overs_history: [],
          bowler: {
            id: 1
          }
        }, {}];
      };

      return mockTemplate;
    });
  }));

  beforeEach(inject(function(Scoreboard) {
    //console.log(JSON.stringify(MockSettings));
    scoreboard = Scoreboard;
  }));

  beforeEach(inject(function(Players) {
    // ....
  }));

  it("A Scoreboard object has been created.",
    function() {
      expect(typeof(scoreboard)).toEqual('object');
    });

  it("A Scoreboard object has some of the correct attributes.", function() {

    expect(scoreboard.scoreboard.num_overs).toEqual(41);
    expect(scoreboard.scoreboard.batting_team).toEqual("home");
    expect(scoreboard.scoreboard.overs_history.length).toEqual(0);
    expect(scoreboard.scoreboard.bowler.id).toEqual(1);
  });

  it("Scoreboard object.Set bowler details", function() {
    console.log('HP home_players ' + JSON.stringify(scoreboard.home_players));
    scoreboard.away_players = {
      get_bowling: function() {
        return [];
      }
    };
    scoreboard.home_players = {};
    scoreboard.set_bowler_details();

    //expect(typeof(scoreboard.away_players)).toEqual('object');
    //expect(this.scoreboard.bowler).toEqual({});
    //expect(this.scoreboard.next_bowler).toEqual(7);
  });

});
