'use strict';

var mongoose = require('mongoose');
var bcrypt = require("bcrypt-nodejs");

var userSchema = new mongoose.Schema({
	local: {
		username	: String,
		email		: String,
		password	: String,
	},
	facebook: {
		id		: String,
		token	: String,
		email	: String,
		name	: String,
	},
	polls: []
});

userSchema.methods.generateHash = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password);
};

var User = mongoose.model('User', userSchema);

module.exports = User;
