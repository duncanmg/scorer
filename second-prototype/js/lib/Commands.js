var sc = sc || {};

(sc.Command = function() {
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
});

//  Command.prototype.Batsman = function() {
//  this.no = 0;
// this.striker = false;
//  this.runs = 0;
//  this.bowler = false;
//  this.bowling = false;
//},
sc.Commands = {
Wicket: function(data) {
  sc.Command.call(this, data);
  this.data = data;

  this.run = function() {
    console.log(
      "Wicket.run! XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
    );
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

    console.log('NOT IMPLEMENTED set_batsmen_details');
    // this.set_batsmen_details();
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

Run: function(object, args) {
  object.prototype.set_game_over = function() {
    console.log("Bang");
  };
  object.prototype = Object.create(sc.Command.prototype);
  object.prototype.Constructor = sc.Command.Wicket;
  var o = new sc.Commands.Wicket(args);

  o.run();
  return 1;
}
//Wicket.prototype = Command;
};
