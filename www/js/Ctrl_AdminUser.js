app.controller('AdminUser', function ( notify, $scope, $http, $stateParams, $mdDialog, $ionicLoading) {

  var loading_screen = pleaseWait({
    logo: "#",
    backgroundColor: '#CBDDFF',
    loadingHtml: "<div class='spinner'><div class='cube1'></div><div class='cube2'></div></div>"
  });


  // $ionicLoading.show({ //Spinner au chargement initial
  //       content: 'Loading', animation: 'fade-in', showBackdrop: true,
  //       duration: 5000, maxWidth: 200,  showDelay: 0
  //       });

  notify.config({
    duration : 2000,
    maximumOpen : 1,
    startTop : 4
  })

  if($stateParams)
  var login = $stateParams.login;
  // $ionicLoading.hide() //enleve le spinner
  // $ionicLoading.show({ //Spinner au chargement initial
  //       content: 'Loading', animation: 'fade-in', showBackdrop: true,
  //       duration: 3000, maxWidth: 200,  showDelay: 0
  //       });
  $scope.USER_GROUP = []

$scope.SET_AUTORIZED = function(item)
  {
       console.log(item)
       $http.post('/api/User_GroupeExp_Apply' , item )
            .success(function(data) {
             if (item.UGE_AUTORIZED == true)
             notify('Ajout du groupe d\'Exploitation ' + item.UGE_GRE_NOM);
             else
             notify('Suppression du groupe d\'Exploitation ' + item.UGE_GRE_NOM);
                  })
            .error(function(err) {
                  console.log(err)
                  notify('ERREUR : ' + err.code );
                  });
}

function get_user_grp()
{
    $http.post('/api/User_GroupeExp' , { user : $scope.user_selected} )
         .success(function(data) {
                  $scope.USER_GROUP = data
                  console.log(data)
                  })
         .error(function(err) {
                  console.log(err)
                  notify('ERREUR : ' + err.code );
                  });
}
$scope.get_profil = function(item)
{
 var h = $scope.Profil.findIndex((obj) => obj.UPR_ID == item)
 if(h!=-1) return $scope.Profil[h].UPR_LBL

}
$scope.Select_User = function(item) {
            $scope.user_selected = item.UTI_LOGIN
            $scope.user_selected_name = item.UTI_NOM + ' ' + item.UTI_PRENOM
            get_user_grp()
        };

$scope.isUserSelected = function(item) {
    // console.log("shownitem : " + $scope.shownItem)
          return $scope.user_selected === item.UTI_LOGIN;
        };

$scope.UPDATE_UTI_PROFIL = function(item)
 {
   $http.post('/api/UPDATE_UTI_PROFIL' , item )
        .success(function(data) {
                 notify('Profil utilisateur mis à jour');
                 })
         .error(function(err) {
                 console.log(err)
                 notify('ERREUR : ' + err.code );
                 });
 }

$scope.Reset_CT_Search = function()
    {
      $ionicScrollDelegate.scrollTop()
    }

$scope.get_admin = function()
{

  $http.post('/api/Droits' , { LOGIN : login } )
        .success(function(data) {
                 $scope.Droits = data;
                 $scope.menuOptions = $scope.menuOptions.map((obj) => {
                   if(obj) { obj.enabled = data.FADMGU ? true : false ; return obj}
                   else return null
                 })
                 // console.log($scope.menuOptions)
                 $ionicLoading.hide()
                 loading_screen.finish()
         })
        .error(function(err) {
                   console.log(err)
                   notify('ERREUR : ' + err.code );
                 });

  // $http.get('/api/AD_USER' )
  //      .success(function(data) {
  //               console.log(data)
  //               })
  //       .error(function(err) {
  //               console.log(err)
  //               notify('ERREUR : ' + err.code );
  //               });

  $http.get('/api/Profil' )
       .success(function(data) {
                $scope.Profil = data
                console.log(data)
                $ionicLoading.hide()
                })
       .error(function(err) {
               console.log(err)
               notify('ERREUR : ' + err.code );
               });

  $http.get('/api/Users_Profil' )
       .success(function(data) {
              $scope.Users = data
              console.log(data)
              })
        .error(function(err) {
              console.log(err)
              notify('ERREUR : ' + err.code );
              });
}


function EDIT_USER (username)
{

   $mdDialog.show({
                  templateUrl: 'popup/EDIT_USER.html',
                  parent: angular.element(document.body),
                  scope: $scope,
                  clickOutsideToClose:true,
                  preserveScope: true,
                  autoWrap:false
    })
      $http.post('/api/USER_INFO' , { username : username })
           .success(function(data) {
                    $scope.USER_INFO = data
                    console.log(data)
                    $scope.USER_INFO.login = login
                    })
           .error(function(err) {
                    console.log('Error: ' + err);
                    })
}

$scope.New_User_Select = function(user)
{

   var i = $scope.NEW_USER_LIST.findIndex((obj) => { return obj.UTI_LOGIN == $scope.USER_TO_ADD.UTI_LOGIN})
   if (i!=-1)  $scope.USER_TO_ADD = angular.copy($scope.NEW_USER_LIST[i])

    console.log($scope.USER_TO_ADD  )
}

function ADD_USER ()
{

  $ionicLoading.show({ //Spinner au chargement initial
           content: 'Loading', animation: 'fade-in', showBackdrop: true,
           duration: 5000, maxWidth: 200,  showDelay: 0
                    });

  $scope.USER_TO_ADD = {
              UTI_ACTIF : 'NULL' ,
              UTI_HAB_ASTREINTE : 'NULL',
              UTI_LOGIN : '',
              UTI_MAIL : '',
              UTI_NOM : '',
              UTI_PRENOM : '',
              UTI_UPR_ID : 'NULL'
            }

  $http.get('/api/NEW_USER')
       .success(function(data) {
                console.log(data)
                $scope.NEW_USER_LIST = data
                $ionicLoading.hide()
                $mdDialog.show({
                               templateUrl: 'popup/ADD_USER.html',
                               parent: angular.element(document.body),
                               scope: $scope,
                               clickOutsideToClose:true,
                               preserveScope: true,
                               autoWrap:false
                 })

                })

          .error(function(err) {
                console.log('Error: ' + err);
                })


}

function DEL_USER (username)
{

  $mdDialog.show({
                  templateUrl: 'popup/DEL_USER.html',
                  parent: angular.element(document.body),
                  scope: $scope,
                  clickOutsideToClose:true,
                  preserveScope: true,
                  autoWrap:false
                })
}

$scope.apply_del_user = function()
{

$mdDialog.hide();
$ionicLoading.show({ //Spinner au chargement initial
        content: 'Loading', animation: 'fade-in', showBackdrop: true,
        duration: 5000, maxWidth: 200,  showDelay: 0
    });

$http.post('/api/USER_DEL', { username : $scope.user_selected })
     .success(function(data) {
              $ionicLoading.hide()
              notify('Utilisateur ' + $scope.user_selected_name + ' supprimé');
              var i = $scope.Users.findIndex((obj) => { return obj.UTI_LOGIN == $scope.user_selected})
              console.log(i)
              $scope.Users.splice(i,1)
              })
      .error(function(err) {
              console.log('Error: ' + err);
              })


}

$scope.apply_add_new_user = function()
{
  $mdDialog.hide();
  $ionicLoading.show({ //Spinner au chargement initial
        content: 'Loading', animation: 'fade-in', showBackdrop: true,
        duration: 5000, maxWidth: 200,  showDelay: 0
    });
    console.log($scope.USER_TO_ADD)

  if (!$scope.USER_TO_ADD.UTI_ACTIF) $scope.USER_TO_ADD.UTI_ACTIF = false
  if (!$scope.USER_TO_ADD.UTI_HAB_ASTREINTE) $scope.USER_TO_ADD.UTI_HAB_ASTREINTE = false

  $http.post('/api/USER_ADD' , $scope.USER_TO_ADD )
       .success(function(data) {
         notify('Utilisateur Ajouté');
         $http.get('/api/Users_Profil' )
              .success(function(data) {
                     $scope.Users = data
                     $ionicLoading.hide()
                     })
               .error(function(err) {
                     console.log(err)
                     notify('ERREUR : ' + err.code );
                     });
                })
        .error(function(err) {
                console.log(err)
                notify('ERREUR : ' + err.code );
                })
}

$scope.apply_edit_user = function()
{
  $http.post('/api/USER_UPDATE' , $scope.USER_INFO )
       .success(function(data) {
                $mdDialog.hide();
                notify('Informations utilisateur modifiées');
                var i = $scope.Users.findIndex((obj) => { return obj.UTI_LOGIN == $scope.USER_INFO.UTI_LOGIN})
                $scope.Users[i] = $scope.USER_INFO
                console.log($scope.Users)

                })
        .error(function(err) {
                console.log(err)
                notify('ERREUR : ' + err.code );
                })
}

$scope.close_popup = function (){
  $mdDialog.hide();
}

$scope.menuOptions = [
      // NEW IMPLEMENTATION
      {
          text: 'Modifier',
          click: function ($itemScope, $event, modelValue, text, $li) {
            EDIT_USER($scope.user_selected)
          },
          enabled: false

      },
      {
          text: 'Supprimer',
          click: function ($itemScope, $event, modelValue, text, $li) {
          DEL_USER($scope.user_selected)
          },
          enabled: false
      },
      null
      ,
      {
          text: 'Ajouter ',
          click: function ($itemScope, $event, modelValue, text, $li) {
          ADD_USER()
          },
          enabled: false
      },
      // // LEGACY IMPLEMENTATION
      // ['Select', function ($itemScope, $event, modelValue, text, $li) {
      //     // $scope.selected = $itemScope.item.name;
      // }],
      // null, // Dividier
      // ['Remove', function ($itemScope, $event, modelValue, text, $li) {
      //     // $scope.items.splice($itemScope.$index, 1);
      // }]
];

});
