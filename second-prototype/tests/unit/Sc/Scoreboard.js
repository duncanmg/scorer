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
      template = {
        innings: [{
          templates: {
            HomePlayers: []
          }
        }, {
          templates: {
            AwayPlayers: []
          }
        }]
      };
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
      settings = Settings;
    })
  );

  it("An Sc.Scoreboard object has been created.", function() {
    sc2 = new sc.Scoreboard(template, settings, players, over, storage);
    expect(typeof sc2).toEqual("object");
  });

});
