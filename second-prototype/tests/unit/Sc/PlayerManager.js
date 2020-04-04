describe("ScPlayerManagerTest", function() {
  beforeEach(module("scorer"));

  var sc;
  var template;
  var players;
  var sc2;
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

  beforeEach(
    inject(function(Sc) {
      sc2 = new Sc.Scoreboard(template, players, over);
    })
  );

  it("Sc.PlayerManager Constructor", function() {
    pm = new sc.PlayerManager();
    expect(typeof pm).toEqual("object");
    expect(pm instanceof sc.PlayerManager).toEqual(true);
  });

  it("Sc.PlayerManager set_batsmen_details", function() {
    pm = new sc.PlayerManager();
    var data = sc2.scoreboard;

    expect(data.left_bat.no).toEqual(1);
    expect(data.right_bat.no).toEqual(2);
    expect(data.left_bat.name).toEqual(undefined);
    expect(data.right_bat.name).toEqual(undefined);

    pm.set_batsmen_details(data);

    expect(data.left_bat.no).toEqual(1);
    expect(data.right_bat.no).toEqual(2);
    expect(data.left_bat.name).toEqual("Home Player 1");
    expect(data.right_bat.name).toEqual("Home Player 2");

  });
});
