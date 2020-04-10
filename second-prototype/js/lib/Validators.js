var sc = sc || {};

sc.validators = {
  is_batsman: function(batsman) {
    var b = batsman;
    if (!is.all.existy(b.no, b.striker, b.runs, b.bowler, b.bowling)) {
      throw new Error("Not a Batsman: " + JSON.stringify(b));
    }
  },
  is_bowler: function(bowler) {
    var b = bowler;
    if (!is.all.existy(b.no, b.striker, b.runs, b.bowler, b.bowling)) {
      throw new Error("Not a Bowler: " + JSON.stringify(b));
    }
  }
};
