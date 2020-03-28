describe("ScScoreboardTest Simple Construction", function() {
  beforeEach(module("scorer"));

  var sc;
  var template;
  var players;

  beforeEach(
    inject(function(Players) {
      console.log("Inject Players " + JSON.stringify(Players));
      players = {};
    })
  );

  beforeEach(
    inject(function(ScoreboardTemplate) {
      // console.log('Inject Players ' + JSON.stringify(Players));
      template = { innings: [{}, {}] };
    })
  );

  beforeEach(
    inject(function(Sc) {
      console.log("ScScoreboardTest BBBBBBBBBBBBBBBBBB!!!!!!!!");
      sc = Sc;
    })
  );

  it("An Sc.Scoreboard object has been created.", function() {
    //console.log("CCCCCCCCCCCCCCCCCCCCCCCCC");
    expect(typeof sc).toEqual("object");
    //console.log(JSON.stringify(sc));
    //console.log("2 CCCCCCCCCCCCCCCCCCCCCCCCC");
    expect(typeof sc.Scoreboard).toEqual("function");
    //console.log("3 CCCCCCCCCCCCCCCCCCCCCCCCC");
    expect(typeof template).toEqual("object");
    //console.log("4 CCCCCCCCCCCCCCCCCCCCCCCCC");
    expect(typeof players).toEqual("object");
    //console.log("5 CCCCCCCCCCCCCCCCCCCCCCCCC");
    sc2 = new sc.Scoreboard(template, players);
  });
});

describe("ScScoreboardTest. Real Template", function() {
  beforeEach(module("scorer"));

  var sc;
  var template;
  var players;
  var over;

  beforeEach(
    inject(function(Players) {
      console.log("Inject Players " + JSON.stringify(Players));
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

  it("An Sc.Scoreboard object has been created.", function() {
    sc2 = new sc.Scoreboard(template, players, over);
    expect(typeof sc2).toEqual("object");
  });

  it("An Sc.Scoreboard has overs_history and add_over.", function() {
    sc2 = new sc.Scoreboard(template, players, over);
    expect(typeof sc2).toEqual("object");
    // console.log("sc2.scoreboard.overs_history " + JSON.stringify(sc2.scoreboard.overs_history));
    // console.log(sc2.scoreboard.overs_history.length);
    expect(sc2.scoreboard.overs_history.length).toEqual(0);
    sc2.add_over(1, 2);
    expect(sc2.scoreboard.overs_history.length).toEqual(1);
  });

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

  it("An Sc.Commands.Wicket", function() {
    sc2 = new sc.Scoreboard(template, players, over);
    expect(typeof sc2).toEqual("object");
    expect(sc2.scoreboard.wickets).toEqual(0);
    expect(sc2.scoreboard.balls).toEqual(0);
    sc2.wicket();
    expect(sc2.scoreboard.wickets).toEqual(1);
    expect(sc2.scoreboard.balls).toEqual(1);
    expect(sc2.scoreboard.game_over).toEqual(false);
  });
});
