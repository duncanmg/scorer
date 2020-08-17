describe("ScCommandsTest. Real Template", function() {
  beforeEach(module("scorer"));

  var sc;
  var sc2;
  var template;
  var players;
  var over;
  var storage;
  var settings;

  beforeEach(
    inject(function(Players) {
      players = {};
    })
  );

  beforeEach(
    inject(function(ScoreboardTemplate) {
      template = ScoreboardTemplate;
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
    inject(function(Settings) {
      console.log('SETTINGS');
      settings = Settings;
      console.log('SETTINGS XXXXXXXXXXXXXXXXXXXXXX');
    })
  );

  beforeEach(
    inject(function(Sc) {
      sc.LoggerConfig = {};
      sc2 = new Sc.Scoreboard(template, settings, players, over, storage);
    })
  );

  it("Sc.Command set_innings_over", function() {
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
    sc.LoggerConfig = {};
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
    sc2.scoreboard.bowler = sc.Utils.clone(sc2.scoreboard.templates.Bowler);
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

    test_succeeds({
      test: 1
    }, ["test"]);

    test_fails({
      test2: 1
    }, ["test"]);

    test_fails({}, ["test"]);

    test_succeeds({
      test: {
        t: 1
      }
    }, ["test.t"]);

    test_fails({
      test: {
        t2: 1
      }
    }, ["test.t"]);
  });

  it("Sc.Command over.", function() {
    expect(typeof sc2).toEqual("object");

    var o = new sc.Command();
    o.data = sc2.scoreboard;
    o.over_manager().add_over(1, sc.Utils.clone(o.data.templates.Bowler));

    expect(o.data.overs).toEqual(0);
    expect(o.data.overs_and_balls).toEqual(0);
    o.over();

    expect(o.data.overs).toEqual(0);
    expect(o.data.overs_and_balls).toEqual(0);
  });

  it("Sc.Command over. 6 balls", function() {
    expect(typeof sc2).toEqual("object");

    var o = new sc.Command();
    o.data = sc2.scoreboard;

    o.data.bowler = sc.Utils.clone(o.data.templates.Bowler);
    o.data.next_bowler = sc.Utils.clone(o.data.templates.Bowler);
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

});
