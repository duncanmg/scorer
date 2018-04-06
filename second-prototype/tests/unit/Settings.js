describe("SettingsTest", function() {
  beforeEach(module('scorer'));

  var settings;

  beforeEach(module(function($provide) {

  }));

  beforeEach(inject(function(Settings) {
    //console.log(JSON.stringify(MockSettings));
    settings = Settings;
  }));

  it("A Settings object has been created.",
    function() {
      expect(typeof(settings)).toEqual('object');
    });

  it("A Settings object has some of the correct attributes.", function() {

    expect(settings.settings.num_overs).toEqual(40);
    expect(settings.settings.away_team.id).toEqual(2);
    expect(settings.settings.match_type.name).toEqual('Limited Overs');

  });

});
