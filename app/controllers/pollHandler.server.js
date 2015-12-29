'use strict';


var Users = require('../models/users.js');

function pollHandler () {
    
    function getUsername(req) {
        if (req.user.local.username)
            return {'local.username': req.user.local.username};
            
        else
            return {'facebook.id': req.user.facebook.id};
    }
    
    this.addPoll = function(req, res) {
        var user = getUsername(req);
        var options = req.body.options.filter(function(value) {
            return value !== '';
        }).map(function(value) {
            return {option: value, votes: 0}
        });
        var pollUrl = req.body.pollname.replace(/\s/g, '%20');
        var newPoll = {
            pollName: req.body.pollname,
            pollUrl: pollUrl,
            options: options
        };
        req.app.locals.pollname = req.body.pollname;
        Users.findOneAndUpdate(user, {$push: {'polls': newPoll} }, {upsert: true})
            .exec(function(err, result) {
            if (err)
                throw err;
            res.redirect('/pollcreated');
            });
            
    };
    this.deletePoll = function(req, res) {
        var user = getUsername(req);
        var pollToDelete = req.body.pollToDelete;
        Users.findOneAndUpdate(user, {$pull: {'polls': {pollName: pollToDelete}}})
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
