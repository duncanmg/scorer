describe("ScScoreboardTest", function() {
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
