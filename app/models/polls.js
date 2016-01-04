'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pollSchema = new Schema({
	    name    : String,
	    url     : String,
	    options : [],
	    user    : {type: Schema.ObjectId, ref: 'User'}
}); 


var Poll = mongoose.model('Poll', pollSchema);

module.exports = Poll;
