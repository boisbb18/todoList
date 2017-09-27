const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');


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

function sendingEmail = function(callback) {
  smtTransport.sendMail(mailOptions,function(err,response){
      if(err) {
        console.log(err);
      } else {
        callback()
      }
    })
}