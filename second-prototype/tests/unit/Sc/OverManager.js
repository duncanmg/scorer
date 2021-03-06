describe("ScOverManagerTest Simple Construction", function() {
  beforeEach(module("scorer"));

  var sc;
  var Template;
  var players;
  var om;
  var om_class;
  var storage;
  var clone;
  var Settings;

  beforeEach(
    inject(function(Players) {
      players = {};
    })
  );

  beforeEach(
    inject(function(_ScoreboardTemplate_) {
      Template = _ScoreboardTemplate_;
    })
  );

  beforeEach(
    inject(function(Storage) {
      //console.log('XXXX');
      storage = new Storage();
      //console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXX ' + storage);
    })
  );

  beforeEach(
    inject(function(_Settings_) {
      //console.log('XXXX');
      Settings = _Settings_;
      //console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXX ' + storage);
    })
  );

  beforeEach(
    inject(function(Sc) {
      clone = Sc.Utils.clone;
      //console.log("Sc=" + JSON.stringify(Sc));
      //console.log("Utils=" + JSON.stringify(Sc.Utils));
      //console.log("clone=" + clone);
    })
  );


  beforeEach(
    inject(function(Sc, Storage) {
      Sc.LoggerConfig.PlayerManager = Sc.LoggerLevels.ERROR;
      sc = new Sc.Scoreboard(Template, Settings, players, {}, Storage);
      //om = new Sc.OverManager(sc.scoreboard);
      //om_class = Sc.OverManager;
      //console.log("About to set clone");
      //clone = Sc.Utils.clone;

    })
  );

  beforeEach(
    inject(function(Sc, Storage) {
      //sc = new Sc.Scoreboard(template, players, {}, Storage);
      om = new Sc.OverManager(sc.scoreboard);
      //om_class = Sc.OverManager;
      //console.log("About to set clone");
      //clone = Sc.Utils.clone;

    })
  );

  beforeEach(
    inject(function(Sc, Storage) {
      //sc = new Sc.Scoreboard(template, players, {}, Storage);
      //om = new Sc.OverManager(sc.scoreboard);
      om_class = Sc.OverManager;
      //console.log("About to set clone");
      //clone = Sc.Utils.clone;

    })
  );

  it("Sc.OverManager constructor errors.", function() {
    expect(om_class).toBeDefined();

    // Missing overs_history
    expect(function() {
      new om_class({});
    }).toThrow(new Error("data.overs_history must be an array"));

    // // Missing templates
    // expect(function() {
    //   new om_class({
    //     overs_history: []
    //   });
    // }).toThrow(new Error("data.templates must be an object"));
    //
    // // Missing templates.Ball
    // expect(function() {
    //   new om_class({
    //     overs_history: [],
    //     templates: {}
    //   });
    // }).toThrow(new Error("Not a Ball: undefined"));
  });

  it("An Sc.OverManager add_ball arguments.", function() {
    expect(typeof om).toEqual("object");

    expect(function() {
      om.add_ball();
    }).toThrow(
      new Error("OverManager.add_ball requires five arguments. Got 0")
    );

    expect(function() {
      om.add_ball(1);
    }).toThrow(
      new Error("OverManager.add_ball requires five arguments. Got 1")
    );

    expect(function() {
      om.add_ball(1, 2, 3, 4, 5, 6);
    }).toThrow(
      new Error("OverManager.add_ball requires five arguments. Got 6")
    );

    expect(function() {
      om.add_ball(1, 2, 3, 4, 5);
    }).toThrow(
      new Error("OverManager.add_ball argument 1 must be an object. Got number")
    );
  });

  it("An Sc.OverManager add_over.", function() {
    expect(typeof om).toEqual("object");

    expect(om.data.overs_history.length).toEqual(0);
    var bowler = clone(om.data.templates.Bowler);

    expect(function() {
      om.add_over();
    }).toThrow(new Error("OverManager add_over requires two arguments"));

    expect(function() {
      om.add_over("a", "b");
    }).toThrow(new Error("OverManager add_over. over_no must be an integer"));

    expect(function() {
      om.add_over(1, "b");
    }).toThrow(new Error("OverManager add_over. bowler_obj must be an object"));

    expect(om.data.overs_history.length).toEqual(0);
    om.add_over(1, bowler);
    expect(om.data.overs_history.length).toEqual(1);
  });

  it("An Sc.OverManager add 7 balls.", function() {
    expect(typeof om).toEqual("object");

    expect(om.current_over_no()).toEqual(0);

    var batsman = clone(om.data.templates.Batsman);
    om.data.bowler = clone(om.data.templates.Bowler);

    om.add_ball(batsman, 4, 1, 0, 0);

    expect(om.current_over().valid_balls).toEqual(0);
    expect(om.current_over().total_balls).toEqual(1);

    for (var x = 0; x < 6; x++) {
      om.add_ball(batsman, 4, 1, 0, 1);
    }

    expect(om.current_over_no()).toEqual(1);
    expect(om.current_over().valid_balls).toEqual(6);
    expect(om.current_over().total_balls).toEqual(7);

    expect(function() {
      om.add_ball(batsman, 4, 1, 0, 1);
    }).toThrow(new Error("The over has finished."));

    expect(om.current_over_no()).toEqual(1);
    expect(om.current_over().valid_balls).toEqual(6);
    expect(om.current_over().total_balls).toEqual(7);
  });

  it("An Sc.OverManager change over.", function() {
    expect(typeof om).toEqual("object");

    expect(om.current_over_no()).toEqual(0);

    var batsman = clone(om.data.templates.Batsman);

    var bowler1 = clone(om.data.templates.Bowler);
    var bowler2 = clone(om.data.templates.Bowler);
    bowler1.no = 1;
    bowler2.no = 2;

    om.data.bowler = bowler1;
    om.data.next_bowler = bowler2;

    var over_no = 1;

    for (var i = 0; i < 5; i++) {
      // console.log(i + ") over_no=" + over_no);
      for (var x = 0; x < 6; x++) {
        om.add_ball(batsman, 4, 1, 0, 1);
      }

      over_no++;

      var bowler = bowler1.no === om.data.bowler.no ? bowler2 : bowler1;
      om.data.bowler = bowler;

      om.add_over(over_no, bowler);
    }

    expect(om.current_over_no()).toEqual(6);
    expect(om.current_over().valid_balls).toEqual(0);
  });

});
