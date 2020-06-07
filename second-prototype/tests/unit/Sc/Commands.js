describe("ScCommandsTest. Real Template", function() {
  beforeEach(module("scorer"));

  var sc;
  var sc2;
  var template;
  var players;
  var over;
  var storage;

  beforeEach(
    inject(function(Players) {
      players = {};
    })
  );

  beforeEach(
    inject(function(ScoreboardTemplate) {
      template = new ScoreboardTemplate();
    })
  );

  beforeEach(
    inject(function(Sc) {
      sc = Sc;
    })
  );

  beforeEach(
    inject(function(Over) {
      over = Over;
    })
  );

  beforeEach(
    inject(function(Storage) {
      storage = Storage;
    })
  );

  beforeEach(
    inject(function(Sc) {
      sc.LoggerConfig = {};
      sc2 = new Sc.Scoreboard(template, players, over, storage);
    })
  );

  it("An Sc.Commands.Wicket", function() {
    sc2.scoreboard.bowler = sc.Utils.clone(sc2.scoreboard.templates.Bowler);
    expect(typeof sc2).toEqual("object");

    sc2.scoreboard.left_bat = sc.Utils.clone(sc2.scoreboard.templates.Batsman);

    expect(sc2.scoreboard.wickets).toEqual(0);
    expect(sc2.scoreboard.balls).toEqual(0);

    sc2.wicket();
    expect(sc2.scoreboard.wickets).toEqual(1);
    expect(sc2.scoreboard.balls).toEqual(1);
    expect(sc2.scoreboard.game_over).toEqual(false);
  });

  it("An Sc.Commands.Wicket method get_next_batsman_no", function() {
    sc2.scoreboard.bowler = sc.Utils.clone(sc2.scoreboard.templates.Bowler);
    expect(typeof sc2).toEqual("object");

    expect(sc2.scoreboard.left_bat.no).toEqual(1);
    expect(sc2.scoreboard.right_bat.no).toEqual(2);
    expect(sc2.scoreboard.next_batsman_no).toEqual(3);
    expect(sc2.scoreboard.left_bat.striker).toEqual(true);

    var command = new sc.Commands.Wicket(sc2.scoreboard);
    expect(command.get_next_batsman_no(sc2.scoreboard)).toEqual(3);
  });

  it("An Sc.Commands.Wicket get_next_batsman_no", function() {
    sc2.scoreboard.bowler = sc.Utils.clone(sc2.scoreboard.templates.Bowler);
    expect(typeof sc2).toEqual("object");

    expect(sc2.scoreboard.left_bat.no).toEqual(1);
    expect(sc2.scoreboard.right_bat.no).toEqual(2);
    expect(sc2.scoreboard.next_batsman_no).toEqual(3);
    expect(sc2.scoreboard.left_bat.striker).toEqual(true);
    sc2.wicket();
    expect(sc2.scoreboard.right_bat.no).toEqual(2);
    expect(sc2.scoreboard.left_bat.no).toEqual(3);
    expect(sc2.scoreboard.left_bat.striker).toEqual(true);
    expect(sc2.scoreboard.right_bat.striker).toEqual(false);
    expect(sc2.scoreboard.next_batsman_no).toEqual(4);
  });

  it("An Sc.Commands.Wicket two wickets", function() {
    //sc.LoggerConfig = {
    //  'Wicket': sc.LoggerLevels.DEBUG
    //};
    sc2.scoreboard.bowler = sc.Utils.clone(sc2.scoreboard.templates.Bowler);
    expect(typeof sc2).toEqual("object");

    expect(sc2.scoreboard.left_bat.no).toEqual(1);
    expect(sc2.scoreboard.right_bat.no).toEqual(2);
    expect(sc2.scoreboard.next_batsman_no).toEqual(3);
    expect(sc2.scoreboard.left_bat.striker).toEqual(true);
    sc2.wicket();
    expect(sc2.scoreboard.left_bat.no).toEqual(3);
    expect(sc2.scoreboard.next_batsman_no).toEqual(4);
    sc2.wicket();
    expect(sc2.scoreboard.right_bat.no).toEqual(2);
    expect(sc2.scoreboard.left_bat.no).toEqual(4);
    expect(sc2.scoreboard.left_bat.striker).toEqual(true);
    expect(sc2.scoreboard.right_bat.striker).toEqual(false);
    expect(sc2.scoreboard.next_batsman_no).toEqual(5);
  });

  it("An Sc.Commands.StandardBall change_ends", function() {
    sc2.scoreboard.bowler = sc.Utils.clone(sc2.scoreboard.templates.Bowler);
    expect(typeof sc2).toEqual("object");
    expect(sc2.scoreboard.left_bat.striker).toEqual(true);
    expect(sc2.scoreboard.right_bat.striker).toEqual(false);
    expect(sc2.scoreboard.left_bat.runs).toEqual(0);

    sc2.ball(3);

    expect(sc2.scoreboard.left_bat.striker).toEqual(false);
    expect(sc2.scoreboard.left_bat.runs).toEqual(3);
    expect(sc2.scoreboard.right_bat.striker).toEqual(true);
  });

  it("An Sc.Commands.StandardBall, change_ends, right bat is striker", function() {
    sc2.scoreboard.bowler = sc.Utils.clone(sc2.scoreboard.templates.Bowler);
    expect(typeof sc2).toEqual("object");

    sc2.ball(1);

    expect(sc2.scoreboard.left_bat.striker).toEqual(false);
    expect(sc2.scoreboard.right_bat.striker).toEqual(true);
    expect(sc2.scoreboard.left_bat.runs).toEqual(1);

    sc2.ball(3);

    expect(sc2.scoreboard.left_bat.striker).toEqual(true);
    expect(sc2.scoreboard.left_bat.runs).toEqual(1);
    expect(sc2.scoreboard.right_bat.striker).toEqual(false);
    expect(sc2.scoreboard.right_bat.runs).toEqual(3);
  });

  it("An Sc.Commands.StandardBall no change_ends", function() {
    sc2.scoreboard.bowler = sc.Utils.clone(sc2.scoreboard.templates.Bowler);
    expect(typeof sc2).toEqual("object");
    expect(sc2.scoreboard.left_bat.striker).toEqual(true);
    expect(sc2.scoreboard.right_bat.striker).toEqual(false);
    expect(sc2.scoreboard.left_bat.runs).toEqual(0);

    sc2.ball(4);

    expect(sc2.scoreboard.left_bat.striker).toEqual(true);
    expect(sc2.scoreboard.left_bat.runs).toEqual(4);
    expect(sc2.scoreboard.right_bat.striker).toEqual(false);
  });

  it("An Sc.Commands.Wide", function() {
    sc2.scoreboard.bowler = sc.Utils.clone(sc2.scoreboard.templates.Bowler);
    expect(typeof sc2).toEqual("object");
    expect(sc2.scoreboard.left_bat.striker).toEqual(true);
    expect(sc2.scoreboard.right_bat.striker).toEqual(false);
    expect(sc2.scoreboard.left_bat.runs).toEqual(0);
    expect(sc2.scoreboard.extras).toEqual(0);
    expect(sc2.scoreboard.total).toEqual(0);

    sc.Commands.Run(sc.Commands.Wide, sc2.scoreboard);

    expect(sc2.scoreboard.left_bat.striker).toEqual(true);
    expect(sc2.scoreboard.left_bat.runs).toEqual(0);
    expect(sc2.scoreboard.right_bat.striker).toEqual(false);
    expect(sc2.scoreboard.extras).toEqual(1);
    expect(sc2.scoreboard.total).toEqual(1);
  });

  it("An Sc.Commands.NoBall", function() {
    sc2.scoreboard.bowler = sc.Utils.clone(sc2.scoreboard.templates.Bowler);
    expect(typeof sc2).toEqual("object");
    expect(sc2.scoreboard.left_bat.striker).toEqual(true);
    expect(sc2.scoreboard.right_bat.striker).toEqual(false);
    expect(sc2.scoreboard.left_bat.runs).toEqual(0);
    expect(sc2.scoreboard.extras).toEqual(0);
    expect(sc2.scoreboard.total).toEqual(0);

    sc.Commands.Run(sc.Commands.NoBall, sc2.scoreboard);

    expect(sc2.scoreboard.left_bat.striker).toEqual(true);
    expect(sc2.scoreboard.left_bat.runs).toEqual(0);
    expect(sc2.scoreboard.right_bat.striker).toEqual(false);
    expect(sc2.scoreboard.extras).toEqual(1);
    expect(sc2.scoreboard.total).toEqual(1);
  });

  it("An Sc.Commands.Bye", function() {
    sc2.scoreboard.bowler = sc.Utils.clone(sc2.scoreboard.templates.Bowler);
    expect(typeof sc2).toEqual("object");
    expect(sc2.scoreboard.left_bat.striker).toEqual(true);
    expect(sc2.scoreboard.right_bat.striker).toEqual(false);
    expect(sc2.scoreboard.left_bat.runs).toEqual(0);
    expect(sc2.scoreboard.extras).toEqual(0);
    expect(sc2.scoreboard.total).toEqual(0);

    sc.Commands.Run(sc.Commands.Bye, sc2.scoreboard);

    expect(sc2.scoreboard.left_bat.striker).toEqual(false);
    expect(sc2.scoreboard.left_bat.runs).toEqual(0);
    expect(sc2.scoreboard.right_bat.striker).toEqual(true);
    expect(sc2.scoreboard.extras).toEqual(1);
    expect(sc2.scoreboard.total).toEqual(1);
  });

  it("An Sc.Commands.LegBye", function() {
    sc2.scoreboard.bowler = sc.Utils.clone(sc2.scoreboard.templates.Bowler);

    expect(typeof sc2).toEqual("object");
    expect(sc2.scoreboard.left_bat.striker).toEqual(true);
    expect(sc2.scoreboard.right_bat.striker).toEqual(false);
    expect(sc2.scoreboard.left_bat.runs).toEqual(0);
    expect(sc2.scoreboard.extras).toEqual(0);
    expect(sc2.scoreboard.total).toEqual(0);
    expect(sc2.scoreboard.overs_and_balls).toEqual(0);

    sc.Commands.Run(sc.Commands.LegBye, sc2.scoreboard);

    expect(sc2.scoreboard.left_bat.striker).toEqual(false);
    expect(sc2.scoreboard.left_bat.runs).toEqual(0);
    expect(sc2.scoreboard.right_bat.striker).toEqual(true);
    expect(sc2.scoreboard.extras).toEqual(1);
    expect(sc2.scoreboard.total).toEqual(1);
    expect(sc2.scoreboard.overs_and_balls).toEqual('0.1');
  });

  it("An Sc.Commands.StopBowling Parameters", function() {
    sc2.scoreboard.bowler = sc.Utils.clone(sc2.scoreboard.templates.Bowler);

    expect(typeof sc2).toEqual("object");

    expect(function() {
      sc.Commands.Run(sc.Commands.StopBowling)
    }).toThrow(
      new Error("StopBowling expects an array with two elements"));

    expect(function() {
      sc.Commands.Run(sc.Commands.StopBowling, [])
    }).toThrow(
      new Error("StopBowling expects an array with two elements"));

    expect(function() {
      sc.Commands.Run(sc.Commands.StopBowling, [{}, {}])
    }).toThrow(
      new Error("StopBowling. A mandatory parameter is missing: .data.away_players"));

  });

  it("An Sc.Commands.StopBowling", function() {

    sc.LoggerConfig = {
      'StopBowling': sc.LoggerLevels.DEBUG
    };

    sc2.scoreboard.bowler = sc.Utils.clone(sc2.scoreboard.templates.Bowler);

    expect(typeof sc2).toEqual("object");

    var bowler = {
      'id': 22,
      'no': 11,
      'striker': false,
      'runs': 0,
      'bowler': 1,
      'bowling': false
    };

    sc2.scoreboard.away_players = [{
        "no": 10,
        "striker": false,
        "runs": 0,
        "bowler": false,
        "bowling": false,
        "name": "Away Player 10",
        "id": 21,
        "batting_no": 10
      },
      {
        "no": 11,
        "striker": false,
        "runs": 0,
        "bowler": 1,
        "bowling": true,
        "name": "Away Player 11",
        "id": 22,
        "batting_no": 11
      }
    ];

    expect(sc2.scoreboard.away_players[1].bowling).toEqual(true);

    sc.Commands.Run(sc.Commands.StopBowling, [sc2.scoreboard, bowler]);

    expect(sc2.scoreboard.away_players[1].bowling).toEqual(false);
  });

});
