var sc = sc || {};

sc.OverManager = function(data) {
  // console.log("OverManager data " + JSON.stringify(data));
  this.data = data;

  if (typeof this.data.overs_history != "object") {
    throw new Error("data.overs_history must be an array");
  }

  if (typeof this.data.templates != "object") {
    throw new Error("data.templates must be an object");
  }

  if (typeof this.data.templates.Ball != "function") {
    throw new Error("data.templates.Ball must be a function");
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
    //console.log("add_ball " + JSON.stringify(this.data));
    //console.log("runs=" + runs);
    if (arguments.length != 5) {
      throw new Error(
        "OverManager.add_ball requires five arguments. Got " + arguments.length
      );
    }

    if (typeof striker != "object") {
      throw new Error(
        "OverManager.add_ball argument 1 must be an object. Got " +
          typeof striker
      );
    }

    if (!(wkt == 0 || wkt == 1)) {
      throw new Error("OverManager.add_ball wkt must be 0 or 1");
    }

    if (!(valid == 0 || valid == 1)) {
      throw new Error("OverManager.add_ball valid must be 0 or 1");
    }

    if (runs !== parseInt(runs)) {
      throw new Error("OverManager.add_ball run must be an integer");
    }

    if (extras !== parseInt(extras)) {
      throw new Error("OverManager.add_ball errors must be an integer");
    }

    if (typeof striker != "object") {
      throw new Error(
        "OverManager.add_ball argument 1 must be an object. Got " +
          typeof striker
      );
    }
    if (!this.data.overs_history.length) {
      // alert("xxxxx " + this.add_over);
      this.add_over(1, this.data.bowler);
    }

    var over = this.data.overs_history[this.data.overs_history.length - 1];
    if (over.valid_balls >= 6) {
      alert("The over has finished.");
      return;
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
    if (arguments.length != 2) {
      throw new Error("OverManager add_over requires two arguments");
    }

    if (over_no !== parseInt(over_no)) {
      throw new Error("OverManager add_over. over_no must be an integer");
    }

    if (typeof bowler_obj != "object") {
      throw new Error("OverManager add_over. bowler_obj must be an object");
    }

    this.data.overs_history.push(
      new this.data.templates.Over(over_no, bowler_obj)
    );
    //alert("Over");
  };
};
