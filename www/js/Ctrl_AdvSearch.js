//------------------------------------------------------------------------------
// Controlleur Recherche Avancee
app.controller('AdvSearch', function ($scope, $http, $stateParams, $ionicLoading , $filter) {

    var loading_screen = pleaseWait({
      logo: "#",
      backgroundColor: '#CBDDFF',
      loadingHtml: "<div class='spinner'><div class='cube1'></div><div class='cube2'></div></div>"
    });


     var h;
     var SrcData = [], filteredData = [];
     $scope.CheckAll_Finish = 1
     $scope.FilterData = new Object();

     $ionicLoading.show({ //Spinner au chargement initial
        content: 'Loading', animation: 'fade-in', showBackdrop: true,
        duration: 10000, maxWidth: 200,  showDelay: 0
      });

     if($stateParams)
     console.log($stateParams)
     console.log("advsearch")


     $scope.events = {
       onItemSelect	: function(item){
         // $scope.Filtered = $filter('filter')($scope.List_CT,{ ServiceGestionnaire_model );
         console.log($scope.example9model)
         console.log(item)
       }
     };


     function transformJson(data, Property_Label, Property_Cod){
       return data.map((item,index) => {
         return { id: index , label : item[Property_Label] , COD : item[Property_Cod]}
       })
     }

     $http.get('/api/Collectivite')
           .success(function(data) {
              $scope.FilterData.Collectivite = transformJson(data,'STA_LBL','STA_COD')
         }).error(function(data) {
              console.log('Error: ' + data);
         });

     $http.get('/api/Status_CT')
          .success(function(data) {
               $scope.FilterData.StatusCT = transformJson(data,'STA_LBL','STA_COD')
         }).error(function(data) {
                console.log('Error: ' + data);
         });

     $http.get('/api/Status_Equipement')
          .success(function(data) {
                 $scope.FilterData.StatusEqpt = transformJson(data,'STA_LBL','STA_COD')

         }).error(function(data) {
                console.log('Error: ' + data);
         })

     $http.get('/api/Service_Gestionnaire')
          .success(function(data) {
                $scope.FilterData.ServiceGestionnaire = transformJson(data,'EQP_SERVICE_GES','EQP_SERVICE_GES_COD')
          }).error(function(data) {
                console.log('Error: ' + data);
          });

     $http.get('/api/Service_Fonctionnel')
          .success(function(data) {
                 $scope.FilterData.ServiceFonctionnel = transformJson(data,'EQP_SERVICE_FON','EQP_SERVICE_FON_COD')
          }).error(function(data) {
                console.log('Error: ' + data);
          });

     $http.get('/api/RechercheAvancee')
          .success(function(data) {
              console.log(data)
              // console.log($scope.FilterData)
              // $ionicLoading.hide() //enleve le spinner
              SrcData = data;
              $scope.gridOptions.api.setRowData(SrcData)
              $scope.gridOptions.api.hideOverlay();
              $scope.gridOptions.api.sizeColumnsToFit()
              $scope.filterdata_nb = $scope.gridOptions.api.getDisplayedRowCount()
              $ionicLoading.hide()
              loading_screen.finish()

          }).error(function(data) {
              console.log(data);
          });


     $scope.Cancel_Filter = function()
     {
       var property
       for (property in $scope.filter) {
             if ($scope.filter.hasOwnProperty(property))
              {   $scope.Check[property] = false
                  $scope.filter[property].length = 0;
              }
       }
       for (property in $scope.FilterData) {
             if ($scope.FilterData.hasOwnProperty(property))
                 $scope.FilterData[property].forEach((elm) => {
                   if(elm.C) elm.C = 0 ;
                 })

             }
       // filteredData = $filter('filterMultiple')(SrcData, $scope.filter)
       filteredData = $filter('filterMultiple2')(SrcData, $scope.filter)
       $scope.gridOptions.api.setRowData(filteredData)
       $scope.filterdata_nb = $scope.gridOptions.api.getDisplayedRowCount()
       console.log($scope.filter)
     }

    $scope.exportToCsv = function () {
        var params = {
              skipHeader: false,
              skipFooters: true,
              skipGroups: true,
              fileName: "export.csv"
              };

            $scope.gridOptions.api.exportDataAsCsv(params);
            console.log('export')
      }

     $scope.checkfilter = function(cat,item)
     {
       if(item.C)
       {
         $scope.filter[cat].push(item.COD)
       }
       else {
              h = $scope.filter[cat].findIndex((obj) =>  obj == item.COD )
              if (h!=-1)
              $scope.filter[cat].splice(h, 1);
          }

       if($scope.CheckAll_Finish)
       {
       filteredData = $filter('filterMultiple')(SrcData, $scope.filter)
       $scope.gridOptions.api.setRowData(filteredData)
       $scope.filterdata_nb = $scope.gridOptions.api.getDisplayedRowCount()
       }
       console.log($scope.filter)

     }

     Object.compare = function (obj1, obj2) {
     	//Loop through properties in object 1
     	for (var p in obj1) {
     		//Check property exists on both objects
     		if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) return false;

     		switch (typeof (obj1[p])) {
     			//Deep compare objects
     			case 'object':
     				if (!Object.compare(obj1[p], obj2[p])) return false;
     				break;
     			//Compare function code
     			case 'function':
     				if (typeof (obj2[p]) == 'undefined' || (p != 'compare' && obj1[p].toString() != obj2[p].toString())) return false;
     				break;
     			//Compare values
     			default:
     				if (obj1[p] != obj2[p]) return false;
     		}
     	}

     	//Check object 2 for any extra properties
     	for (var p in obj2) {
     		if (typeof (obj1[p]) == 'undefined') return false;
     	}
     	return true;
     };

     $scope.CheckAll = function(Src,Cible)
     {
       $scope.CheckAll_Finish = 0 ;
       $scope.Check[Cible] = !$scope.Check[Cible]
       $scope.FilterData[Src].forEach((elm) => {
         if(elm.C != $scope.Check[Cible])
         {
           elm.C = $scope.Check[Cible]
           $scope.checkfilter(Cible, elm)
        }
       })
       $scope.CheckAll_Finish = 1 ;
       filteredData = $filter('filterMultiple')(SrcData, $scope.filter)
       $scope.gridOptions.api.setRowData(filteredData)
       $scope.filterdata_nb = $scope.gridOptions.api.getDisplayedRowCount()
       // console.log(filteredData.length)
       // var dif = SrcData.map( (item) => {
       //   h = filteredData.findIndex((obj) =>  Object.compare() == JSON.stringify(item) )
       //   if (h==-1)
       //   // return item
       //   return
       // })
       // console.log(dif)
     }

     $scope.filter = {
             EQA_SERVICE_FON : [],
             EQA_SERVICE_GES : [],
             EQA_COLLECTIVITE : [],
             STATUT_EQ :[],
             STATUT_CT : []
             // date: {type: 'lessThan', dateFrom: '2010-01-01'}
         };

     $scope.Check = {
             EQA_SERVICE_FON : false,
             EQA_SERVICE_GES : false,
             EQA_COLLECTIVITE : false,
             STATUT_EQ : false,
             STATUT_CT : false
             // date: {type: 'lessThan', dateFrom: '2010-01-01'}
         };

     // function set_filter() {
     //
     //     $scope.gridOptions.api.setFilterModel($scope.filter);
     //     $scope.gridOptions.api.onFilterChanged();
     // }

    var columnDefs = [
       {headerName: "N° CT", field: "CTH_NUM_CT", filter: 'agTextColumnFilter'},
       {headerName: "Description", field: "CTH_DESC_CT"},
       {headerName: "Adresse", field: "CTH_ADRESSE"},
       {headerName: "N° PT", field: "CTH_NUM_PT", filter: 'agSetColumnFilter', suppressMenu:true},
       {headerName: "Adresse EQ", field: "EQA_ADRESSE"},
       {headerName: "Designation EQ", field: "EQA_DESIGNATION_LONGUE"},
       {headerName: "N° EQ", field: "EQA_NUM"},
       {headerName: "Type EQ", field: "EQA_TYPE"},
       {headerName: "EQA_SERVICE_FON", field: "EQA_SERVICE_FON", hide: false},
       {headerName: "EQA_SERVICE_GES", field: "EQA_SERVICE_GES", hide: false},
       {headerName: "Statut du CT", field: "STATUT_CT", hide: false},
       {headerName: "Statut Eqpt.", field: "STATUT_EQ", hide: false},
       {headerName: "Collectivite", field: "EQA_COLLECTIVITE", hide: true}
   ];

   $scope.gridOptions = {
       animateRows: true,
       columnDefs: columnDefs,
       rowData : null,
       headerHeight: 35,
       rowHeight: 35,
       rowSelection: 'single',
       enableFilter: true,
       enableColResize: false,
       floatingFilter: true,
       enableSorting: true,
       throttleScroll: true,
       pagination : true,
       rowSelection: 'multiple',
       suppressRowClickSelection: true,
       groupSelectsChildren: true,
       // debug: true,
       rowGroupPanelShow: 'always',
       pivotPanelShow: 'always',
       enableRangeSelection: true,
       paginationAutoPageSize: true,
       modelUpdated : function(a) {
         console.log(a)
         $scope.filterdata_nb = $scope.gridOptions.api.getDisplayedRowCount()
       },
       onGridReady: function(params) {
           $scope.gridOptions.api.sizeColumnsToFit();

        },
        localeText : {

              // for filter panel
              page: 'Page',
              more: 'Plus',
              to: 'à',
              of: 'de',
              next: 'Suivant',
              last: 'Dernier',
              first: 'Premier',
              previous: 'Précédent',
              loadingOoo: 'Chargement',

                    // for set filter
             selectAll: 'daSelect Allen',
             searchOoo: 'daSearch...',
             blanks: 'daBlanc',

             // for number filter and text filter
             filterOoo: 'Filtre',
             applyFilter: 'Appliquer le filtre',

             // for number filter
             equals: 'Egale à ',
             lessThan: 'Moins que',
             greaterThan: 'Plus que',
             notEqual: 'Non égale à',
             lessThanOrEqual: 'Moins ou égale ',
             greaterThanOrEqual: 'Plus ou égale',
             inRange:'Interval',

             // for text filter
             contains: 'Contient',
             notContains : 'Ne contient pas',
             startsWith: 'Commence par',
             endsWith: 'Fini par',

               // the header of the default group column
             group: 'laGroup',

             // tool panel
             columns: 'laColumns',
             rowGroupColumns: 'laPivot Cols',
             rowGroupColumnsEmptyMessage: 'la drag cols to group',
             valueColumns: 'laValue Cols',
             pivotMode: 'laPivot-Mode',
             groups: 'laGroups',
             values: 'laValues',
             pivots: 'laPivots',
             valueColumnsEmptyMessage: 'la drag cols to aggregate',
             pivotColumnsEmptyMessage: 'la drag here to pivot',

             // other
             noRowsToShow: 'Aucun équipement',

             // enterprise menu
             pinColumn: 'laPin Column',
             valueAggregation: 'laValue Agg',
             autosizeThiscolumn: 'laAutosize Diz',
             autosizeAllColumns: 'laAutsoie em All',
             groupBy: 'laGroup by',
             ungroupBy: 'laUnGroup by',
             resetColumns: 'laReset Those Cols',
             expandAll: 'laOpen-em-up',
             collapseAll: 'laClose-em-up',
             toolPanel: 'laTool Panelo',
             export: 'laExporto',
             csvExport: 'la CSV Exportp',
             excelExport: 'la Excel Exporto',

             // enterprise menu pinning
             pinLeft: 'laPin <<',
             pinRight: 'laPin >>',
             noPin: 'laDontPin <>',

      }
   };



        //
        //
        // $scope.gridOptions = {
        //     showGridFooter: true,
        //     showColumnFooter: true,
        //     enableFiltering: true,
        //     // columnDefs: [
        //     //     { field: 'datetime' , width: "*", displayName: 'Horodatage'  },
        //     //     { field: 'type', width: "*",  displayName: 'Catégorie'  },
        //     //     { field: 'event', width: "*",  displayName: 'Evènement'  },
        //     //     { field: 'source', width: "*", displayName: 'Emetteur'  },
        //     //     { field: 'cible', width: "*", displayName: 'Récepteur' },
        //     //     { field: 'info', width: "*", displayName: 'Information' }
        //     //
        //     //
        //     //     // { field: 'address.street',aggregationType: uiGridConstants.aggregationTypes.sum, width: '13%' },
        //     //     // { field: 'age', aggregationType: uiGridConstants.aggregationTypes.avg, aggregationHideLabel: true, width: '13%' },
        //     //     // { name: 'ageMin', field: 'age', aggregationType: uiGridConstants.aggregationTypes.min, width: '13%', displayName: 'Age for min' },
        //     //     // { name: 'ageMax', field: 'age', aggregationType: uiGridConstants.aggregationTypes.max, width: '13%', displayName: 'Age for max' },
        //     //     // { name: 'customCellTemplate', field: 'age', width: '14%', footerCellTemplate: '<div class="ui-grid-cell-contents" style="background-color: Red;color: White">custom template</div>' },
        //     //     // { name: 'registered', field: 'registered', width: '20%', cellFilter: 'date', footerCellFilter: 'date', aggregationType: uiGridConstants.aggregationTypes.max }
        //     // ],
        //     // onRegisterApi: function(gridApi) {
        //     //         $scope.gridApi = gridApi;
        //     // }
        // };

        // $scope.toggleFooter = function() {
        //   $scope.gridOptions.showGridFooter = !$scope.gridOptions.showGridFooter;
        //   $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.OPTIONS);
        // };
        //
        // $scope.toggleColumnFooter = function() {
        //   $scope.gridOptions.showColumnFooter = !$scope.gridOptions.showColumnFooter;
        //   $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.OPTIONS);
        // };




  })

  .filter('customArray', function($filter){
    return function(list, arrayFilter, element){
        if(arrayFilter){
            return $filter("filter")(list, function(listItem){
                return arrayFilter.indexOf(listItem[element]) != -1;
            });
        }
    };
  })

  .filter('filterMultiple',['$filter',function ($filter) {
  return function (items, keyObj) {

      var filterObj = {
          data:items,
          filteredData:[],
          applyFilter : function(obj,key){

              var fData = [];
              if (this.filteredData.length == 0) // initialise avec les données à filtrer
                  this.filteredData = this.data;
              if (obj){
                  var fObj = {};
                  if (!angular.isArray(obj)){ // clé avec string
                      fObj[key] = obj;
                      fData = fData.concat($filter('filter')(this.filteredData,fObj));
                  } else if (angular.isArray(obj)) // clé avec array
                  {
                      if (obj.length > 0){
                          for (var i=0;i<obj.length;i++){
                              if (angular.isDefined(obj[i])){
                                  fObj[key] = obj[i];
                                  fData = fData.concat($filter('filter')(this.filteredData,fObj));
                              }
                          }

                      }
                  }
                  if (fData.length > 0){
                      this.filteredData = fData;
                  }
              }
          }
      };
      if (keyObj){
          angular.forEach(keyObj,function(obj,key){
              filterObj.applyFilter(obj,key);
          });
      }
      return filterObj.filteredData;
  }
  }])
