'use strict'; 
 
var Stock = require('../models/stock');
var request = require('request');

module.exports = { 
    
    addStock : function(dataset_code){
        var newStock = new Stock();
        return new Promise(function(resolve, reject){
            request(process.env.API_URL + '/WIKI/' + dataset_code + '.json?column_index=1&api_key=' + process.env.API_KEY, function (error, response, body) {
                if(error) console.error(error);
                else if(response.statusCode !== 200){
                    reject('not found');
                } 
                else{
                    var data = JSON.parse(body);
                    newStock.dataset_code = data.dataset.dataset_code;
                    newStock.database_code = data.dataset.database_code;
                    newStock.name = data.dataset.name.split(')')[0] + ')';
                    newStock.data = data.dataset.data.reverse().map(info => {
                        return [
                            (new Date(info[0])).getTime(),
                                info[1]
                            ];
                    });
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
    
    findMyStock: function(body){
        return new Promise(function(resolve, reject){
           Stock.find({}, {dataset_code: 1, _id: 0},function(err, docs){
               if(err) console.error(err);
                if(docs.length === 0){
                    resolve();
                }
                else{
               docs.every(function(doc, index){
                   if(doc.dataset_code === body.dataset_code){
                       reject();
                       return false;
                   }
                   else if(index === docs.length -1){
                       resolve();
                   }
                   else{
                       return true;
                   }
               });
                }
           }); 
        });
    },
    
    allStocks: function(){
        return new Promise(function(resolve, reject){
            Stock.find({}, {name: 1, data: 1, _id: 0}, function(err, docs){
                if(err) console.error(err);
                resolve(docs);
            });
        });
    },
    
    deleteStock: function(dataset_code){
      Stock.findOneAndRemove({dataset_code: dataset_code}, function(err, doc){
      if(err) console.error(err);
});
    },
    
    makeChart: function(docs){
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
                compare: 'value',
                showInNavigator: true
            }
        },

        tooltip: {
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
            valueDecimals: 2,
            split: true
        },

        series: docs.slice(0),
        
        credits: {
            enabled: false
        }
    };
        return chart;
    }
};
