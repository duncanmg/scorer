describe("ScoreboardTemplateTest", function() {
  beforeEach(module('scorer'));

  var template;
  var MockSettings;
  var MockInnings;

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
        },
        num_innings: 2
      }
    };
    MockInnings = {};
    //console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
  }));

  beforeEach(inject(function(ScoreboardTemplate) {
    //console.log("AAAAAAAAAAAAAAAAAAAAAAA");
    template = ScoreboardTemplate;
  }));

  it("A ScoreboardTemplateTest object has been created.",
    function() {
      //console.log('xxxxxxxxxxxxxxxxxxxx');
      var obj = new template();
      //console.log('2 xxxxxxxxxxxxxxxxxx');
      expect(typeof(obj)).toEqual('object');
    });

  it("The ScoreboardTemplate objects has 2 innings.", function() {
    var obj = new template();
    //console.log(JSON.stringify(obj));
    expect(obj.innings.length).toEqual(2);
  });

  it("A ScoreboardTemplate object has some of the correct attributes.", function() {
    var obj = new template();
    expect(obj.innings[0].left_bat.no).toBeDefined();
    expect(obj.innings[0].game_over).toBeDefined();
    expect(obj.innings[0].num_overs).toBeDefined();

    expect(obj.innings[1].left_bat.no).toBeDefined();
    expect(obj.innings[1].game_over).toBeDefined();
    expect(obj.innings[1].num_overs).toBeDefined();

  });

});
