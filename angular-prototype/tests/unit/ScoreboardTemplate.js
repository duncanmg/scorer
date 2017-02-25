describe("ScoreboardTemplateTest", function() {
  beforeEach(module('scorer'));

  var template;
  var MockSettings;

  beforeEach(module(function($provide) {
    MockSettings = {
      settings: {
        num_overs: 10,
        match_type: {
          id: 1,
          name: 'Limited Overs'
        },
        team_batting_first: {
          home_away: 'home'
        }
      }
    };
  }));

  beforeEach(inject(function(ScoreboardTemplate) {
    //console.log(JSON.stringify(MockSettings));
    template = new ScoreboardTemplate(MockSettings);
  }));

  it("A ScoreboardTemplateTest object has been created.",
    function() {
      expect(typeof(template)).toEqual('object');
    });

  it("A ScoreboardTemplate object has some of the correct attributes.", function() {

    expect(template.left_bat.no).toEqual(1);
    expect(template.game_over).toEqual(false);
    expect(template.num_overs).toEqual(10);

  });

});
