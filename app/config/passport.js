'use strict';

var mongoose = require("mongoose")
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/users');
var configAuth = require('./auth');

module.exports = function (passport) {
	
	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});
	
	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});
	
	
	//FACEBOOK
	passport.use(new FacebookStrategy({
		clientID: configAuth.facebookAuth.clientID,
		clientSecret: configAuth.facebookAuth.clientSecret,
		callbackURL: configAuth.facebookAuth.callbackURL,
		passReqToCallback: true,
		profileFields: ['id', 'emails', 'name']
	},
	
	function(req, accessToken, refreshToken, profile, done) {
		process.nextTick(function() {
			User.findOne({'facebook.id': profile.id}, function(err, user){
				if (err) 
					return done(err);
				
				if (user) 
					return done(null, user);
					
				else 
					
					var newUser = new User();
					
					newUser.facebook.id = profile.id;
					newUser.facebook.token = accessToken;
					newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
					newUser.facebook.email = profile.emails[0].value;
					
					newUser.save(function(err){
						if (err)
							throw err;
						return done(null, newUser);
					});
			});
		});
	}));
	
	
	//REGISTRATION
	passport.use('signup', new LocalStrategy({
		passReqToCallback: true
	},
	function(req, username, password, done) {
		
		process.nextTick(function() {
			User.findOne({'local.username': username}, function (err, user){
				if (err) 
					return done(err);
					
				else if (user) 
					return done(null, false, req.flash('signupMessage', 'That username is already taken.'));

				else 
					var newUser = new User();
					
					newUser.local.username = username;
					newUser.local.email = req.params.email;
					newUser.local.password = newUser.generateHash(password);
					
					newUser.save(function(err){
						if (err)
							throw err;
						return done(null, newUser);
					});
					
			});
		});
	}));
	
	
	//LOGIN
	passport.use('login', new LocalStrategy({
		passReqToCallback: true
	},
	function(req, username, password, done) {
		
		User.findOne({'local.username' : username}, function(err, user) {
			if (err)
				return done(err);
			
			if (!user)
				return done(null, false, req.flash('loginMessage', 'Username not found.'));
				
			if(!user.validPassword(password))
				return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
				
			return done(null, user);
		});
	}));
	
	
	//CHANGE PASSWORD
	passport.use('settings', new LocalStrategy({
		usernameField: 'password',
		passwordField: 'newpassword',
		passReqToCallback: true
	},
	
	function(req, password, newpassword, done) {
		
		process.nextTick(function() {
		
		
		User.findOne({'local.username': req.user.local.username}, function(err, user){
			if (err)
				return done(err);
		
			if (!user.validPassword(password))
				return done(null, false, req.flash('settingsMessage', 'Wrong password!'));
			
			else 
				user.local.password = user.generateHash(newpassword);
				user.save(function(err){
						if (err)
							throw err;
						return done(null, user);
				});
				
		})});
	}));
};
