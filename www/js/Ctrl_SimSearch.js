//------------------------------------------------------------------------------
// Controlleur Recherche Simple
app.controller('SimSearch', function ($state, $rootScope, $scope, $http, $stateParams, $ionicLoading , $filter) {
    //
    // var loading_screen = pleaseWait({
    //   logo: "#",
    //   backgroundColor: '#CBDDFF',
    //   loadingHtml: "<div class='spinner'><div class='cube1'></div><div class='cube2'></div></div>"
    // });

     // $ionicLoading.show({ //Spinner au chargement initial
     //    content: 'Loading', animation: 'fade-in', showBackdrop: true,
     //    duration: 10000, maxWidth: 200,  showDelay: 0
     //  });

     if($stateParams)
     var param = $stateParams

     $http.get('/api/RechercheSimple')
          .success( function(data) {
              console.log(data)
              $scope.tab =  transformArrayObject(data)
              // loading_screen.finish()
          }).error(function(data) {
              console.log(data);
          });

     $scope.gotoFIC = function(CT)
     {
       console.log(CT)
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

  // .filter('groupByCT', function($parse) {
  //     var dividers = {};
  //
  //     return function(input) {
  //         if (!input || !input.length) return;
  //
  //         var output = [],
  //             previousCT,
  //             currentCT;
  //
  //         for (var i = 0, ii = input.length; i < ii && (item = input[i]); i++) {
  //             currentCT = item.CTH_NUM_CT;
  //             if (!previousCT ||   currentCT != previousCT ) {
  //
  //                 var dividerId = currentCT
  //
  //                 if (!dividers[dividerId]) {
  //                     dividers[dividerId] = {
  //                         isDivider: true,
  //                         divider: currentCT
  //                     };
  //                 }
  //
  //                 output.push(dividers[dividerId]);
  //             }
  //
  //             output.push(item);
  //             previousCT = currentCT;
  //         }
  //
  //         return output;
  //     };
  // })

  .directive('dividerCollectionRepeat', function($parse) {
    console.log($parse)
      return {
          priority: 1001,
          compile: compile
      };

      function compile (element, attr) {
        console.log(element)
        console.log(attr)
          var height = attr.itemHeight || '73';
          attr.$set('itemHeight', 'item.isDivider ? 37 : ' + height);

          element.children().attr('ng-hide', 'item.isDivider');
          element.prepend(
              '<div class="item item-divider ng-hide" ng-show="item.isDivider" ng-bind="item.divider"></div>'
          );
      }
  })
