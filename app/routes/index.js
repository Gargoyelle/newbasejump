'use strict';

var path = process.cwd();

var User = require("../models/users");
var PollHandler = require(path + '/app/controllers/pollHandler.server.js');

module.exports = function (app, passport){
	
	
	function authenticatedOrNot(req, res, next) {
		if (req.isAuthenticated()){
			return next();
		} else {
			res.redirect('/login.ejs');
		}
	}
	
	function getOptions(req, res, next) {
		var user = req.params.user;
        var poll = req.params.pollname;
        User.findOne({'local.username': user}, function(err, user) {
            if (err)
                throw err;
            var polls = user.polls;
            var regex = /\W/gi;
            for (var i = 0; i < polls.length; i++) {
                var pollName = polls[i].pollName.replace(regex, '');
                poll = poll.replace(regex, '');
                if (pollName === poll) {
                    req.options = polls[i].options;
                    return next();
                }
            }
            req.options = null;
            return next();
        })
	}
	
	
	var pollHandler = new PollHandler();
	
	app.route('/')
		.get(function (req, res){
			if (req.isAuthenticated()){
				res.render(path + '/public/dashboard.ejs', {user: req.user});
			} else {
				res.render(path + '/public/index.ejs');
			}
		});
		
	
	//DASHBOARD
	app.get('/dashboard', authenticatedOrNot, function(req,res) {
		res.render(path + '/public/dashboard.ejs', {
			user: req.user
		});
	});	
	
	app.route('/newpoll')
		.post(authenticatedOrNot, pollHandler.addPoll);
	
	
	app.get('/pollcreated', authenticatedOrNot, function(req,res) {
		res.render(path + '/public/pollcreated.ejs', {
			user: req.user,
			url: req.app.locals.url,
			pollname: '/' + req.user.polls[req.user.polls.length -1].pollUrl
		});
	});	
	
	//MY POLLS
	app.get('/mypolls', authenticatedOrNot, function(req,res) {
		res.render(path + '/public/mypolls.ejs', {
			user: req.user,
			url: req.app.locals.url
		});
	});	
	
	app.route('/deletepoll')
		.post(authenticatedOrNot, pollHandler.deletePoll);
		
	
	//POLLS
	
	app.get('/:user/:pollname', getOptions, function(req, res) {
		res.render(path + '/public/pollpage.ejs', {
			user: req.user,
			userPoll: req.params.user,
			pollName: req.params.pollname,
			pollOptions: req.options
		})
	})
	
	
	// LOCAL REGISTRATION
	app.get('/signup', function(req, res){
			res.render(path + '/public/signup.ejs', {message: req.flash('signupMessage')});
		});
		
	app.post('/signup', passport.authenticate('signup', {
		successRedirect: 'dashboard',
		failureRedirect: 'signup',
		failureFlash: true
	}));
	
	// FB REGISTRATION
	app.get('/auth/facebook&output=embed', passport.authenticate('facebook', {scope: 'email'}));
	
	app.get('/auth/facebook/callback', 
		passport.authenticate('facebook', {
			successRedirect: '/dashboard',
			failureRedirect: 'index'
		}));
		
	//LOGIN
	app.route('/login')
		.get(function(req, res){
			res.render(path + '/public/login.ejs', {message: req.flash('loginMessage')});
		});
		
		
	app.post('/login', passport.authenticate('login', {
		successRedirect: 'dashboard',
		failureRedirect: 'login',
		failureFlash: true
	}));
		
		
	//LOGOUT
	app.route('/logout')
		.get(function(req, res){
			req.logout();
			res.redirect('/');
		})
	
	//SETTINGS
	app.get('/settings', authenticatedOrNot, function(req,res) {
		res.render(path + '/public/settings.ejs', {
			user: req.user,
			message: req.flash('settingsMessage')
		});
	});	
	
	app.post('/settings', passport.authenticate('settings', {
		successRedirect: 'dashboard',
		failureRedirect: 'settings',
		failureFlash: true
	}));
	
};