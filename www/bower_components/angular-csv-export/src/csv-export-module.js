/*global angular: false*/
/*global csvExportService: false*/
/*global csvExportController: false*/
/*global csvExportDirective: false*/

if (angular) {
    
    var csvExportModule = angular.module('CsvExportModule', ['ngCookies', 'pascalprecht.translate', 'tmh.dynamicLocale']);
    
    // Configurando o módulo
    csvExportModule.config(['$translateProvider', 'tmhDynamicLocaleProvider', function($translateProvider, tmhDynamicLocaleProvider){
        
        console.debug('[CONFIG: CSV-EXPORT]', 'Configurando a aplicação.');
        
        console.debug('[CONFIG: CSV-EXPORT]','Configurando tradutores');
        $translateProvider.useStaticFilesLoader({
            prefix: '/src/lang/',
            suffix: '.json'
        });

        console.debug('[CONFIG: CSV-EXPORT]','Configurando l10n.');
        $translateProvider.preferredLanguage('pt-br');
        $translateProvider.fallbackLanguage(['en-us']);
        $translateProvider.useCookieStorage();

        console.debug('[CONFIG: CSV-EXPORT]','Configurando i18n.');
        tmhDynamicLocaleProvider.defaultLocale("pt-br");
        tmhDynamicLocaleProvider.localeLocationPattern('/vendor/angular-i18n/angular-locale_{{locale}}.js');
        tmhDynamicLocaleProvider.useStorage('$cookieStore');
    }]);
    
    // Criando um serviço para exportação de um arquivo csv.
    csvExportModule.factory('$csvExportService', [csvExportService]);
    
    // Criando um controller para exportação de um arquivo csv.
    csvExportModule.controller('CsvExportController', ['$scope', '$csvExportService', csvExportController]);
    
    // Criando uma diretiva para exportação de um arquivo csv.
    csvExportModule.directive('csvExportDirective', [csvExportDirective]);
    
    // Inicializando o módulo
    csvExportModule.run(['$rootScope', function ($rootScope) {
        'use strict';
        console.debug('[RUN: CSV-EXPORT]', 'Inicializando a aplicação.');
    }]);
}