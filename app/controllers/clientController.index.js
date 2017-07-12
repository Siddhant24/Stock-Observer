'use strict';

(function(){
    
    var stockCode = document.getElementById("stock-code");
    var addStock = document.getElementById("add-stock");
    
    function createChart(chartData){
        Highcharts.stockChart('chart', chartData);
    }
    
    ajaxFunctions.ready(function(){
       addStock.addEventListener('click', function(){
           console.log("hi");
           ajaxFunctions.ajaxPostRequest({dataset_code: stockCode.value}, appUrl + '/stock', function(data){
               var parsedData = JSON.parse(data);
               console.log(parsedData);
           }); 
        });
    });
    
})();