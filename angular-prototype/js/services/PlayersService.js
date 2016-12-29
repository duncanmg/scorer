angular.module("scorer").factory('Players', ['Storage', function(Storage) {

  'use strict';

  var players = [{
    id: 1,
    name: 'Alastair Cook'
  }, {
    id: 2,
    name: 'Haseeb Hameed'
  }, {
    id: 3,
    name: 'Keaton Jennings'
  }, {
    id: 4,
    name: 'Joe Root'
  }, {
    id: 5,
    name: 'Jonny Bairstow'
  }, {
    id: 6,
    name: 'Ben Stokes'
  }, {
    id: 7,
    name: 'Ben Duckett'
  }, {
    id: 8,
    name: 'Moeen Ali'
  }, {
    id: 9,
    name: 'Chris Woakes'
  }, {
    id: 10,
    name: 'Chris Broad'
  }, {
    id: 11,
    name: 'Jimmy Anderson'
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
      }
    },

    save: function(player) {
      // alert("Save "+player.id);
      var i = this.lookup(player);
      if (i < 0) {
        return false;
      }
      this.players[i] = player;
      Storage.put('players', this.players);
    },
    reset: function() {
      var p = Storage.get('players');
      this.players = p ? p : players;
    }
  };

  obj.reset();

  return obj;

}]);
