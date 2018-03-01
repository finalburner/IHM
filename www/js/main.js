/**
 * Main AngularJS Web Application
 */
agGrid.initialiseAgGridWithAngular1(angular);

var app = angular.module('myApp', ['angularViewportWatch','vs-repeat','angularjs-dropdown-multiselect','agGrid','cgNotify','anguFixedHeaderTable','ui.router','ionic','ui.grid','ui.grid.selection','ui.grid.resizeColumns', 'ui.grid.moveColumns','ngMaterial','ui.bootstrap.contextMenu']);

app.config(['$stateProvider','$urlRouterProvider', function ($stateProvider,$urlRouterProvider) {
  $stateProvider

.state('identite', {
    url: '/identite/{CT}/{login}/{edition}/{searchbar}',
    templateUrl: 'partials/Identite.html',
    controller: 'Identite'
  })

.state('adminuser', {
  url: '/adminuser/{login}/',
  templateUrl: 'partials/adminuser.html',
  controller: 'AdminUser'
  })

.state('adminprofil', {
  url: '/adminprofil/{login}/',
  templateUrl: 'partials/adminprofil.html',
  controller: 'AdminProfil'
})


.state('rechercheavancee', {
  url: '/rechercheavancee/{login}/',
  templateUrl: 'partials/RechercheAvancee.html',
  controller: 'AdvSearch'
})

.state('recherchesimple', {
  url: '/recherchesimple/{login}/',
  templateUrl: 'partials/RechercheSimple.html',
  controller: 'SimSearch'
})


//
// .state('recherche', {
// url: '/recherchesimple/',
// templateUrl: 'partials/RechercheSimple.html',
// controller: 'FilterSimple'
// })
//
// .state('consistance', {
// url: '/consistance/{CT}',
// templateUrl: 'partials/FicheConsistance.html',
// controller: 'AppCtrl'
// })


//
// .state('droitsautorisations', {
// url: '/droitsautorisations/{LOGIN}',
// templateUrl: 'partials/droitsautorisations.html',
// controller: 'DroitsCtrl'
// })
// // Profil Utilisateur
// .state('profil', {
// url: '/profil/{LOGIN}',
// templateUrl: 'partials/profil.html',
// controller: 'Profil'
// })

}])
