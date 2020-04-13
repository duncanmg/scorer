describe("ScCommandsTest. Real Template", function() {
  beforeEach(module("scorer"));

  var sc;
  var template;
  var players;
  var over;

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

  it("Sc.Command set_innings_over", function() {
    sc2 = new sc.Scoreboard(template, players, over);
    expect(typeof sc2).toEqual("object");

    expect(sc2.scoreboard.innings_over).toEqual(false);
    expect(sc2.scoreboard.game_over).toEqual(false);

    sc2.scoreboard.wickets = 9;
    var o = new sc.Command();
    o.data = sc2.scoreboard;

    o.set_innings_over();
    expect(sc2.scoreboard.innings_over).toEqual(false);
    sc2.scoreboard.wickets = 10;
    o.set_innings_over();
    expect(sc2.scoreboard.innings_over).toEqual(true);
    expect(sc2.scoreboard.game_over).toEqual(false);
  });

  it("Sc.Command set_game_over. Not over", function() {
    sc2 = new sc.Scoreboard(template, players, over);
    expect(typeof sc2).toEqual("object");

    expect(sc2.scoreboard.innings_over).toEqual(false);
    expect(sc2.scoreboard.game_over).toEqual(false);

    expect(sc2.scoreboard.last_innings).toEqual(0);
    expect(sc2.scoreboard.total).toEqual(0);
    expect(sc2.scoreboard.innings_no).toEqual(1);

    sc2.scoreboard.wickets = 9;
    var o = new sc.Command();
    o.data = sc2.scoreboard;

    expect(o.set_game_over()).toEqual(false);
    expect(sc2.scoreboard.innings_over).toEqual(false);
    expect(sc2.scoreboard.game_over).toEqual(false);
  });

  it("Sc.Command set_game_over. Batting team win.", function() {
    sc2 = new sc.Scoreboard(template, players, over);
    expect(typeof sc2).toEqual("object");

    expect(sc2.scoreboard.innings_over).toEqual(false);
    expect(sc2.scoreboard.game_over).toEqual(false);

    expect(sc2.scoreboard.last_innings).toEqual(0);
    expect(sc2.scoreboard.total).toEqual(0);
    expect(sc2.scoreboard.innings_no).toEqual(1);

    sc2.scoreboard.wickets = 9;
    sc2.scoreboard.last_innings = 100;
    sc2.scoreboard.total = 101;
    sc2.scoreboard.innings_no = 2;

    var o = new sc.Command();
    o.data = sc2.scoreboard;

    expect(o.set_game_over()).toEqual(true);
    expect(sc2.scoreboard.innings_over).toEqual(false);
    expect(sc2.scoreboard.game_over).toEqual(true);
  });

  it("Sc.Command set_game_over. Bowling team win.", function() {
    sc2 = new sc.Scoreboard(template, players, over);
    expect(typeof sc2).toEqual("object");

    expect(sc2.scoreboard.innings_over).toEqual(false);
    expect(sc2.scoreboard.game_over).toEqual(false);
    expect(sc2.scoreboard.innings_no).toEqual(1);

    expect(sc2.scoreboard.last_innings).toEqual(0);
    expect(sc2.scoreboard.total).toEqual(0);

    sc2.scoreboard.wickets = 10;
    sc2.scoreboard.last_innings = 100;
    sc2.scoreboard.total = 90;
    sc2.scoreboard.innings_no = 2;

    var o = new sc.Command();
    o.data = sc2.scoreboard;

    expect(o.set_game_over()).toEqual(true);
    expect(sc2.scoreboard.innings_over).toEqual(true);
    expect(sc2.scoreboard.game_over).toEqual(true);
  });

  it("Sc.Command validator. Throws.", function() {
    sc2 = new sc.Scoreboard(template, players, over);
    sc2.scoreboard.bowler = new sc2.scoreboard.templates.Bowler();
    expect(typeof sc2).toEqual("object");

    var o = new sc.Command();
    o.data = sc2.scoreboard;

    var test_succeeds = function(obj, list, name) {
      try {
        o.validator("Test").check_all_defined(obj, list);
        expect("Success").toEqual("Success");
      } catch (e) {
        expect("Success").toEqual("Failure " + name + " " + e);
      }
    };

    var test_fails = function(obj, list, name) {
      try {
        o.validator("Test").check_all_defined(obj, list);
        expect("Success").toEqual("Failure " + name);
      } catch (e) {
        expect("Success").toEqual("Success");
      }
    };

    test_succeeds({ test: 1 }, ["test"]);

    test_fails({ test2: 1 }, ["test"]);

    test_fails({}, ["test"]);

    test_succeeds({ test: { t: 1 } }, ["test.t"]);

    test_fails({ test: { t2: 1 } }, ["test.t"]);
  });

  it("Sc.Command over.", function() {
    sc2 = new sc.Scoreboard(template, players, over);
    expect(typeof sc2).toEqual("object");

    var o = new sc.Command();
    o.data = sc2.scoreboard;
    o.over_manager().add_over(1, new o.data.templates.Bowler());

    expect(o.data.overs).toEqual(0);
    expect(o.data.overs_and_balls).toEqual(0);
    o.over();

    expect(o.data.overs).toEqual(0);
    expect(o.data.overs_and_balls).toEqual(0);
  });

  it("Sc.Command over. 6 balls", function() {
    sc2 = new sc.Scoreboard(template, players, over);
    expect(typeof sc2).toEqual("object");

    var o = new sc.Command();
    o.data = sc2.scoreboard;

    o.data.bowler = new o.data.templates.Bowler();
    o.data.next_bowler = new o.data.templates.Bowler();
    o.data.bowler.no = 11;
    o.data.next_bowler.no = 10;

    o.over_manager().add_over(1, o.data.bowler);

    for (var i = 0; i < 5; i++) {
      o.over_manager().add_ball(o.data.left_bat, 0, 0, 0, 1);
      o.over();
    }

    expect(o.data.overs).toEqual(0);
    expect(o.data.overs_and_balls).toEqual("0.5");

    o.over();

    expect(o.data.overs).toEqual(0);
    expect(o.data.overs_and_balls).toEqual("0.5");
    expect(o.data.left_bat.striker).toEqual(true);
    expect(o.data.left_bat.runs).toEqual(0);

    o.over_manager().add_ball(o.data.left_bat, 2, 0, 0, 1);
    o.over();

    expect(o.data.overs).toEqual(1);
    expect(o.data.overs_and_balls).toEqual(1);
    expect(o.data.left_bat.striker).toEqual(false);
    expect(o.data.bowler.no).toEqual(10);
    expect(o.data.next_bowler.no).toEqual(11);
  });

  // **********************************************************

  it("An Sc.Commands.Wicket", function() {
    sc2 = new sc.Scoreboard(template, players, over);
    sc2.scoreboard.bowler = new sc2.scoreboard.templates.Bowler();
    expect(typeof sc2).toEqual("object");

    sc2.scoreboard.left_bat = new sc2.scoreboard.templates.Batsman();

    expect(sc2.scoreboard.wickets).toEqual(0);
    expect(sc2.scoreboard.balls).toEqual(0);

    sc2.wicket();
    expect(sc2.scoreboard.wickets).toEqual(1);
    expect(sc2.scoreboard.balls).toEqual(1);
    expect(sc2.scoreboard.game_over).toEqual(false);
  });

  it("An Sc.Commands.Wicket set_next_batsman_no", function() {
    sc2 = new sc.Scoreboard(template, players, over);
    sc2.scoreboard.bowler = new sc2.scoreboard.templates.Bowler();
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
    // expect(sc2.scoreboard.next_batsman_no).toEqual(4);
  });

  it("An Sc.Commands.StandardBall change_ends", function() {
    sc2 = new sc.Scoreboard(template, players, over);
    sc2.scoreboard.bowler = new sc2.scoreboard.templates.Bowler();
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
    sc2 = new sc.Scoreboard(template, players, over);
    sc2.scoreboard.bowler = new sc2.scoreboard.templates.Bowler();
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
    sc2 = new sc.Scoreboard(template, players, over);
    sc2.scoreboard.bowler = new sc2.scoreboard.templates.Bowler();
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
    sc2 = new sc.Scoreboard(template, players, over);
    sc2.scoreboard.bowler = new sc2.scoreboard.templates.Bowler();
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
    sc2 = new sc.Scoreboard(template, players, over);
    sc2.scoreboard.bowler = new sc2.scoreboard.templates.Bowler();
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
    sc2 = new sc.Scoreboard(template, players, over);
    sc2.scoreboard.bowler = new sc2.scoreboard.templates.Bowler();
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
    sc2 = new sc.Scoreboard(template, players, over);
    sc2.scoreboard.bowler = new sc2.scoreboard.templates.Bowler();

    expect(typeof sc2).toEqual("object");
    expect(sc2.scoreboard.left_bat.striker).toEqual(true);
    expect(sc2.scoreboard.right_bat.striker).toEqual(false);
    expect(sc2.scoreboard.left_bat.runs).toEqual(0);
    expect(sc2.scoreboard.extras).toEqual(0);
    expect(sc2.scoreboard.total).toEqual(0);

    sc.Commands.Run(sc.Commands.LegBye, sc2.scoreboard);

    expect(sc2.scoreboard.left_bat.striker).toEqual(false);
    expect(sc2.scoreboard.left_bat.runs).toEqual(0);
    expect(sc2.scoreboard.right_bat.striker).toEqual(true);
    expect(sc2.scoreboard.extras).toEqual(1);
    expect(sc2.scoreboard.total).toEqual(1);
  });
});
