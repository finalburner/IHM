app.controller('IDCtrl', function ( $scope, $http, $stateParams) {
  if($stateParams)
  console.log($stateParams)
  var NumCT = $stateParams.CT
  var login = $stateParams.login

  $scope.ADD_EQ = function()
  {
    $scope.Eqpt.push({
       COL_LBL: '',
       CTH_NUM_CT: '',
       EQP_ADRESSE: '',
       EQP_CONTACT: '',
       EQP_CONTACT_TEL: '',
       EQP_DESIGNATION: '',
       EQP_NB_CAPTEUR: '',
       EQP_NUM: '',
       EQP_SERVICE_FON: '',
       EQP_SERVICE_GES: '',
       EQT_DESIGNATION: '',
    })
    console.log($scope.Eqpt)
  }

  function get_CT()
{
  $http.get('/api/Energies' )
     .success(function(data) {
        $scope.Energies = data
        // console.log(data)

                })
     .error(function(data) {
     console.log('Error: ' + data);
     });

    $http.get('/api/CTH_SIGNALE' )
        .success(function(data) {
           $scope.CTH_SIGNALE = data
           // console.log(data)
                   })
        .error(function(data) {
        console.log('Error: ' + data);
        });

   $http.get('/api/Type_CT' )
        .success(function(data) {
           $scope.Type = data
           console.log(data)

                     })
        .error(function(data) {
        console.log('Error: ' + data);
        });

   $http.get('/api/Contrat' )
            .success(function(data) {
              $scope.Contrat = data
              // console.log(data)

                          })
           .error(function(data) {
           console.log('Error: ' + data);
   });


   $http.get('/api/Status'  )
        .success(function(data) {
           $scope.Status = data
           // console.log(data)
                   })
        .error(function(data) {
        console.log('Error: ' + data);
        });

  $http.post('/api/CT' , { CT : NumCT } )
     .success(function(data) {
       console.log(data)
        $scope.DATA = data
        $scope.DATA.LOGIN = login
        if ($scope.DATA.CTH_SUPERVISE) $scope.DATA.CTH_SUPERVISE = 'true'
        if (!$scope.DATA.CTH_SUPERVISE) $scope.DATA.CTH_SUPERVISE = 'false'
        if (data.CTH_UPD_DTH)  $scope.s1 = " : "
        else $scope.s1 = ""
        if (data.CTH_COM_AUTEUR_NOM) $scope.s2 = " > "
        else $scope.s2 = ""

              })
     .error(function(data) {
     console.log('Error: ' + data);
     });

     $http.post('/api/Exp' , { CT : NumCT } )
     .success(function(data) {
       console.log(data)
       $scope.Exp = data ;
     });

      $http.post('/api/Eqpt' , { CT : NumCT } )
      .success(function(data) {
      console.log(data)
      $scope.Eqpt = data ;
      });

      $http.post('/api/GpeFonc' , { CT : NumCT } )
      .success(function(data) {
      console.log(data)
      $scope.GpeFonc = data ;
      });

      $http.post('/api/NbeGroup' , { CT : NumCT } )
      .success(function(data) {
      console.log(data)
      $scope.NbeGroup = data ;
      });
  }
  get_CT();


})

app.controller('AdmCtrl', function ( $scope, $http, $stateParams) {
  if($stateParams)
  console.log($stateParams)

  $scope.USER_GROUP = []

  $scope.SET_AUTORIZED = function(item)
  {
      console.log(item)
      $http.post('/api/User_GroupeExp_Apply' , item )
         .success(function(data) {
            console.log(data)

                    })
         .error(function(data) {
         console.log('Error: ' + data);
    })
  }

  function get_user_grp()
  {
    $http.post('/api/User_GroupeExp' , { user : $scope.user_selected} )
       .success(function(data) {
          $scope.USER_GROUP = data
          console.log(data)

                  })
       .error(function(data) {
       console.log('Error: ' + data);
  })
  }

  $scope.Select_User = function(item) {
            $scope.user_selected = item.UTI_LOGIN
            console.log($scope.user_selected)
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
   console.log("Profil de l'utilisateur " + item.UTI_LOGIN + " changé")
                 })
      .error(function(data) {
      console.log('Error: ' + data);
 })
 }

$scope.Reset_CT_Search = function()
    {
      $ionicScrollDelegate.scrollTop()
    }

$scope.con = function(item) //test console
 {
console.log(item)

 }


  // $scope.initialisation = function()
$scope.get_admin = function()
{

  $http.get('/api/Profil' )
     .success(function(data) {
        $scope.Profil = data
        console.log(data)

                })
     .error(function(data) {
     console.log('Error: ' + data);
})

$http.get('/api/Users_Profil' )
   .success(function(data) {
      $scope.Users = data
      console.log(data)

              })
   .error(function(data) {
   console.log('Error: ' + data);
})

}


    $scope.UPDATE = function()
  {

    console.log($scope.DATA)
    $http.post('/api/Update'
    , $scope.DATA
    )
    .success(function(data) {
    get_CT();
    });
  }

});
//------------------------------------------------------------------------------
// Fonction Update Commentaires et Fiche Identité
app.controller('AdvSearch', function ($scope, $http, $stateParams) {
     if($stateParams)
     console.log($stateParams)
      console.log("advsearch")
     $http.get('/api/RechercheAvancee')
       .success(function(data) {
         console.log(data)
         $scope.gridOptions.data = data;
       }).error(function(data) {
         console.log('Error: ' + data);
         });


        $scope.gridOptions = {
            showGridFooter: true,
            showColumnFooter: true,
            enableFiltering: true,
            // columnDefs: [
            //     { field: 'datetime' , width: "*", displayName: 'Horodatage'  },
            //     { field: 'type', width: "*",  displayName: 'Catégorie'  },
            //     { field: 'event', width: "*",  displayName: 'Evènement'  },
            //     { field: 'source', width: "*", displayName: 'Emetteur'  },
            //     { field: 'cible', width: "*", displayName: 'Récepteur' },
            //     { field: 'info', width: "*", displayName: 'Information' }
            //
            //
            //     // { field: 'address.street',aggregationType: uiGridConstants.aggregationTypes.sum, width: '13%' },
            //     // { field: 'age', aggregationType: uiGridConstants.aggregationTypes.avg, aggregationHideLabel: true, width: '13%' },
            //     // { name: 'ageMin', field: 'age', aggregationType: uiGridConstants.aggregationTypes.min, width: '13%', displayName: 'Age for min' },
            //     // { name: 'ageMax', field: 'age', aggregationType: uiGridConstants.aggregationTypes.max, width: '13%', displayName: 'Age for max' },
            //     // { name: 'customCellTemplate', field: 'age', width: '14%', footerCellTemplate: '<div class="ui-grid-cell-contents" style="background-color: Red;color: White">custom template</div>' },
            //     // { name: 'registered', field: 'registered', width: '20%', cellFilter: 'date', footerCellFilter: 'date', aggregationType: uiGridConstants.aggregationTypes.max }
            // ],
            // onRegisterApi: function(gridApi) {
            //         $scope.gridApi = gridApi;
            // }
        };

        // $scope.toggleFooter = function() {
        //   $scope.gridOptions.showGridFooter = !$scope.gridOptions.showGridFooter;
        //   $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.OPTIONS);
        // };
        //
        // $scope.toggleColumnFooter = function() {
        //   $scope.gridOptions.showColumnFooter = !$scope.gridOptions.showColumnFooter;
        //   $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.OPTIONS);
        // };


  });
//------------------------------------------------------------------------------
// Fonction recherche simple CT
app.controller('FilterSimple', function($scope,$http,$stateParams) {
    if($stateParams)
    console.log($stateParams)
    var search = $scope.recherche;
    var NumCT = $scope.CTH_NUM_CT;
    console.log(NumCT)
//-----------------------------------------
     $scope.get_FilterSimple = function()
    {
   $http.post('/api/RechSimpleCT'
     , {search : $scope.recherche}
     , {CT : NumCT}
  )
   .success(function(data) {
      console.log(data)
      $scope.RechSimpleCT = data ;
     });
    }
});
//------------------------------------------------------------------------------
//Fonction recherche simple CT/EQP
app.controller('FilterCT', function($scope,$http,$stateParams) {
    if($stateParams)
    console.log($stateParams)
    var search = $scope.recherche;
    var NumCT = $scope.CTH_NUM_CT;
    console.log(NumCT)
//---------------------------------
   $scope.get_FilterCT = function()
   {
   $http.post('/api/RechSimpleCTEQP'
   , {search : $scope.recherche}
   , {CT : NumCT}
  )
   .success(function(data) {
    $scope.RechSimpleCTEQP = data ;
   });
  }
});
//------------------------------------------------------------------------------
// Fonction AdmProfil
app.controller('AdmProfil', function ($scope, $http, $stateParams) {

$scope.get_admin = function()
{
  //Liste des profils
        $http.get('/api/ListProfil' )
          .success(function(data) {
           console.log(data);
           $scope.Liste_Profil = data;
        }).error(function(data) {
         console.log('Error: ' + data);
        })


}

});
//------------------------------------------------------------------------------
// Fonction Liste Utilisateurs
app.controller('Liste', function ($scope, $http, $stateParams) {
    if($stateParams)
    var login = $stateParams.LOGIN;
    console.log($stateParams)
//--------------------------------------
       $scope.get_DroitsListe = function()
           {
             $http.post('/api/DroitsListe'
             , { LOGIN : login }
            )
             .success(function(data) {
              console.log(data);
              $scope.DroitsListe = data;
           });
           }
});
//------------------------------------------------------------------------------
// Fonction Profil Utilisateurs
app.controller('Profil', function ($scope, $http, $stateParams) {
    if($stateParams)
    var login = $stateParams.LOGIN;
    var DROIT1 = [];
    console.log($stateParams)
//--------------------------------------
    $scope.MODIF_DROIT1= function(item) { // ??
    console.log(item)
    //DROIT1.push ({userLogin : item.UTI_LOGIN, codeFonction : item.UPR_COD, autorized : item.VAL})
    DROIT1.push ({login : item.UTI_LOGIN, codeFonction : item.UPR_COD, val : item.VAL})
    console.log(DROIT1)
    }
    //------------------------------------
        $scope.ENVOYER = function ()
        {
          console.log(DROIT1)
          $http.post('/api/Droits_New1'
            , { DROIT1 : DROIT1 } )
            .success(function(data) {
            console.log(data);
            $scope.Droits_New1 = data;
        });
      }
    //--------------------------------------
//--------------------------------------
       $scope.get_DroitsProfil = function()
           {
             $http.post('/api/DroitsProfil'
              , { LOGIN : login }
            )
             .success(function(data) {
              console.log(data);
              console.log('Test Droits Profil');
              $scope.DroitsProfil = data;
           });
           }
});
//------------------------------------------------------------------------------
// Fonction Groupe Utilisateurs
app.controller('Groupe', function ($scope, $http, $stateParams) {
    if($stateParams)
    var login = $stateParams.LOGIN;
    console.log($stateParams)
//--------------------------------------
       $scope.get_DroitsGroupe = function()
           {
             $http.post('/api/DroitsGREP'
              , { LOGIN : login }
            )
             .success(function(data) {
              console.log(data);
              console.log('Fonction Groupe');
              $scope.DroitsGREP = data;
           });
           }
});
//------------------------------------------------------------------------------
// Fonction Liste Profil Utilisateurs
app.controller('ListeProfil', function ($scope, $http, $stateParams) {
    if($stateParams)
      console.log($stateParams)
//--------------------------------------
       $scope.get_ListProfil = function()
           {
             $http.post('/api/ProfilListe'
            )
             .success(function(data) {
              console.log(data);
              console.log('Liste Profil');
              $scope.ProfilListe = data;
           });
           }
});
//------------------------------------------------------------------------------
// Fonction Fonction Profil
app.controller('FonctionProfil', function ($scope, $http, $stateParams) {
    if($stateParams)
      var upr_cod = $stateParams.UPR_COD;
      var DROIT3 =[];
      //console.log($stateParams)
      console.log(DROIT3)
      //------------------------------------  ????????????????
          $scope.ENVOYER = function ()
          {
            console.log(DROIT3)
            $http.post('/api/Droits_New2'
              , { DROIT3 : DROIT3 } )
              .success(function(data) {
              console.log(data);
              $scope.Droits_New2 = data;
          });
        }
      //--------------------------------------
       $scope.get_FonctionP = function()
           {
             $http.post('/api/Fonctions'
             , { UPR_COD : upr_cod }  // ??
            )
             .success(function(data) {
              console.log(data);
              console.log('Fonction Profil');
              $scope.Fonctions = data;
           });
           }
});
//------------------------------------------------------------------------------
