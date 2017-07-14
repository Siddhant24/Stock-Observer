'use strict';
var stockContainer = document.querySelector(".stock-container");
var chart;
function removeStock(e){
        ajaxFunctions.ajaxRequest('GET', appUrl + '/stock?code=' + e.getAttribute("id"), function(data){
            var id = e.getAttribute("id");
            var elem = document.querySelector('.' + id);
            elem.parentNode.removeChild(elem);
            chart.series.every(function(val, index){
               if(val.name.split('(')[1].slice(0,-1) === e.getAttribute("id")){
                   chart.series[index].remove();
                   socket.emit('remove stock', {index: index, id: id});
                   return false;
               }
               else{
                   return true;
               }
            });
        });
    }
    
function addSeries(data){
    chart.addSeries(data);
    socket.emit('new series', {series: data});
}
    
function createChart(chartData){
    chart = Highcharts.stockChart('chart', chartData);
}
    
function initialiseElements(name, code){
    var div = document.createElement('div');
    div.setAttribute('class', 'col-sm-4 ' + code);        div.innerHTML = '<div class="stocks"><div class="name text-center"><h3 class="stock-name">' + code + '</h3><button onclick="removeStock(this)"class="btn-link remove" id=\"' + code + '\">X</button></div><div class="stock-description text-center">' + name + '</div></div>';
    stockContainer.appendChild(div);
}
    
function createNewElement(name, code){
    var div = document.createElement('div');
    div.setAttribute('class', 'col-sm-4 ' + code);
    div.innerHTML = '<div class="stocks"><div class="name text-center"><h3 class="stock-name">' + code + '</h3><button onclick="removeStock(this)"class="btn-link remove" id=\"' + code + '\">X</button></div><div class="stock-description text-center">' + name + '</div></div>';
    socket.emit('new element', {div: div.innerHTML, code: code});   
    stockContainer.appendChild(div);
}
    
function updateChart(){
        ajaxFunctions.ajaxRequest('GET', appUrl + '/chart', function(data){
            var parsedData = JSON.parse(data);
            Object.keys(parsedData.series).forEach(function(key){
                var name = parsedData.series[key].name;
                var code = name.split('(')[1].slice(0,-1);
                initialiseElements(name, code);
            });
            createChart(parsedData);
        });
    }

(function(){
    
    var stockCode = document.getElementById("stock-code");
    var addStock = document.getElementById("add-stock");
    //var remove = document.querySelector(".remove");
    
    ajaxFunctions.ready(function(){
        updateChart();
        addStock.addEventListener('click', function(){
           var currValue = stockCode.value.toUppercase();
           ajaxFunctions.ajaxPostRequest({dataset_code: currValue}, appUrl + '/stock', function(data){
                if(data != 'not found'){
                    var parsedData = JSON.parse(data);
                    var name;
                    Object.keys(parsedData.series).every(function(val){
                       if(parsedData.series[val].name.split('(')[1].slice(0,-1) === currValue){
                           name = parsedData.series[val].name;
                           addSeries(parsedData.series[val]);
                           return false;
                       }
                       else{
                           return true;
                       }
                    });
                    createNewElement(name, currValue);
                /*    var div = document.createElement('div');
                    div.setAttribute('class', 'col-sm-4');
                    div.innerHTML = '<div class="stocks"><div class="name text-center"><h3 class="stock-name">' + currValue + '</h3><button onclick="removeStock(this)"class="btn-link remove" id=\"' + currValue + '\">X</button></div><div class="stock-description">' + name + '</div></div>';
                    stockContainer.append(div);*/
                }
                else{
                    window.alert('Incorrect or not existing stock code');
                }
           }); 
        });
    });
})();