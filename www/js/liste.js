app.controller('ListeController', function($scope) {
    var app = angular.module('app', []);
    // Data object
    $scope.servers = [
        {name:'ServerA', runlevel:'PAV', mode:'author', env:'intranet' },
        {name:'Server1', runlevel:'UAT', mode:'author', env:'intranet'},
        {name:'ServerD', runlevel:'STA', mode:'author', env:'intranet'},

            ];
    // Filter defaults
    $scope.Filter = new Object();
    $scope.Filter.runlevel = {'PAV':'PAV',
                            'UAT':'UAT',
                             'ST':'ST'
                        };
    $scope.Filter.mode = {'author':'author',
                            'publish':'publish'
                        };
    $scope.Filter.env = {'intranet':'intranet',
                            'internet':'internet'
                        };
    // Default order
    $scope.OrderFilter = 'runlevel';
});

// Global search filter
app.filter('searchFilter',function($filter) {
        return function(items,searchfilter) {
             var isSearchFilterEmpty = true;
              angular.forEach(searchfilter, function(searchstring) {
                  if(searchstring !=null && searchstring !=""){
                      isSearchFilterEmpty= false;
                  }
              });
        if(!isSearchFilterEmpty){
                var result = [];
                angular.forEach(items, function(item) {
                    var isFound = false;
                     angular.forEach(item, function(term,key) {
                         if(term != null &&  !isFound){
                             term = term.toString();
                             term = term.toLowerCase();
                                angular.forEach(searchfilter, function(searchstring) {
                                    searchstring = searchstring.toLowerCase();
                                    if(searchstring !="" && term.indexOf(searchstring) !=-1 && !isFound){
                                       result.push(item);
                                        isFound = true;
                                    }
                                });
                         }
                            });
                       });
            return result;
        }else{
        return items;
        }
    }
});
