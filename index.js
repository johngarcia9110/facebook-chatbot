'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();

app.set('port', (process.env.PORT || 5000));

//process data
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//routes
app.get('/', function(req, res){
  res.send("Hi I am a chatbot");
});

//Facebook

const token = 'EAAaZBXy1wLDMBAM5uLZA40rnFVburiWhxrncV6Bclv9b1CfZAhrFWcwo7REVMguMhZC2tAWY4eUM2gfenEP0k46DsfImKoGYIS8e4WZBZA34kZCeO3MmuQrn0KRjPsUJGrKf8uYzBZAu04oML7ALlWv5msl6yqiZABmc8sSPrSAZCpZBQZDZD';

app.get('/webhook/', function(req,res){
  if(req.query['hub.verify_token'] === 'johnbgarcia'){
    res.send(req.query['hub.challenge']);
  }
  res.send('Wrong Token');
});

app.post('/webhook/', function(req,res){
  let messaging_events = req.body.entry[0].messaging_events;
  for(var i; i<messaging_events.length; i++){
    let event = messaging_events[i];
    let sender = event.sender.id;
    if(event.message && event.message.text){
      let text = event.message.text;
      sendText(sender, "Text Echo:" + text.substring(0,100));
    }
  }
  res.sendStatus(200);
});

function sendText(sender, text){
  let messageData = {text: text};
  request({
    url : 'https://graph.facebook.com/v2.6/me/messages',
    qs : {access_token, token},
    method : 'POST',
    json : {
      receipt : {id : sender},
      message : messageData
    }
  }, function(error, response, body){
    if (error){
      console.log('Sending Error');
    }else if (response.body.error){
      console.log('Response Body Error')
    }
  });
};

//server
app.listen(app.get('port'), function(){
  console.log('Running on: port.');
});