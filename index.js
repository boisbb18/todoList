var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var http = require('http');
var path = require('path');
var User = require('./client/models/user');
var db = require('./client/config');
var session = require('express-session');
var util = require('./utility/utility');
var nodemailer = require('nodemailer');
var router = express.Router();
app.use(bodyParser());
app.use(bodyParser.urlencoded({extended: true})); 
app.set('port',process.env.PORT || 3000);

 app.use(express.static(path.join(__dirname, './client')));

 app.use(session({
  secret:'secret',
  resave:false,
  saveUninitialized:true
 }))

 

  app.post('/signup',function(req,res) {
    var username = req.body.login;
    var password = req.body.password;
    var email = req.body.email;
    User.findOne({username:username}).exec(function(err,user) {
      if (!user) {
        var newUser = new User({
          username:username,
          password:password,
          email: email
        });
        newUser.save(function(err, newUser) {
          console.log('It is coming here');
          if(err) {
            req.sendStatus(500).send(err);
          } else {
               var temp = {"$inc":{"__v":1}};
            util.updatingUser (username,temp ,function() {
            util.sendingEmail('Congratulations!','Thanks for joining our wonderful community!',function() {

            util.createSession(req,res,newUser);     
            })
           })
          }
        });
      } else {
        console.log('Account already exists');
        res.redirect('/')
      }
    })
  });

  app.get('/send',function(req,res,next) {
    util.sendingEmail('Congratulations!','You completed all of the tasks for today!',function() {
      next();
    })
  })


  app.post('/',function(req,res) {
    var username = req.body.login;
    var password = req.body.password;
    User.findOne({ username: username }).exec(function(err, user) {
      if(!user) {
        res.redirect('/');
      } else {
        User.comparePassword(password,user.password,function(err,match) {
          if (match) {
            var temp = {"$inc":{"__v":1}};
            util.updatingUser (user.username,temp ,function() {                 
                util.createSession(req,res,user);      
              //    })
           })
          } else {
            res.redirect('/signup');
          }
        })
      }
    })


});

  app.get('/',function(req,res,next,done) {
     res.sendFile('./index.html', {root: path.join(__dirname, './client')});
  });



  app.get('/loggedIn',function(req,res) {
    if(req.session.user) {
     res.sendFile('./index.html', {root: path.join(__dirname, './client')});
   } else {
    res.redirect('/');
   }
 });

  app.get('/info',function(req,res) {
     res.json(req.session.user);
  })

  app.post('/loggedIn', function(req,res) {
  if(req.session.user) {
    var arr = req.body;
    util.updatingUser(req.session.user.username,{"$set":{"todos":arr}},function() {
        console.log('It is working');
        req.session.user = null
        res.redirect('/');
      });
  } else {
    res.redirect('/');
  }
})



  app.get('/signup',function(req,res) {
     res.sendFile('./index.html', {root: path.join(__dirname, './client')});
  });




http.createServer(app).listen(app.get('port'),function() {
  console.log('Express server listening on port '+ app.get('port'));
})
