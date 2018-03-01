app.controller('AdminProfil', function ($timeout, notify, $scope, $http, $stateParams, $mdDialog, $ionicLoading) {

  var loading_screen = pleaseWait({
    logo: "#",
    backgroundColor: '#CBDDFF',
    loadingHtml: "<div class='spinner'><div class='cube1'></div><div class='cube2'></div></div>"
  });


  notify.config({
    duration : 2000,
    maximumOpen : 1,
    startTop : 4
  })

  if($stateParams)
  $scope.login = $stateParams.login;

  var spinner_show = function()
  {
    $ionicLoading.show({ //Spinner au chargement initial
          content: 'Loading', animation: 'fade-in', showBackdrop: true,
          duration: 10000, maxWidth: 200,  showDelay: 0
          });
  }

  var get_profil_function = function()
  {

    spinner_show()

    $http.get('/api/LIST_PROFIL_FONCTION' )
         .success(function(data) {
                  console.log(data)
                  $ionicLoading.hide()
                  $scope.PROFIL_FONCTION = data
                  })
          .error(function(err) {
                  console.log(err)
                  notify('ERREUR : ' + err.code );
                  });
  }

  $scope.get_admin = function()
  {

    $http.get('/api/LIST_PROFILS' )
         .success(function(data) {
                  console.log(data)
                  $scope.PROFILS = data
                  })
          .error(function(err) {
                  console.log(err)
                  notify('ERREUR : ' + err.code );
                  });

    $http.get('/api/LIST_FONCTIONS' )
         .success(function(data) {
                  console.log(data)
                  $scope.FONCTIONS = data
                  })
          .error(function(err) {
                  console.log(err)
                  notify('ERREUR : ' + err.code );
                  });

    $http.get('/api/LIST_FONCTIONS_CAT' )
         .success(function(data) {
                  console.log(data)
                  $scope.FONCTIONS_CAT = data
                  })
          .error(function(err) {
                  console.log(err)
                  notify('ERREUR : ' + err.code );
                  });

      get_profil_function()

  }



  $scope.$on('ngRepeatFinished', function (event) {
    console.log(event)
    loading_screen.finish()
    $ionicLoading.hide()
  });

  $scope.switch_pf = function(key1,key2,value2,parent)
  {
    spinner_show()
    var data = {login: $scope.login, PROFIL: key2, FONCTION:key1, AUTORIZED: value2}
    console.log( key1 + '-' + key2 + '-' + value2 + '-' + parent)
    if(parent)
        $http.post('/api/UPDATE_PROFIL_FONCTION_PARENT' , data )
             .success(function(data) {
                  $ionicLoading.hide()
                  if (value2 == true)
                  notify('Ajout de la fonction au profil');
                  else
                  notify('Suppression de la fonction du profil');
                       })

             .error(function(err) {
                   console.log(err)
                   notify('ERREUR : ' + err.code );
                   });
    else
      $http.post('/api/UPDATE_PROFIL_FONCTION' , data )
           .success(function(data) {
                $ionicLoading.hide()
                if (value2 == true)
                notify('Ajout de la fonction au profil');
                else
                notify('Suppression de la fonction du profil');
                     })

           .error(function(err) {
                 console.log(err)
                 notify('ERREUR : ' + err.code );
                 });
  }

  $scope.expand_CAT = function(CAT) {
              if  ($scope.isItemExpanded(CAT))
              {
                $scope.shownCAT = null
              }
              else
              {
              $scope.shownCAT = CAT

              }
          };

    $scope.isItemExpanded = function(CAT) {
      // console.log("shownitem : " + $scope.shownItem)
            return $scope.shownCAT === CAT;
          };


});
