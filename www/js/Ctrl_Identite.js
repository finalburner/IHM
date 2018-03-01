app.controller('Identite', function ($state, $timeout, notify, $ionicLoading, i18nService, $scope, $http, $stateParams, $mdDialog) {

  // $(document).ready(function(){
  //         $('#sidebar-btn').click(function(){
  //             $('#sidebar').toggleClass('visible');
  //         });
  //     });
  
  $scope.showSeachBar = function()
  {
      $('#sidebar').toggleClass('visible');
  }

  var loading_screen = pleaseWait({
    logo: "#",
    backgroundColor: '#CBDDFF',
    loadingHtml: "<div class='spinner'><div class='cube1'></div><div class='cube2'></div></div>"
  });

  $ionicLoading.show({ //Spinner au chargement initial
        content: 'Loading', animation: 'fade-in', showBackdrop: true,
        duration: 10000, maxWidth: 200,  showDelay: 0
        });

  notify.config({
    duration : 2000,
    maximumOpen : 1,
    startTop : 4
  })

  if($stateParams)
  console.log($stateParams)
  var param = $stateParams


  var NumCT = $stateParams.CT
  var login = $stateParams.login
  //affichage normal ou mode edition
  if ($stateParams.edition == 0 || $stateParams.edition == 1 ) $scope.edition = $stateParams.edition

  if ($stateParams.searchbar == 0  )
  $scope.searchbar = false
  else if ($stateParams.searchbar == 1 )
  $scope.searchbar = true

  if (NumCT == '00000')
  {
    $scope.showID = false
    $('#sidebar').toggleClass('visible');
  }
  else {

  $scope.showID = true
}

  $scope.Selected_Eqp = []
  i18nService.setCurrentLang('fr')
  // $ionicLoading.hide() //enleve le spinner
  // $ionicLoading.show({ //Spinner au chargement initial
  //       content: 'Loading', animation: 'fade-in', showBackdrop: true,
  //       duration: 3000, maxWidth: 200,  showDelay: 0
  //       });
  $scope.menuOptions_EQP = [
     {     text: 'Supprimer',
           click: function ($itemScope, $event, modelValue, text, $li) {
           $scope.DEL_EQP($scope.itemset)
         }
       }
         ];

  //Garde en mémoire l'item appuyé en boutton droit pour le supprimer si click
  $scope.set_item = function(item)
  {
    $scope.itemset = item
  }

  $scope.UPDATE = function()
  {
    $mdDialog.show({
      templateUrl: 'popup/SAVE_CONFIRM.HTML',
      parent: angular.element(document.body),
      scope : $scope,
      clickOutsideToClose:true,
      preserveScope: true
      })
  }

  $scope.hide = function() {
    $mdDialog.hide();
    console.log("Opération annulée")
  };

  $scope.showAlert = function(err) {
     $mdDialog.show(
       $mdDialog.alert()
         .parent(angular.element(document.body))
         .clickOutsideToClose(true)
         .title('Erreur API')
         .textContent(err)
         .ok('OK')
     );
   };

  $scope.confirm = function() {
    console.log('conf')
     $mdDialog.hide();
     $ionicLoading.show({ //Spinner au chargement initial
     content: 'Loading', animation: 'fade-in', showBackdrop: true,
     duration: 5000, maxWidth: 200,  showDelay: 0
     });

     $scope.DATA.CTH_COM_ETAT_CT = $scope.DATA.CTH_COM_ETAT_CT2

     $http.post('/api/CT_Update' , $scope.DATA )
     .success(function(data) {
      $ionicLoading.hide()
     get_ALL_Lists();
     get_CT();
     notify('CT mis à jour avec succès')


     });

     $http.post('/api/Eqpt_Update' , $scope.Eqpt )
     .success(function(data) {
     });

     $http.post('/api/Exp_Update' , $scope.Exp )
     .success(function(data) {
     });
     };

  $scope.ADD_NEW_EQP = function()
  {
       var Eqpt_lenth,d,i;
       for ( i=0 ; i < $scope.Selected_Eqp.length; i++) //Ajoute les nouveaux elements.
       {
            Eqpt_lenth = $scope.Eqpt.length // taille de la table EQP cible
            //verifie si un EQP existe déja dans la liste pour ne pas rajouter un doublon
            d = $scope.Eqpt.findIndex((obj) => { return obj.EQP_NUM == $scope.Selected_Eqp[i].EQP_NUM})
            if (d==-1) // EQP non trouvé
            {
                  $scope.Eqpt.push($scope.Selected_Eqp[i]) // Ajout de l'EQP
                  $scope.Eqpt[Eqpt_lenth].CTH_NUM_CT = NumCT; //Mise a jour de son nouveau CT
                  $scope.Eqpt[Eqpt_lenth].OPERATION = 'ADD';
                  $scope.Eqpt[Eqpt_lenth].LOCAL = 1; //Element ajouté localement // Ne se trouvez pas dans les données sources
            }
            else
            {
                  $scope.Eqpt[d] = $scope.Selected_Eqp[i] // Ajout de l'EQP
                  $scope.Eqpt[d].CTH_NUM_CT = NumCT; //Mise a jour de son nouveau CT
                  $scope.Eqpt[d].OPERATION = 'UPDATE';
                  $scope.Eqpt[d].LOCAL = 0; //Element ajouté localement // Ne se trouvez pas dans les données sources
            }
       }
       $mdDialog.hide()
       notify('Le(s) équipement(s) seront ajoutés après validation');
  }

  $scope.DEL_EQP = function (item)
  {
  $scope.item_to_delele = item

    $mdDialog.show({
      templateUrl: 'popup/DEL_CONFIRM.HTML',
      parent: angular.element(document.body),
      scope : $scope,
      clickOutsideToClose:true,
      preserveScope: true
    })
   }

  $scope.confirm_del = function(){
      $mdDialog.hide();
      var h = $scope.Eqpt.findIndex(function(obj) { return obj.EQP_NUM == $scope.item_to_delele.EQP_NUM});
      if ( $scope.Eqpt[h].LOCAL == 1 )
      {
      $scope.Eqpt.splice(h, 1);
      notify('Equipement supprimé' );
      }
      else
      {
      $scope.Eqpt[h].OPERATION='DELETE'
      notify('L\'équipement sera supprimé après validation' );
      }

    }

 $scope.EQP_EDIT = function (item)
 {
   var h = $scope.Eqpt.findIndex(function(obj) { return obj.EQP_NUM == item.EQP_NUM});
   if ($scope.Eqpt[h].LOCAL == 1 ) $scope.Eqpt[h].OPERATION='ADD'
   else $scope.Eqpt[h].OPERATION='UPDATE'
   console.log($scope.Eqpt)
 }

  $scope.gridOptions_eqp = {
      showGridFooter: true,
      showColumnFooter: true,
      enableFiltering: true,
      enableGridMenu: true,
      enableSelectAll: true,
      enableRowSelection: true,
      enableRowHeaderSelection : true,
      selectionRowHeaderWidth: 35,
      multiSelect : true,
      enableFullRowSelection : true,
      columnDefs: [
          { field: 'EQP_DESIGNATION' , width: "*", displayName: '  Equipement'  },
          { field: 'EQP_NUM', width: "100",  displayName: 'N° EQP'  },
          { field: 'EQP_ADRESSE', width: "*",  displayName: '  Adresse'  },
          { field: 'EQT_DESIGNATION', width: "*", displayName: 'Type EQP'  },
          { field: 'EQP_SERVICE_FON', width: "140", displayName: 'Service Fonc.' }
            // { field: 'EQP_SERVICE_FON', width: "100", displayName: 'Service Fonc.', minWidth: 200, maxWidth: 250, enableColumnResizing: false }
      ],
      //
      //     // { field: 'address.street',aggregationType: uiGridConstants.aggregationTypes.sum, width: '13%' },
      //     // { field: 'age', aggregationType: uiGridConstants.aggregationTypes.avg, aggregationHideLabel: true, width: '13%' },
      //     // { name: 'ageMin', field: 'age', aggregationType: uiGridConstants.aggregationTypes.min, width: '13%', displayName: 'Age for min' },
      //     // { name: 'ageMax', field: 'age', aggregationType: uiGridConstants.aggregationTypes.max, width: '13%', displayName: 'Age for max' },
      //     // { name: 'customCellTemplate', field: 'age', width: '14%', footerCellTemplate: '<div class="ui-grid-cell-contents" style="background-color: Red;color: White">custom template</div>' },
      //     // { name: 'registered', field: 'registered', width: '20%', cellFilter: 'date', footerCellFilter: 'date', aggregationType: uiGridConstants.aggregationTypes.max }
      // ],
      onRegisterApi: function(gridApi) {
              $scope.gridApi = gridApi;
              gridApi.selection.on.rowSelectionChanged($scope,function(row){
              $scope.Selected_API(row.isSelected,row.entity)
      })
      }
    }

 //Fonction qui remplit le tableau Selected_Eqp avec les equipements sélectionnés pour l'ajout
  $scope.Selected_API = function(isSelected,entity)
  {
    if(isSelected)
    {
      $scope.Selected_Eqp.push(entity)
    }
    else
    {
    var h = $scope.Selected_Eqp.findIndex((obj) => {return obj.EQP_NUM == entity.EQP_NUM})
    $scope.Selected_Eqp.splice(h, 1);
    }
    console.log($scope.Selected_Eqp )
  }



  $scope.log = function(item)
  {
  console.log(item)
  }

  $scope.Close_ADD = function() {
         $mdDialog.hide()
       };

  $scope.ADD_EQP = function()
   {
       $scope.Selected_Eqp.length = 0 ;

       $mdDialog.show({
                  templateUrl: 'popup/ADD_EQP.html',
                  parent: angular.element(document.body),
                  scope: $scope.$new(), //instead of $scope => resolve the problem of directive unfound
                  clickOutsideToClose:true,
                  preserveScope: false
                  // autoWrap:false
                })


  //   $scope.Eqpt.push({
  //      COL_LBL: '',
  //      CTH_NUM_CT: '',
  //      EQP_ADRESSE: '',
  //      EQP_CONTACT: '',
  //      EQP_CONTACT_TEL: '',
  //      EQP_DESIGNATION: '',
  //      EQP_NB_CAPTEUR: '',
  //      EQP_NUM: '',
  //      EQP_SERVICE_FON: '',
  //      EQP_SERVICE_GES: '',
  //      EQT_DESIGNATION: '',
  //   })
        console.log($scope.Eqpt)
   }

  // Vide les paramètres de l'exploitant quand l'utilisateur change le périmètre
  $scope.Clear_Resp = function (RXP_COD)
  {
    // id == RXP_COD --> ROLE EXPLOITANT
    var h = $scope.Exp.findIndex((obj) => {return obj.RXP_COD == RXP_COD})
    $scope.Exp[h].GRE_CONTACT_HO = ''
    $scope.Exp[h].GRE_CONTACT_HNO = ''
    $scope.Exp[h].GRE_RESP_ADM = ''
    $scope.Exp[h].GRE_RESP_TECHNIQUE = ''
    $scope.Exp[h].GRE_REF_INTERNE = ''

  }

  // remplit les paramètres de l'exploitant quand l'utilisateur choisi un couple perimetre puis un groupe d'exploitation
  $scope.Full_Resp = function (GRE_EXP_COD)
  {
    var h = $scope.Exp.findIndex((obj) => {return obj.GRE_EXP_COD == GRE_EXP_COD})
    console.log(h)

    $http.post('/api/Resp_data' , { GRE_EXP_COD : GRE_EXP_COD } )
       .success(function(data) {
     console.log(data)

         $scope.Exp[h].GRE_CONTACT_HO = data.GRE_CONTACT_HO
         $scope.Exp[h].GRE_CONTACT_HNO = data.GRE_CONTACT_HNO
         $scope.Exp[h].GRE_RESP_ADM = data.GRE_RESP_ADM
         $scope.Exp[h].GRE_RESP_TECHNIQUE = data.GRE_RESP_TECHNIQUE
         $scope.Exp[h].GRE_REF_INTERNE = data.GRE_REF_INTERNE

                  })
       .error(function(data) {
       console.log('Error: ' + data);
       });

  }


  function get_ALL_Lists()
{

  $http.get('/api/Liste_Equipement_ALL')
    .success(function(data) {
      console.log(data)
      $scope.gridOptions_eqp.data = data;


    }).error(function(data) {
      console.log('Error: ' + data);
      });

  $http.get('/api/Energies_List' )
     .success(function(data) {
        $scope.Energies = data
        // console.log(data)
                })
     .error(function(data) {
     console.log('Error: ' + data);
     });

  $http.get('/api/CTH_SIGNALE_List' )
         .success(function(data) {
            $scope.CTH_SIGNALE = data
            // console.log(data)
                    })
         .error(function(data) {
         console.log('Error: ' + data);
         });

   $http.get('/api/Type_CT_List' )
         .success(function(data) {
            $scope.Type = data
            // console.log(data)

                      })
         .error(function(data) {
         console.log('Error: ' + data);
         });

  $http.get('/api/Contrat_List' )
             .success(function(data) {
               $scope.Contrat = data
               // console.log(data)

                           })
            .error(function(data) {
            console.log('Error: ' + data);
    });


   $http.get('/api/Status_List'  )
         .success(function(data) {
            $scope.Status = data
            // console.log(data)
                    })
         .error(function(data) {
         console.log('Error: ' + data);
         });

  $http.get('/api/Grp_Exp_List'  )
             .success(function(data) {
                  $scope.Grp_Exploitation = data
                    console.log(data)
                            })
                 .error(function(data) {
                 console.log('Error: ' + data);
                 });

   $http.post('/api/Droits' , { LOGIN : login } )
              .success(function(data) {
                  $scope.Droits = data;
                  console.log(data);
                             })
                  .error(function(data) {
                  console.log('Error: ' + data);
                  });

    }

    $timeout(() => {
    $ionicLoading.hide() //enleve le spinner
    }, 0); //After DOM render, first timeout, hide loader

  function get_CT()
  {

  $http.post('/api/CT' , { CT : NumCT } )
     .success(function(data) {
        console.log(data)
        $scope.DATA = data
        $scope.DATA.CTH_COM_ETAT_CT2 = $scope.DATA.CTH_COM_ETAT_CT
        $scope.DATA.LOGIN = login
        if ($scope.DATA.CTH_SUPERVISE) $scope.DATA.CTH_SUPERVISE = 'true'
        if (!$scope.DATA.CTH_SUPERVISE) $scope.DATA.CTH_SUPERVISE = 'false'
        if (data.CTH_UPD_DTH)  $scope.s1 = " : "
        else $scope.s1 = ""
        if (data.CTH_COM_AUTEUR_NOM) $scope.s2 = " > "
        else $scope.s2 = ""

        $ionicLoading.hide() //enleve le spinner

              })
     .error(function(data) {
     console.log('Error: ' + data);
     });

     $http.post('/api/Exp' , { CT : NumCT } )
     .success(function(data) {

       var data2 = data.map((obj) => {
         switch(obj.RXP_COD) {
            case 'EXP_PRINCIPAL':
                obj.Droit = 'CTREP'
                return obj
                break;
            case 'SUIVI_EXPL':
                obj.Droit = 'CTRSE'
                return obj
                break;
            case 'SUIVI_EXPL_FROID':
                obj.Droit = 'CTRSEF'
                return obj
                break;
            case 'GROS_TRAVAUX':
                obj.Droit = 'CTRPCGT'
                return obj
                break;
            case 'EXP_SECOND_FROID':
                obj.Droit = 'CTRESF'
                return obj
                break;
            case 'EXP_SECOND_SOLAIRE':
                obj.Droit = 'CTRESIS'
                return obj
                break;
            case 'EXP_SECOND_CHAUDIERE':
                obj.Droit = 'CTRESCM'
                return obj
                break;
            case 'EXP_AUTRE':
                obj.Droit = 'CTRAE'
                return obj
                break;
            case 'EXP_ASTREINTE':
                obj.Droit = 'CTRASE'
                return obj
                break;
            default:
                return obj;
        }
       })
       console.log(data2)
       $scope.Exp = data2 ;
     });

      $http.post('/api/Eqpt' , { CT : NumCT } )
      .success(function(data) {
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

  get_ALL_Lists();
  get_CT();

  $http.get('/api/RechercheSimple')
       .success( function(data) {
           // console.log(data)
           var data2 = []
           data.forEach((obj)=> {
             if (obj && obj.CTH_NUM_CT)
             data2.push(obj)
           })
           // console.log(data2)
           $scope.tab = data2

           loading_screen.finish()
       }).error(function(data) {
           console.log(data);
       });
  //
  $scope.gotoFIC = function(CT)
  {
  $state.go('identite', {CT : CT , login : param.login , edition : 0 })
  }

  function transformArrayObject(data)
  {
             var j = 0 ;
             var tab = []
             for (i=1 ; i< data.length; i++)
             {
               if(data[i].CTH_NUM_CT && data[i].CTH_NUM_CT != null)
               {
                   j = tab.findIndex(function (obj) { return (obj.CT == data[i].CTH_NUM_CT) } );
                   if(j==-1)
                   tab.push({CT: data[i].CTH_NUM_CT, nbEQ: 0 , EQ : [] })
                   else
                   {
                     tab[j].nbEQ = tab[j].nbEQ + 1
                     tab[j].EQ.push(data[i])
                   }

               }
             }

        return  tab;
  }
})
