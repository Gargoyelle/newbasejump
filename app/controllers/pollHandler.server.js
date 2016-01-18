'use strict';


var User = require('../models/users.js');
var Poll = require('../models/polls.js');

function pollHandler () {
    
    this.addPoll = function(req, res) {
        if (req.body.options.length < 2 || !req.body.pollname) {
            req.flash('createdMessage', 'Sorry, you need to enter a poll name and at least two options!');
            res.redirect('/dashboard');
        }
        var user = req.user._id;
        var options = req.body.options.filter(function(value) {
            return value !== '';
        }).map(function(value) {
            return {option: value, votes: 0}
        });
        var url = req.app.locals.url;
        var pollUrl = req.body.pollname.replace(/\s|\W/gi, '');
        var newPoll = new Poll({
            name: req.body.pollname,
            url: pollUrl,
            options: options,
            user: user
        });
        
        newPoll.save(function(err, doc){
			if (err)
				throw err;
			
			req.flash('createdMessage', 'Your poll has been created! Check it out at <a href="' + url + '/' + (req.user.local.username?req.user.local.username:req.user.facebook.name) + '/' + pollUrl + '">' + url + '/' + (req.user.local.username?req.user.local.username:req.user.facebook.name) + '/' + pollUrl + '</a>');
			res.redirect('/dashboard');
		});
            
    };
    
    this.voteOnPoll = function(req, res) {
        var pollId = req.body.pollId;
        var option = req.body.option;
        Poll.findById(pollId).exec(function(err, poll) {
            if (err)
                throw err;
            for (var i = 0; i < poll.options.length; i++) {
                if (poll.options[i].option === option) {
                    poll.options[i].votes++;
                    poll.markModified('options');
                }
            }
            poll.save(function(err) {
                if (err)
                    throw err;
            });
            res.redirect('/' + req.params.user + '/' + poll.url + '/results');
        })
    }
    
    this.addNewOption = function(req, res) {
        var pollId = req.body.pollId;
        var options;
        if (Array.isArray(req.body.options)) {
            options = req.body.options.filter(function(value) {
                return value !== '';
            }).map(function(value) {
                return {option: value, votes: 0}
            });
        } else if (req.body.options !== ''){
            options = [{option: req.body.options, votes: 0}];
        }
        console.log(options);
        Poll.findById(pollId).exec(function(err, poll) {
            if (err)
                throw err;
            for (var i = 0; i < options.length; i++) {
                poll.options.push(options[i]);
                poll.markModified('options');
            }
            console.log(poll);
            poll.save(function(err) {
                if (err)
                    throw err;
            });
            res.redirect('/' + req.params.user + '/' + poll.url);
        })
    }
    
    this.deletePoll = function(req, res) {
        var user = req.user._id;
        var pollToDelete = req.body.pollToDelete;
        Poll.findOneAndRemove({'_id': pollToDelete})
            .exec(function(err, result) {
                if (err)
                    throw err;
                res.redirect('/mypolls');
            })
    }
    
}

module.exports = pollHandler;
// var Clicks = require("../models/clicks.js")

// function clickHandler (db) {


//     this.getClicks = function (req, res) {

//         Clicks
//             .findOne({}, {'_id': false})
//             .exec(function (err, result){
//                 if (err) {throw err;}
                
//                 if (result) {
//                     res.json(result);
//                 } else {
//                     var newDoc = new Clicks({'clicks':0});
//                     newDoc.save(function (err, doc){
//                         if (err) {throw err;}
                        
//                         res.json(doc);
//                     });
//                 }
//             });
// 	};
	
// 	this.addClick = function (req, res) {
// 	    Clicks
// 	        .findOneAndUpdate({}, {$inc: {'clicks': 1 } })
// 	        .exec(function (err, result){
// 	            if (err) {throw err;}
	            
// 	            res.json(result);
// 	        });
// 	};
// 	this.resetClicks = function (req, res){
// 	    Clicks
// 	        .findOneAndUpdate({}, {'clicks': 0 })
// 	        .exec(function (err, result){
// 	            if (err) {throw err;}
	            
// 	            res.json(result);
// 	        })
// 	}
// }

// module.exports = clickHandler;
