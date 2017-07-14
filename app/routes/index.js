'use strict';

var path = process.cwd();
var chartHandler = require('../controllers/chartHandler.js');
module.exports = function (app, io) {

/*	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}*/

	app.route('/')
		.get(function (req, res) {
			res.sendFile(path + '/public/index.html');
		});

/*	app.route('/login')
		.get(function (req, res) {
			res.sendFile(path + '/public/login.html');
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/login');
		});

	app.route('/profile')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/profile.html');
		});

	app.route('/api/:id')
		.get(isLoggedIn, function (req, res) {
			res.json(req.user.github);
		});

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));*/
		
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
