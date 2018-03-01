var csvExportDirective = function () {
    'use strict';
    return {
        restrict : 'EA',
        replace : true,
        templateUrl: function (element, attr) { return (attr.templateUrl || '../dist/templates/csv-export-template.html'); },
        controller : 'CsvExportController',
        scope : {
            source : '='
        },
        link : function ($scope, $element, $attrs, $controller) {
            
            // Assistindo alterações no dataSource.
            $scope.$watch('source', function () {
                $scope.actions.toCSV($scope.source);
            });

            // Assistindo alterações de habilitação de labels.
            $scope.$watch('form.withLabels', function () {
                $scope.actions.toCSV($scope.source);
            });

            // Assistindo alterações de habilitação de Quotes.
            $scope.$watch('form.withQuotes', function () {
                $scope.actions.toCSV($scope.source);
            });

            // Assistindo alterações de caractere separador.
            $scope.$watch('form.separator', function () {
                $scope.actions.toCSV($scope.source);
            });

            // Criando um método de exibição do dialogo de download.
            $scope.showModal = function (isVisible) {    
                if (isVisible) {
                    $element.find('#mdl-export').modal("show");
                } else {
                    $element.find('#mdl-export').modal("hide");
                }
            };
            
            // Assistindo alterações do atributo isVisible.
            $scope.$watch('form.isVisible', function (newValue, oldValue) {
                $scope.showModal(newValue);
            });

            // Atualizando o status quando o painel modal for fechado através de uma ação de interface. (ok, cancel, etc...)
            $element.bind('hide.bs.modal', function () {
                $scope.form.isVisible = false;
                if (!$scope.$$phase && !$scope.$root.$$phase) {
                    $scope.$apply();
                }
            });
        }
    };
};