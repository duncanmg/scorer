describe("ScScoreboardTest", function() {
  beforeEach(module('scorer'));

  var sc

  beforeEach(inject(function(Sc) {
    console.log('ScScoreboardTest BBBBBBBBBBBBBBBBBB!!!!!!!!');
    sc = Sc;
  }));

  beforeEach(inject(function(Players) {
    console.log('Inject Players ' + JSON.stringify(Players));
  }));

  it("An Sc.Scoreboard object has been created.",
    function() {
      expect(typeof(scoreboard)).toEqual('object');
    });

});
