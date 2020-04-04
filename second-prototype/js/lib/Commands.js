var sc = sc || {};

sc.Command = function() {
  this.test = "test";

  /** @function set_innings_over
   *  @description Set the innings over flag if 10 wickets have been taken
   *  or the last over has been completed.
   *  @memberOf sc.Scoreboard
   * return {boolean}
   */
  this.set_innings_over = function() {
    if (this.data.wickets >= 10) {
      this.data.innings_over = true;
    }
    //alert(this.scoreboard.num_overs + ' : ' + this.scoreboard.overs);
    if (this.data.num_overs && this.data.overs >= this.data.num_overs) {
      //alert(1);
      this.data.innings_over = true;
    }
    return this.data.innings_over;
  };

  /** @function set_game_over
   *  @description Calls set_innings_over and then sets game_over if the
   *  second innings has ended.
   *  @memberOf sc.Scoreboard
   */
  this.set_game_over = function() {
    this.set_innings_over();

    if (this.data.innings_no <= 1) {
      return false;
    }

    if (this.data.total > this.data.last_innings) {
      this.data.game_over = true;
      return true;
    }

    if (this.data.innings_over) {
      this.data.game_over = true;
      return true;
    }

    return false;
  };

  this.over_manager = function() {
    return new sc.OverManager(this.data);
  };

  this.player_manager = function() {
    return new sc.PlayerManager();
  };
};

sc.Commands = {
  Wicket: function(data) {
    sc.Command.call(this, data);
    this.data = data;

    this.run = function() {
      // console.log(
      //   "Wicket.run! XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
      // );
      console.log(JSON.stringify(this.data));
      //console.log(JSON.stringify(sc.Command));
      data.balls++;
      data.wickets += 1;
      if (this.set_game_over()) {
        return true;
      }

      this.over_manager().add_ball(
        data.left_bat.striker ? data.left_bat : data.right_bat,
        0,
        0,
        true,
        true
      );

      this.set_striker_as_new(data);

      // console.log('NOT IMPLEMENTED set_batsmen_details');
      this.player_manager().set_batsmen_details(data);
    };

    // Allocate the next batsman's number. If current batsmen are
    // 3 and 6. Next batman will be 7.
    this.set_next_batsman_no = function(data) {
      var next_batsman_no =
        data.left_bat.no > data.right_bat.no
          ? data.left_bat.no + 1
          : data.right_bat.no + 1;
      return next_batsman_no;
    };

    // Make the next batsman the striker.
    this.set_striker_as_new = function(data) {
      if (data.left_bat.striker === true) {
        data.left_bat = new data.templates.Batsman();
        data.left_bat.no = this.set_next_batsman_no(data);
        data.left_bat.striker = true;
      } else {
        data.right_bat = new data.templates.Batsman();
        data.right_bat.no = this.set_next_batsman_no(data);
        data.right_bat.striker = true;
      }
    };
  },

  StandardBall: function(args) {
    // console.log(JSON.stringify(args));

    if (!(args instanceof Array) || args.length != 2) {
      throw new Error(
        "StandardBall Parameter args must be an array of length 2"
      );
    }

    this.data = args[0];
    this.runs = args[1];

    if (!this.data) {
      throw new Error("StandardBall Parameter data is mandatory");
    }

    if (typeof this.runs === "undefined") {
      throw new Error("StandardBall Parameter runs is mandatory");
    }

    if (typeof this.data.total === "undefined") {
      throw new Error("StandardBall data.total must be defined");
    }

    if (typeof this.data.balls === "undefined") {
      throw new Error("StandardBall data.balls must be defined");
    }

    if (typeof this.data.left_bat === "undefined") {
      throw new Error("StandardBall data.left_bat must be defined");
    }

    if (typeof this.data.left_bat.striker === "undefined") {
      throw new Error("StandardBall data.left_bat.striker must be defined");
    }

    if (typeof this.data.right_bat === "undefined") {
      throw new Error("StandardBall data.right_bat must be defined");
    }

    sc.Command.call(this, this.data);

    this.run = function() {
      this.data.total += this.runs;
      this.data.balls++;

      this.player_manager().add_runs_to_striker(this.data, this.runs);

      this.over_manager().add_ball(
        this.data.left_bat.striker ? this.data.left_bat : this.data.right_bat,
        this.runs,
        0,
        false,
        true
      );

      this.player_manager().change_ends(this.data, this.runs);
    };
  },

  Run: function(object, args) {
    object.prototype = Object.create(sc.Command.prototype);
    object.prototype.Constructor = sc.Command.Wicket;

    var o = new object(args);

    o.run();
    return 1;
  }
  //Wicket.prototype = Command;
};
