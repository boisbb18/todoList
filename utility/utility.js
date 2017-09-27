var request = require('request');
var User = require('../client/models/user');
const nodemailer = require('nodemailer');

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

var smtTransport = nodemailer.createTransport({
    service:'gmail',
    host:'boos.bb20@gmail.com',
    auth:({
      user:"boos.bb20@gmail.com",
      pass:"saru2008"
    })
  })

var mailOptions = {
  from:'Bois <boos.bb20@gmail.com>',
  to: 'bois.bb18@gmail.com',
  subject:'nodemailer test',
  text: 'Hello world! '
}

exports.sendingEmail = function(subject,message,callback) {
  mailOptions.subject = subject || mailOptions.subject;
  mailOptions.text = message || mailOptions.text;
  smtTransport.sendMail(mailOptions,function(err,response){
      if(err) {
        console.log(err);
      } else {
        callback()
      }
    })
}