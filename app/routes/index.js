'use strict';

var path = process.cwd();

var User = require("../models/users");
var Poll = require('../models/polls');
var PollHandler = require(path + '/app/controllers/pollHandler.server.js');

module.exports = function (app, passport){
	
	
	function authenticatedOrNot(req, res, next) {
		if (req.isAuthenticated()){
			return next();
		} else {
			res.redirect('/login');
		}
	}
	
	function findPolls(req, res, next) {
		Poll.find({'user': req.user._id}, function (err, polls) {
			if (err)
				throw err;
			req.polls = polls;
			return next();
		})
	}
	
	function getPoll(req, res, next) {
        var poll = req.params.pollname;
        Poll.findOne({'url': poll}, function(err, poll) {
            if (err)
                throw err;
            req.poll = poll;
            return next();
        })
	}
	
	
	var pollHandler = new PollHandler();
	
	app.route('/')
		.get(function (req, res){
			if (req.isAuthenticated()){
				res.render(path + '/public/dashboard.ejs', {
					user: req.user,
					message: req.flash('createdMessage')
				});
			} else {
				res.render(path + '/public/index.ejs');
			}
		});
		
		
	// FB REGISTRATION
	app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));
	
	app.get('/auth/facebook/callback', 
		passport.authenticate('facebook', {
			successRedirect: '/dashboard',
			failureRedirect: 'index'
		}));
	
	//DASHBOARD
	app.get('/dashboard', authenticatedOrNot, function(req,res) {
		res.render(path + '/public/dashboard.ejs', {
			user: req.user,
			message: req.flash('createdMessage')
		});
	});	
	
	app.route('/newpoll')
		.post(authenticatedOrNot, pollHandler.addPoll);
	
	
	//MY POLLS
	app.get('/mypolls', authenticatedOrNot, findPolls, function(req, res) {
		res.render(path + '/public/mypolls.ejs', {
			user: req.user,
			polls: req.polls,
			url: req.app.locals.url
		});
	});	
	
	app.route('/deletepoll')
		.post(authenticatedOrNot, pollHandler.deletePoll);
		

	//POLLS
	
	app.get('/:user/:pollname', getPoll, function(req, res, next) {
		res.render(path + '/public/pollpage.ejs', {
			user: req.user,
			pollUser: req.params.user,
			poll: req.poll
		})
	})
	
	app.route('/:user/vote')
		.post(pollHandler.voteOnPoll);
		
	app.route('/:user/addOption')
		.post(pollHandler.addNewOption);
	
		
	app.get('/:user/:pollname/results', getPoll, function(req, res) {
		res.render(path + '/public/pollresults.ejs', {
			user: req.user,
			pollUser: req.params.user,
			poll: req.poll
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