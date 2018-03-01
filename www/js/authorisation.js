// Redirection sur la page de login
module.config(function ($httpProvider) {
    $httpProvider.interceptors.push(function ($location) {
        return {
            'responseError': function (rejection) {
                if (rejection.status === 401) {
                    $location.url('/connexion?returnUrl=' + $location.path());
                }
            }
        };
    });
});

// Sécurisation des routes
module.config(function ($routeProvider) {
    $routeProvider
        .when("/anonymous",
        {
            controller: "anonymousController",
            templateUrl: "app/views/anonymousPage.html"
        })
        .when("/connected",
        {
            controller: "connectedController",
            templateUrl: "app/views/connectedPage.html",
            authorized: true
        })
        .otherwise({ redirectTo: "/anonymous" });
});
module.run(function($rootScope, $location, userService) {
    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        if (next.$$route.authorized  && !userService.isConnected()) {
            $location.url("/connexion?returnUrl=" + $location.path());
        }
    });
});

// Afficher ou cacher des éléments
module.directive("showWhenConnected", function (userService) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var showIfConnected = function() {
                if(userService.isConnected()) {
                    $(element).show();
                } else {
                    $(element).hide();
                }
            };

            showIfConnected();
            scope.$on("connectionStateChanged", showIfConnected);
        }
    };
});
module.directive("hideWhenConnected", function (userService) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var hideIfConnected = function() {
                if(userService.isConnected()) {
                    $(element).hide();
                } else {
                    $(element).show();
                }
            };

            hideIfConnected();
            scope.$on("connectionStateChanged", hideIfConnected);
        }
    };
});
