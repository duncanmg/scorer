describe("ScPlayerManagerTest", function() {
  beforeEach(module("scorer"));

  var sc;
  var template;
  var players;
  var sc2;
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
      sc2 = new Sc.Scoreboard(template, players, over, storage);
    })
  );

  it("Sc.PlayerManager Constructor", function() {
    pm = new sc.PlayerManager();
    pm.logger.set_level(sc.LoggerLevels.WARN);
    expect(typeof pm).toEqual("object");
    expect(pm instanceof sc.PlayerManager).toEqual(true);
  });

  it("Sc.PlayerManager set_batsmen_details", function() {
    pm = new sc.PlayerManager();
    pm.logger.set_level(sc.LoggerLevels.WARN);
    var data = sc2.scoreboard;

    data.home_players = pm.init_players(data,"home");
    data.away_players = pm.init_players(data,"away");

    expect(data.left_bat.no).toEqual(1);
    expect(data.right_bat.no).toEqual(2);
    expect(data.left_bat.name).toEqual('');
    expect(data.right_bat.name).toEqual('');

    pm.set_batsmen_details(data);

    expect(data.left_bat.no).toEqual(1);
    expect(data.right_bat.no).toEqual(2);
    expect(data.left_bat.name).toEqual("Home Player 1");
    expect(data.right_bat.name).toEqual("Home Player 2");

  });
});
