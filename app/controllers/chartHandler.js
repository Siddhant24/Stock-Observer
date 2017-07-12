'use strict'; 
 
var Stock = require('../models/stock');
var request = require('request');

module.exports = { 
    
    addStock : function(dataset_code){
        var newStock = new Stock();
        return new Promise(function(resolve, reject){
            request(process.env.API_URL + '/WIKI/' + dataset_code + '?column_index=1', function (error, response, body) {
                if(error) console.error(error);
                else if(response.statusCode !== 200) console.log(response.status);
                else{
                    var data = JSON.parse(body);
                    newStock.dataset_code = data.dataset.dataset_code;
                    newStock.database_code = data.dataset.database_code;
                    newStock.name = data.dataset.name;
                    newStock.data = data.dataset.data;
                    console.log(newStock);
                    newStock.save(function (err) {
					    if (err) {
						    throw err;
					    }
					    resolve("success");
                    }); 
                }
            });
        });
    },
    
    findAllStocks: function(){
        return new Promise(function(resolve, reject){
           Stock.find({}, {name: 1, _id: 0},function(err, docs){
               if(err) console.error(err);
               console.log(docs);
               resolve(docs);
           }); 
        });
    },
    
    deleteStock: function(id){
      Stock.findByIdAndRemove(id, function(err, result){
          if(err) console.error(err);
      });
    },
    
    makeChart: function(){
        var chart = {  
            rangeSelector: {
                selected: 4
            },

            yAxis: {
                labels: {
                    formatter: function () {
                        return (this.value > 0 ? ' + ' : '') + this.value + '%';
                    }
                },
                plotLines: [{
                    value: 0,
                    width: 2,
                    color: 'silver'
                }]
            },

            plotOptions: {
                series: {
                    compare: 'percent',
                    showInNavigator: true
                }
            },

            tooltip: {
                pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
                valueDecimals: 2,
                split: true
            },

            series: seriesOptions
        }
    }
}
