'use strict';

var socket = io.connect();

socket.on('add element', function(data){
    var code = data.code;
    console.log("received");
    var div = document.createElement('div');
    div.setAttribute('class', 'col-sm-4 ' + code);
    div.innerHTML = data.div;
    console.log(stockContainer);
    stockContainer.append(div);
});

socket.on('add series', function(data){
    console.log(data.series);
    chart.addSeries(data.series);
});

socket.on('delete', function(data){
    chart.series[data.index].remove();
    console.log(data.id);
    var elem = document.querySelector('.' + data.id);
    console.log(elem);
    elem.parentNode.removeChild(elem);
})