app

.config(function ($mdThemingProvider) {
  $mdThemingProvider.setDefaultTheme('indigo');
  $mdThemingProvider.theme('indigo')
    .primaryPalette('indigo');
   $mdThemingProvider.theme('red')
     .primaryPalette('red');

   $mdThemingProvider.theme('blue')
     .primaryPalette('blue');

 })

.config(function($urlRouterProvider){
   $urlRouterProvider.rule(function ($injector, $location) {
       var path = $location.url();

       // check to see if the path already has a slash where it should be
       if (path[path.length - 1] === '/' || path.indexOf('/?') > -1) {
           return ;
       }

       if (path.indexOf('?') > -1) {
           return path.replace('?', '/?');
       }

       return path + '/' ;
   });
 })

.config(['$mdAriaProvider', function ($mdAriaProvider) {
         $mdAriaProvider.disableWarnings();
     }])


.filter('orderObjectBy', function() {
       return function(items, field, reverse) {
         var filtered = [];
         angular.forEach(items, function(item) {
           filtered.push(item);
         });
         filtered.sort(function (a, b) {
           return (a[field] > b[field] ? 1 : -1);
         });
         if(reverse) filtered.reverse();
         return filtered;
       };
     })

 .directive('onFinishRender', function ($timeout) {
     return {
         restrict: 'A',
         link: function (scope, element, attr) {
             if (scope.$last === true) {
                 $timeout(function () {
                     scope.$emit(attr.onFinishRender);
                 });
             }
         }
     }
 })
