'use strict';

var path = process.cwd();

var User = require("../models/users");

module.exports = function (app, passport){
	
	
	function authenticatedOrNot(req, res, next) {
		if (req.isAuthenticated()){
			return next();
		} else {
			res.redirect('/login.ejs');
		}
	}
	
	app.route('/')
		.get(function (req, res){
			if (req.isAuthenticated()){
				res.render(path + '/public/dashboard.ejs', {user: req.user});
			} else {
				res.render(path + '/public/index.ejs');
			}
		});
		
	app.get('/signup', function(req, res){
			res.render(path + '/public/signup.ejs', {message: req.flash('signupMessage')});
		});
		
	app.post('/signup', passport.authenticate('signup', {
		successRedirect: 'dashboard',
		failureRedirect: 'signup',
		failureFlash: true
	}));
	
	app.get('/profile', authenticatedOrNot, function(req,res) {
		res.render('/dashboard.ejs', {
			user: req.user
		});
	});
	
	app.get('/auth/facebook&output=embed', passport.authenticate('facebook', {scope: 'email'}));
	
	app.get('/auth/facebook/callback', 
		passport.authenticate('facebook', {
			successRedirect: 'dashboard',
			failureRedirect: 'index'
		}));
		
	app.route('/login')
		.get(function(req, res){
			res.sendFile(path + '/public/login.ejs', {message: req.flash('loginMessage')});
		});
		
		
	app.post('/login',
		passport.authenticate('local', {
			successRedirect: 'dashboard',
			failureRedirect: 'login'
		})
	);
		
	app.route('/logout')
		.get(function(req, res){
			req.logout();
			res.redirect('index');
		})
	
	app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));
	
	app.get('auth/facebook/callback',
		passport.authenticate('facebook', {failureRedirect: '/login'}),
		function(req,res){
			res.render('loggedin', {user: req.user});
		}
	);
	
	
	
	// app.route('/api/clicks')
	// 	.get(clickHandler.getClicks)
	// 	.post(clickHandler.addClick)
	// 	.delete(clickHandler.resetClicks);
};