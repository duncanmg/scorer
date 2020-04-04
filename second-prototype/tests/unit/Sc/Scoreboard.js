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
      template = { innings: [{ templates: {} }, { templates: {} }] };
      template.innings[0].templates.HomePlayers = [];
      template.innings[1].templates.AwayPlayers = [];
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
});
