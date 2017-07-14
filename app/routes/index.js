'use strict';

var path = process.cwd();
var chartHandler = require('../controllers/chartHandler.js');
module.exports = function (app, io) {

	app.route('/')
		.get(function (req, res) {
			res.sendFile(path + '/public/index.html');
		});
		
	app.route('/stock')
		.post(function(req, res){
				chartHandler.findMyStock(req.body).then(function(){
					chartHandler.addStock(req.body.dataset_code).then(function(){
						chartHandler.allStocks().then(function(docs){
						//	console.log(docs);
							res.send(chartHandler.makeChart(docs));
						});
					});
				}, function(){
					res.send(null);
				});
		})
		.get(function(req, res){
			chartHandler.deleteStock(req.query.code);
			res.send("deleted");
		});
		
	app.route('/chart')
		.get(function(req, res){
			chartHandler.allStocks().then(function(docs){
					res.send(chartHandler.makeChart(docs));
			});
		});
		
	io.on('connection', function (socket) {
		console.log('user connected');
		socket.on('new element', function (data) {
    		console.log(data);
    		socket.broadcast.emit('add element', data);
		});
		socket.on('new series', function (data){
		//	console.log(data);
			socket.broadcast.emit('add series', data);
		});
		socket.on('remove stock', function(data){
			console.log(data);
			socket.broadcast.emit('delete', data);	
		});
	});

};
