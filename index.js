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
  let messaging_events = req.body.entry[0].messaging;
  for(var i = 0; i < messaging_events.length; i++){
    let event = messaging_events[i];
    let sender = event.sender.id;
    if(event.message && event.message.text){
      let text = event.message.text;
      decideMessage(sender, text);
      //sendText(sender, "Text Echo:" + text.substring(0,100));
    }
  }
  res.sendStatus(200);
});


function decideMessage(sender, text1){
  let text = text1.toLowerCase();
  if(text.includes('hi') || text.includes('hello') || text.includes('hey')){
    //sendText(sender, 'Hi! I\'m John, nice to meet you!');
    sendGeneric(sender);
  }else{
    sendText(sender, "Text Echo:" + text.substring(0,100));
  }
};

function sendText(sender, text){
  let messageData = {text: text};
  sendRequest(sender, messageData);
};

function sendGeneric(sender){
  let messageData = {
    "attachment":{
     "type":"template",
     "payload":{
       "template_type":"generic",
       "elements":[
          {
           "title":"Here are some things I can help you with:",
           "image_url":"https://scontent-lga3-1.xx.fbcdn.net/v/t31.0-8/16722394_395168420840964_639191937633027848_o.jpg?oh=34aeba457c1a5fb0d815a37601ad350a&oe=5931630B",
           "subtitle":"subtitletext",
           "default_action": {
             "type": "web_url",
             "url": "http://johnbgarcia.com",
             "messenger_extensions": true,
             "webview_height_ratio": "tall",
             "fallback_url": "http://johnbgarcia.com"
           },
           "buttons":[
             {
               "type":"web_url",
               "url":"http://johnbgarcia.com/images/JohnBGarcia-Resume.pdf",
               "title":"View My Resume"
             },{
               "type":"postback",
               "title":"generic message",
               "payload":"leave"
              }              
            ]      
          }
        ]
      }
    }
  };
  sendRequest(sender, messageData);
};

function sendRequest(sender, messageData){
  request({
    url : 'https://graph.facebook.com/v2.6/me/messages',
    qs : {access_token : token},
    method : 'POST',
    json : {
      recipient : {id : sender},
      message : messageData
    }
  }, function(error, response, body){
    if (error){
      console.log('Sending Error');
    }else if (response.body.error){
      console.log('Response Body Error:' + response.body.error);
    }
  });
};

//server
app.listen(app.get('port'), function(){
  console.log('Running on: port.');
});