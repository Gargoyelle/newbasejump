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
				if (err) {
					return done(err);
				}
				
				if (user) {
					return done(null, user);
				} else {
					
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
				}
			});
		});
	}));
	
	passport.use('signup', new LocalStrategy({
		passReqToCallback: true
	},
	function(req, username, password, done) {
		
		process.nextTick(function() {
			User.findOne({'local.username': username}, function (err, user){
				if (err) {
					console.log(err);
					return done(err);
				} else if (user) {
					return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
				} else {
					
					var newUser = new User();
					
					newUser.local.username = username;
					newUser.local.email = req.params.email;
					newUser.local.password = newUser.generateHash(password);
					
					newUser.save(function(err){
						if (err)
							throw err;
						return done(null, newUser);
					});
					
				}
			});
		});
	}
	));
};
	
// 	passport.use(new FacebookStrategy({
// 		clientID: configAuth.facebookAuth.clientID,
// 		clientSecret: configAuth.facebookAuth.clientSecret,
// 		callbackURL: configAuth.facebookAuth.callbackURL
		
// 		},
// 		function(accessToken, refreshToken, profile, done) {
// 			FbUsers.findOne({fbid: profile.id}, function (err, oldUser){
// 				if (err) throw err;
// 				if (oldUser){
// 					done(null, oldUser);
// 				} else {
// 					var newUser = new FbUsers({
// 						fbId: profile.id,
// 						email: profile.emails[0].value,
// 						name: profile.displayName
// 					}).save(function(err, newUser){
// 						if (err) throw err;
// 						done(null, newUser);
// 					})
// 				}
// 			})
// 		}
// 	))
	
	
	
// 	function userExist(req, res, next){
// 		User.count({
// 			username: req.body.username
// 		}, function (err, count){
// 			if (count === 0) {
// 				next();
// 			} else {
// 				res.redirect('/signup');
// 			}
// 		});
// 	}
// }
// module.exports = function (passport) {
// 	

// 	passport.use(new GitHubStrategy({
// 		clientID: configAuth.githubAuth.clientID,
// 		clientSecret: configAuth.githubAuth.clientSecret,
// 		callbackURL: configAuth.githubAuth.callbackURL
// 	},
// 	function (token, refreshToken, profile, done) {
// 		process.nextTick(function () {
// 			User.findOne({ 'github.id': profile.id }, function (err, user) {
// 				if (err) {
// 					return done(err);
// 				}

// 				if (user) {
// 					return done(null, user);
// 				} else {
// 					var newUser = new User();

// 					newUser.github.id = profile.id;
// 					newUser.github.username = profile.username;
// 					newUser.github.displayName = profile.displayName;
// 					newUser.github.publicRepos = profile._json.public_repos;
// 					newUser.nbrClicks.clicks = 0;

// 					newUser.save(function (err) {
// 						if (err) {
// 							throw err;
// 						}

// 						return done(null, newUser);
// 					});
// 				}
// 			});
// 		});
// 	}));
// };
