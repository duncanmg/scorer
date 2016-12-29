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
      'url': '/players',
      'views': {
        'content': {
          'templateUrl': 'players.htm',
          'controller': 'PlayersController'
        }
      }
    }).state('edit_player', {
      'url': '/players/edit/:playerId',
      'views': {
        'content': {
          'templateUrl': 'edit_player.htm',
          'controller': 'EditPlayerController'
        }
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
