angular.module("scorer").factory('Others', ['Scoreboard', 'Storage', function(Scoreboard, Storage) {

  return {
    board: Scoreboard,

    Extra: function(type) {
      this.type = type;
      this.runs = 0;
      this.extras = 0;
      this.is_clean = function() {
        return (this.runs === 0 && this.extras === 0) ? true : false;
      };
      this.runs_up = function() {
        this.runs += 1;
      };
      this.runs_down = function() {
        if (this.runs > 0) {
          this.runs -= 1;
        }

      };
      this.extras_up = function() {
        this.extras += 1;
      };
      this.extras_down = function() {
        if (this.extras > 0) {
          this.extras -= 1;
        }
      };
      this.add = function() {
        board.add_extra(this);
      };
    },

    extras: {
      no_ball: new Extra('no_ball'),
      wide: new Extra('wide'),
      bye: new Extra('bye'),
      leg_bye: new Extra('leg_bye')
    },

    accept: function() {

      var count = 0;
      var extra;
      for (var e in this.extras) {
        if (!this.extras[e].is_clean()) {
          count += 1;
          // alert(e);
          extra = this.extras[e];
        }
      }
      if (count > 1) {
        alert("Please enter just one type of extra.");
        return false;
      }
      if (count === 0) {
        alert("Nothing has been entered.");
        return false;
      }

      extra.add();

    }
  };

}]);
