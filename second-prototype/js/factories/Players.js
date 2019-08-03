/**
 * @class Players
 * @memberOf scorer.factory
 */
angular.module("scorer").factory('Players', ['Storage', '$rootScope', function(Storage, $rootScope) {

  'use strict';
  var storage = new Storage();

  var home_players = [{
    id: 1,
    name: 'Home Player 1',
    batting_no: 1
  }, {
    id: 2,
    name: 'Home Player 2',
    batting_no: 2
  }, {
    id: 3,
    name: 'Home Player 3',
    batting_no: 3
  }, {
    id: 4,
    name: 'Home Player 4',
    batting_no: 4
  }, {
    id: 5,
    name: 'Home Player 5',
    batting_no: 5
  }, {
    id: 6,
    name: 'Home Player 6',
    batting_no: 6
  }, {
    id: 7,
    name: 'Home Player 7',
    batting_no: 7
  }, {
    id: 8,
    name: 'Home Player 8',
    batting_no: 8
  }, {
    id: 9,
    name: 'Home Player 9',
    batting_no: 9
  }, {
    id: 10,
    name: 'Home Player 10',
    batting_no: 10
  }, {
    id: 11,
    name: 'Home Player 11',
    batting_no: 11
  }];

  var away_players = [{
    id: 12,
    name: 'Away Player 1',
    batting_no: 1
  }, {
    id: 13,
    name: 'Away Player 2',
    batting_no: 2
  }, {
    id: 14,
    name: 'Away Player 3',
    batting_no: 3
  }, {
    id: 15,
    name: 'Away Player 4',
    batting_no: 4
  }, {
    id: 16,
    name: 'Away Player 5',
    batting_no: 5
  }, {
    id: 17,
    name: 'Away Player 6',
    batting_no: 6
  }, {
    id: 18,
    name: 'Away Player 7',
    batting_no: 7
  }, {
    id: 19,
    name: 'Away Player 8',
    batting_no: 8
  }, {
    id: 20,
    name: 'Away Player 9',
    batting_no: 9
  }, {
    id: 21,
    name: 'Away Player 10',
    batting_no: 10
  }, {
    id: 22,
    name: 'Away Player 11',
    batting_no: 11
  }];

  var obj = {

    players: [],

    lookup: function(player) {
      for (var i = 0; i < this.players.length; i++) {
        if (this.players[i].id == player.id) {
          return i;
        }
      }
      return -1;
    },

    up: function(player) {
      var i = this.lookup(player);
      if (i < 0) {
        return false;
      }
      if (i > 0) {
        var tmp = this.players[i];
        this.players[i] = this.players[i - 1];
        this.players[i - 1] = tmp;
        this.renumber();
      }
    },

    down: function(player) {
      var i = this.lookup(player);
      if (i < 0) {
        return false;
      }
      if (i < this.players.length - 1) {
        var tmp = this.players[i];
        this.players[i] = this.players[i + 1];
        this.players[i + 1] = tmp;
        this.renumber();
      }
    },

    save: function(player) {
      if (player.batting_no < 1 || player.batting_no > 11) {
        return false;
      }
      var i = this.lookup(player);
      if (i < 0) {
        return false;
      }
      //alert(player.batting_no +
      //  ' != ' + (i + 1));
      if (player.batting_no != i + 1) {
        //alert("Change");
        this.players.splice(i, 1);
        //alert("Removed item "+i);
        this.players.splice(player.batting_no - 1, 0, player);
        //alert("Added item "+ (player.batting_no - 1));
        this.renumber();
      } else {
        this.players[i] = player;
      }
      storage.put(this.team, this.players);
      this.reset();
    },
    renumber: function() {
      // alert(this.players.length);
      for (var i = 0; i < this.players.length; i++) {
        this.players[i].batting_no = i + 1;
        this.players[i].old_batting_no = i + 1;
        // alert(this.players[i].name + " : " + this.players[i].batting_no);
      }
    },
    sort_by_batting_no: function() {
      this.players.sort(function(a, b) {
        // alert(a.batting_no + " : " + b.batting_no);
        return a.batting_no - b.batting_no;
      });
    },
    start_bowling: function(player) {
      console.log("In start_bowling");
      var bowling = this.get_bowling();
      if (bowling.length >= 2) {
        return false;
      }
      // alert(1);
      console.log("Still in start_bowling");
      var bowlers = this.get_bowlers();
      // alert(JSON.stringify(bowlers));
      var next_bowler_no = bowlers.length ? bowlers[bowlers.length - 1].bowler + 1 : 1;
      console.log("next_bowler_no " + next_bowler_no);
      var i = this.lookup(player);
      if (i >= 0) {
        this.players[i].bowler = next_bowler_no;
        this.players[i].bowling = true;
        console.log("i=" + i + " .bowler=" + next_bowler_no);
      }
      console.log("End start_bowling");
      return true;
    },
    stop_bowling: function(player) {
      var i = this.lookup(player);
      if (i >= 0) {
        this.players[i].bowling = false;
        return true;
      }
      return false;
    },
    get_bowlers: function() {
      var bowlers = [];
      for (var i = 0; i < this.players.length; i++) {
        if (this.players[i].bowler) {
          bowlers.push(this.players[i]);
        }
      }
      bowlers = bowlers.sort(this.sort_by_bowler_no);
      return bowlers;
    },
    get_bowling: function() {
      var bowlers = this.get_bowlers();
      var bowling = [];
      for (var i = 0; i < bowlers.length; i++) {
        if (bowlers[i].bowling) {
          bowling.push(bowlers[i]);
        }
      }
      return bowling;
    },
    reset: function() {
      if (this.team) {
        var p = storage.get(this.team);
        this.players = p ? p : this.team == "home" ? home_players : away_players;
        this.sort_by_batting_no();
        this.renumber();
      }
    },
    accept: function() {
      storage.put(this.team, this.players);
      // alert('put '+this.team+' '+JSON.stringify(this.players));
      this.broadcast_players();
    },
    broadcast_players: function() {
      $rootScope.$broadcast('players_changed', {
        'home_players': storage.get('home'),
        'away_players': storage.get('away')
      });
    },
    set_team: function(team) {
      // alert(team);
      this.team = team;
    },
    clear_bowlers: function(team) {
      var players = storage.get(team);
      for (var i = 0; i < players.length; i++) {
        players[i].bowling = false;
        players[i].bowler = false;
      }
      storage.put(team, players);
      this.broadcast_players();
    },
    sort_by_bowler_no: function(a, b) {
      if (!a.bowler) {
        a.bowler = 0;
      }
      if (!b.bowler) {
        b.bowler = 0;
      }
      return parseInt(a.bowler) - parseInt(b.bowler);
    }
  };

  obj.set_team('home');
  obj.reset();
  obj.accept();
  obj.set_team('away');
  obj.reset();
  obj.accept();

  //alert('Here');
  return obj;

}]);
