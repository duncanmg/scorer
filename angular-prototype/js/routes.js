angular.module("scorer", ['ui.router', 'ngResource']).config(function($stateProvider, $urlRouterProvider) {
  'use strict';
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('scorer', {
      'url': '/',
      'views': {
        'content': {
          'templateUrl': 'main.htm',
          'controller': 'ScorerController'
        }
      }
    })
    .state('others', {
      'url': '/others',
      'views': {
        'content': {
          'templateUrl': 'others.htm',
          'controller': 'OthersController'
        }
      }
    })
    .state('settings', {
      'url': '/settings',
      'views': {
        'content': {
          'templateUrl': 'settings.htm',
          'controller': 'SettingsController'
        }
      }
    }).state('players', {
      'url': '/players/:team',
      'views': {
        'content': {
          'templateUrl': 'players.htm',
          'controller': 'PlayersController'
        }
      }
    }).state('edit_player', {
      'url': '/players/edit/:team/:playerId',
      'views': {
        'content': {
          'templateUrl': 'edit_player.htm',
          'controller': 'EditPlayerController'
        }
      },
      'resolve': {
        team: ['$stateParams', function($stateParams) {
          alert('Bang Banana ' + JSON.stringify($stateParams));
          return $stateParams.team;
        }]
      }
    }).state('new_match', {
      'url': '/new_match',
      'views': {
        'content': {
          'templateUrl': 'main.htm',
          'controller': 'NewMatchController'
        }
      }
    });


});
