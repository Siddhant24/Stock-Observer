'use strict'; 
 
var Stock = require('../models/stock');
var request = require('request');

module.exports = { 
    
    addStock : function(dataset_code){
  //      console.log(dataset_code);
        var newStock = new Stock();
        return new Promise(function(resolve, reject){
            request(process.env.API_URL + '/WIKI/' + dataset_code + '.json?column_index=1&api_key=' + process.env.API_KEY, function (error, response, body) {
          //      console.log(body);
                if(error) console.error(error);
                else if(response.statusCode !== 200) console.log(response.status);
                else{
                    var data = JSON.parse(body);
                  //  console.log(data);
                    newStock.dataset_code = data.dataset.dataset_code;
                    newStock.database_code = data.dataset.database_code;
                    newStock.name = data.dataset.name.split(')')[0] + ')';
                    newStock.data = data.dataset.data.reverse().map(info => {
                        return [
                            (new Date(info[0])).getTime(),
                                info[1]
                            ];
                    });
                  //  console.log(newStock);
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
               console.log(docs);
              // console.log(body);
                if(docs.length === 0){
                    resolve();
                    console.log("empty");
                }
                else{
               docs.every(function(doc, index){
                  // console.log(body.dataset_code);
                   if(doc.dataset_code === body.dataset_code){
                       console.log("found");
                       reject();
                       return false;
                   }
                   else if(index === docs.length -1){
                       console.log("not found");
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
               // console.log(docs);
                if(err) console.error(err);
                resolve(docs);
            });
        });
    },
    
    deleteStock: function(dataset_code){
        console.log("deleting..." + dataset_code);
      Stock.findOneAndRemove({dataset_code: dataset_code}, function(err, doc){
      if(err) console.error(err);
      //console.log(doc.name);
     /* Stock.remove({}, function(err) { 
   console.log('collection removed') */
});
    },
    
    makeChart: function(docs){
        //console.log(docs[0].data[0][0]);
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
       // console.log(chart.series)
        return chart;
    }
};
