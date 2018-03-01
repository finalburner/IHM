var csvExportController = function ($scope, $csvExportService) {
    'use strict';
    
    var init, defaultSeparator = ';', fileName = 'report-' + (new Date()).getTime() + '.csv';

    // Form
    $scope.form = {};
    $scope.form.separator = defaultSeparator;
    $scope.form.withLabels = true;
    $scope.form.withQuotes = true;
    $scope.form.isVisible = false;
    $scope.form.csv = '';

    // Actions
    $scope.actions = {};
    
    $scope.actions.showDialog = function () {
        $scope.form.isVisible = true;
    }

    // Criando um dialogo para download do arquivo csv.
    $scope.actions.doDownload = function () {
        $csvExportService.JSONToCSVConverter($scope.source, fileName);
    };

    // Criando uma função de conversão de Json para csv.
    $scope.actions.toCSV = function () {
        $scope.form.csv = $csvExportService.parse($scope.source, $scope.form.withLabels, $scope.form.withQuotes, $scope.form.separator);
    };
};