angular.module("scorer", ['ui.router']).config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('app', {
      url: '/',
      views: {
        //  'header': {
        //      templateUrl : 'views/header.html',
        //  },
        'content': {
          templateUrl: '/main.htm',
          controller: 'ScorerController'
        } //,
        //  'footer': {
        //      templateUrl : 'views/footer.html',
        //  }
      }

    });


});

//     .when("/other", {
//         templateUrl : "red.htm"
//     })
//     // .when("/green", {
//     //     templateUrl : "green.htm"
//     // })
//     // .when("/blue", {
//     //     templateUrl : "blue.htm"
//     // })
//     ;
// });
