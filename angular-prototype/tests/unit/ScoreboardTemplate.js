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
    template = ScoreboardTemplate;
  }));

  it("A ScoreboardTemplateTest object has been created.",
    function() {
      expect(typeof(template)).toEqual('object');
    });

  it("The ScoreboardTemplate objects has 2 innings.", function() {
    console.log(JSON.stringify(template));
    expect(template.innings.length).toEqual(2);
  });

  it("A ScoreboardTemplate object has some of the correct attributes.", function() {

    expect(template.innings[0].left_bat.no).toBeDefined();
    expect(template.innings[0].game_over).toBeDefined();
    expect(template.innings[0].num_overs).toBeDefined();

    expect(template.innings[1].left_bat.no).toBeDefined();
    expect(template.innings[1].game_over).toBeDefined();
    expect(template.innings[1].num_overs).toBeDefined();

  });

});
