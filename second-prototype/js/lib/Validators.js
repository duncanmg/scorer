var sc = sc || {};

sc.validators = {
  is_batsman: function(batsman) {
    var b = batsman;
    var errors = [];
    ['no', 'striker', 'runs', 'name', 'id', 'bowler', 'bowling'].forEach(function(m, i) {
      // console.log("Does method " + m +" of Batsman exist: " + is.existy(b[m]));
      if (!is.existy(b[m])) {
        errors.push(m);
      }
    });

    if (errors.length) {
      throw new Error("Not a Batsman. Must have the following properties: " +
        JSON.stringify(errors) +
        '. Got:' + JSON.stringify(b));
    }
  },
  is_bowler: function(bowler) {
    var b = bowler;
    if (!is.all.existy(b.no, b.striker, b.runs, b.bowler, b.bowling)) {
      throw new Error("Not a Bowler: " + JSON.stringify(b));
    }
  },
  is_ball: function(ball) {
    var b = ball;
    if (!is.existy(b) || !is.all.existy(b.striker, b.runs, b.extras, b.wkt, b.valid)) {
      throw new Error("Not a Ball: " + JSON.stringify(b));
    }
  }
};
