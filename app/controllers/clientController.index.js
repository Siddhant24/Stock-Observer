'use strict';

(function(){
    
    var stockCode = document.getElementById("stock-code");
    var addStock = document.getElementById("add-stock");
    var remove = document.querySelector(".remove");
    var parsedData;
    
    function createChart(chartData){
        Highcharts.stockChart('chart', chartData);
    }
    
    ajaxFunctions.ready(function(){
       addStock.addEventListener('click', function(){
           console.log("hi");
           ajaxFunctions.ajaxPostRequest({dataset_code: stockCode.value}, appUrl + '/stock', function(data){
                if(data){
                    parsedData = JSON.parse(data);
                    console.log(parsedData.series);
                    createChart(parsedData);
                }
           }); 
        });
    });
    
    remove.addEventListener('click', function(e){
        ajaxFunctions.ajaxRequest('GET', appUrl + '/stock', function(data){
            console.log(data);
        })
    })
    
})();