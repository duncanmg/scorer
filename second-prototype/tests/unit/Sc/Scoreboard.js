describe("ScScoreboardTest Simple Construction", function() {
  beforeEach(module("scorer"));

  var sc;
  var template;
  var players;

  beforeEach(
    inject(function(Players) {
      players = {};
    })
  );

  beforeEach(
    inject(function(ScoreboardTemplate) {
      template = { innings: [{ templates: {HomePlayers:[]} }, { templates: {AwayPlayers:[]} }] };
      template.innings[0].templates.HomePlayers = [];
      template.innings[1].templates.AwayPlayers = [];
    })
  );

  beforeEach(
    inject(function(Sc) {
      sc = Sc;
    })
  );

  // it("An Sc.Scoreboard object has been created.", function() {
  //   expect(typeof sc).toEqual("object");
  //   expect(typeof sc.Scoreboard).toEqual("function");
  //   expect(typeof template).toEqual("object");
  //   expect(typeof players).toEqual("object");
  //   sc2 = new sc.Scoreboard(template, players);
  // });
});

describe("ScScoreboardTest. Real Template", function() {
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

  it("An Sc.Scoreboard object has been created.", function() {
    sc2 = new sc.Scoreboard(template, players, over);
    expect(typeof sc2).toEqual("object");
  });

  it("An Sc.Scoreboard has overs_history and add_over.", function() {
    sc2 = new sc.Scoreboard(template, players, over);
    expect(typeof sc2).toEqual("object");
    expect(sc2.scoreboard.overs_history.length).toEqual(0);
    sc2.add_over(1, 2);
    expect(sc2.scoreboard.overs_history.length).toEqual(1);
  });
});
