var sc = sc || {};

sc.OverManager = function(data) {
  console.log("OverManager data " + JSON.stringify(data));
  this.data = data;

  var ok = true;
  if (typeof this.data.overs_history != "object") {
    console.log("data.overs_history must be an array");
    ok = false;
  }

  if (!ok) {
    throw new Error("new sc.OverManager failed");
  }

  /** @function add_ball
   * @description Add a ball
   *  @memberOf sc.Command
   *  @param striker
   *  @param runs
   *  @param extras
   *  @param wkt
   *  @param valid
   */
  this.add_ball = function(striker, runs, extras, wkt, valid) {
    console.log("add_ball " + JSON.stringify(this.data));
    if (!this.data.overs_history.length) {
      // alert("xxxxx " + this.add_over);
      this.add_over(1, this.data.bowler);
    }
    alert(this.data.overs_history.length);
    var over = this.data.overs_history[this.data.overs_history.length - 1];
    if (over.valid_balls >= 6) {
      alert("The over has finished.");
    }
    this.data.overs_history[this.data.overs_history.length - 1].balls.push(
      new data.templates.Ball(striker, runs, extras, wkt, valid)
    );
    if (valid) {
      this.data.overs_history[
        this.data.overs_history.length - 1
      ].valid_balls += 1;
    }
    this.data.overs_history[
      this.data.overs_history.length - 1
    ].total_balls += 1;
  };

  this.add_over = function(over_no, bowler_obj) {
    //console.log("add_over " + over_no);
    //console.log("bowler_obj " + JSON.stringify(bowler_obj));
    this.data.overs_history.push(
      new this.data.templates.Over(over_no, bowler_obj)
    );
    //alert("Over");
  };
};
