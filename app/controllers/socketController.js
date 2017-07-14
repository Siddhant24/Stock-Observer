'use strict';

var socket = io.connect();

socket.on('add element', function(data){
    var code = data.code;
    var div = document.createElement('div');
    div.setAttribute('class', 'col-sm-4 ' + code);
    div.innerHTML = data.div;
    stockContainer.append(div);
});

socket.on('add series', function(data){
    chart.addSeries(data.series);
});

socket.on('delete', function(data){
    chart.series[data.index].remove();
    var elem = document.querySelector('.' + data.id);
    elem.parentNode.removeChild(elem);
})