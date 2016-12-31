angular.module("scorer").factory('Players', ['Storage', '$rootScope', function(Storage, $rootScope) {

  'use strict';

  var home_players = [{
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

  var away_players = [{
    id: 12,
    name: 'M.T.Renshaw',
    batting_no: 1
  }, {
    id: 13,
    name: 'D.A.Warner',
    batting_no: 2
  }, {
    id: 14,
    name: 'U.T.Khawaja',
    batting_no: 3
  }, {
    id: 15,
    name: 'S.P.D.Smith',
    batting_no: 4
  }, {
    id: 16,
    name: 'P.S.P.Handscomb',
    batting_no: 5
  }, {
    id: 17,
    name: 'N.J.Maddinson',
    batting_no: 6
  }, {
    id: 18,
    name: 'M.S.Wade',
    batting_no: 7
  }, {
    id: 19,
    name: 'M.A.Starc',
    batting_no: 8
  }, {
    id: 20,
    name: 'N.M.Lyon',
    batting_no: 9
  }, {
    id: 21,
    name: 'J.R.Hazlewood',
    batting_no: 10
  }, {
    id: 22,
    name: 'J.M.Bird',
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
      Storage.put(this.team, this.players);
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
      // alert("reset: "+this.team);
      if (this.team) {
        var p = Storage.get(this.team);
        // alert(JSON.stringify(p));
        this.players = p ? p : this.team == "home" ? home_players : away_players;
        this.sort_by_batting_no();
        this.renumber();
      }
    },
    accept: function() {
      Storage.put(this.team, this.players);
      // alert('put '+this.team+' '+JSON.stringify(this.players));
      this.broadcast_players();
    },
    broadcast_players: function() {
      $rootScope.$broadcast('players_changed', {
        'home_players': Storage.get('home'),
        'away_players': Storage.get('away')
      });
    },
    set_team: function(team) {
      // alert(team);
      this.team = team;
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
