/*global growl: false*/
/*global escape: false*/
/*jslint continue:true*/
/*jslint regexp: true*/

var csvExportService = function () {
    'use strict';
    
    return {
        parse : function (arr, withLabels, withQuotes, separator) {
            var str, line, head, index, value, i;

            // Inicializando variáveis
            separator = separator || ',';
            arr = typeof arr !== 'object' ? JSON.parse(arr) : arr;
            str = '';
            line = '';

            ///////////////////////////////////////////////////////////////////
            // Checando se está definido  para incluir  os títulos
            ///////////////////////////////////////////////////////////////////
            if (withLabels) {
                head = arr[0];

                // Percorrendo as propriedades do objeto
                for (index in arr[0]) {
                    if (arr[0].hasOwnProperty(index)) {
                        // Descartando objetos adicionados pelo framework jQuery e angular.
                        if (index.indexOf('$') === 0) {
                            continue;
                        }

                        // Checando se está definido para para adicionar aspas aos campos
                        if (withQuotes) {
                            value = index.toString();
                            line += '"' + value.replace(/"/g, '""') + '"' + separator;
                        } else {
                            line += index + separator;
                        }
                    }
                }
                line = line.slice(0, -1);
                str += line + '\r\n';
            }

            ///////////////////////////////////////////////////////////////////
            // Percorrendo a lista de objetos
            ///////////////////////////////////////////////////////////////////
            for (i = 0; i < arr.length; i = i + 1) {
                line = '';

                for (index in arr[0]) {
                    if (arr[0].hasOwnProperty(index)) {
                        // Descartando objetos adicionados pelo framework jQuery e angular.
                        if (index.indexOf('$') === 0) {
                            continue;
                        }

                        // Checando se está definido para para adicionar aspas aos campos
                        if (withQuotes) {
                            value = arr[i][index].toString();
                            line += '"' + value.replace(/"/g, '""') + '"' + separator;
                        } else {
                            line += arr[i][index] + separator;
                        }
                    }
                }
                line = line.slice(0, -1);
                str += line + '\r\n';
            }

            return str;
        },

        msieversion : function () {
            var ua = window.navigator.userAgent, msie = ua.indexOf("MSIE ");
            // If Internet Explorer, return version number
            return (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./));
        },

        JSONToCSVConverter : function (JSONData, withLabels) {
            var fileName = "Result", IEWindow, uri, link;

            // Verifica se o método recebeu um json
            if (JSONData.length === 0) {
                console.error('Invalid data');
                return;
            }

            // Verifica se o browser é o Internet Explorer
            if (this.msieversion()) {
                // Criando um dialogo para download do arquivo.
                IEWindow = window.open();
                IEWindow.document.write('sep=,\r\n' + JSONData);
                IEWindow.document.close();
                IEWindow.document.execCommand('SaveAs', true, fileName + ".csv");
                IEWindow.close();
            } else {
                // Criando um dialogo para download do arquivo;
                uri = 'data:application/csv;charset=utf-8,' + escape(JSONData);
                link = document.createElement("a");
                link.href = uri;
                link.style.cssText = "visibility:hidden";
                link.download = fileName + ".csv";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }

        }
    };
};