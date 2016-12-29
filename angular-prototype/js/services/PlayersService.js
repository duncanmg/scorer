angular.module("scorer").factory('Players', ['Storage', function(Storage) {

  'use strict';

  var players = [{
    id: 1,
    name: 'Alastair Cook',
    batting_no: 1
  }, {
    id: 2,
    name: 'Haseeb Hameed',
    batting_no: 2
  }, {
    id: 3,
    name: 'Keaton Jennings',
    batting_no: 3
  }, {
    id: 4,
    name: 'Joe Root',
    batting_no: 4
  }, {
    id: 5,
    name: 'Jonny Bairstow',
    batting_no: 5
  }, {
    id: 6,
    name: 'Ben Stokes',
    batting_no: 6
  }, {
    id: 7,
    name: 'Ben Duckett',
    batting_no: 7
  }, {
    id: 8,
    name: 'Moeen Ali',
    batting_no: 8
  }, {
    id: 9,
    name: 'Chris Woakes',
    batting_no: 9
  }, {
    id: 10,
    name: 'Chris Broad',
    batting_no: 10
  }, {
    id: 11,
    name: 'Jimmy Anderson',
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
      if (player.batting_no != i+1) {
        //alert("Change");
        this.players.splice(i, 1);
        //alert("Removed item "+i);
        this.players.splice(player.batting_no - 1, 0, player);
        //alert("Added item "+ (player.batting_no - 1));
        this.renumber();
      } else {
        this.players[i] = player;
      }
      Storage.put('players', this.players);
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
    reset: function() {
      var p = Storage.get('players');
      // alert(JSON.stringify(p));
      this.players = p ? p : players;
      this.sort_by_batting_no();
      this.renumber();
    },
    accept:function(){
      Storage.put('players', this.players);
    }
  };

  obj.reset();

  return obj;

}]);
