var request = require('request');
var User = require('../client/models/user');
var isLoggedIn = function(req) {
  return req.session ? !!req.session.user : false;
}


exports.createSession = function(req,res,newUser) {
  return req.session.regenerate(function() {
    req.session.user = newUser
    res.redirect('/loggedIn');
  });
}

exports.updatingUser = function(username,updatingObj,callback) {
    User.findOneAndUpdate({username:username},updatingObj,{upsert: true, new: true, runValidators: true,strict:false,overwrite:true}).exec(function(err,doc) {
      if(err) {
        console.log('Error --> ',err);
      } else {
        callback();
      }
    })
}