'use strict'

// TODO: Remove temp notes at bottom of document before live roll out.

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
    if(event.postback){
      let text = JSON.stringify(event.postback);
      decideMessage(sender,text);
    }
  }
  res.sendStatus(200);
});


function decideMessage(sender, text1){
  let text = text1.toLowerCase();
  if(text.includes('hi') || text.includes('hello') || text.includes('hey')){
    sendText(sender, 'Hi! I\'m John\'s chatbot, nice to meet you!');
    //sendGenericMessage(sender);//testing
    sendButtonMessage(sender, 'Select One Of The Following Options:');
  }else if(text['payload'] === 'getstarted'){
    sendText(sender, "Postback recieved");
  }else{
    sendText(sender, "John's Chatbot is in beta, pretty soon, there will be no difference between John and the this robot.. For now though, I can help you with the following:");
    sendButtonMessage(sender, 'Select One Of The Following Options:');
  }
};

function sendText(sender, text){
  let messageData = {text: text};
  sendRequest(sender, messageData);
};

function sendButtonMessage(sender, text){
  let messageData = {
      "attachment":{
        "type":"template",
        "payload":{
          "template_type":"button",
          "text": text,
          "buttons":[
            {
              "type":"web_url",
              "url":"http://johnbgarcia.com",
              "title": 'Visit My Portfolio'
            },
            {
              "type":"web_url",
              "url":"http://johnbgarcia.com/images/JohnBGarcia-Resume.pdf",
              "title":"View My Resume"
            }
          ]
        }
      }
  }
  sendRequest(sender, messageData);
};

function sendGenericMessage(sender){
  let messageData = {
    "attachment":{
     "type":"template",
     "payload":{
       "template_type":"generic",
       "elements":[
          {
           "title":"Here are some things I can help you with:",
           "image_url":"http://johnbgarcia.com/images/portfolio-website.png",
           "subtitle":"subtitletext",
           "default_action": {
             "type": "web_url",
             "url": "http://johnbgarcia.com"
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
      console.log('Response Body Error:' + response.body.error.message);
    }
  });
};

//server
app.listen(app.get('port'), function(){
  console.log('Running on: port.');
});



//Temp notes:
// Update greeeting use the below command in terminal:
// curl -X POST -H "Content-Type: application/json" -d '{
//   "setting_type":"call_to_actions",
//   "thread_state":"new_thread",
//   "call_to_actions":[
//     {
//       "payload":"getstarted"
//     }
//   ]
// }' "https://graph.facebook.com/v2.6/me/thread_settings?access_token=EAAaZBXy1wLDMBAM5uLZA40rnFVburiWhxrncV6Bclv9b1CfZAhrFWcwo7REVMguMhZC2tAWY4eUM2gfenEP0k46DsfImKoGYIS8e4WZBZA34kZCeO3MmuQrn0KRjPsUJGrKf8uYzBZAu04oML7ALlWv5msl6yqiZABmc8sSPrSAZCpZBQZDZD"    
// 
// 
// curl -X POST -H "Content-Type: application/json" -d '{
//   "recipient":{
//     "id":"USER_ID"
//   },
//   "sender_action":"typing_on"
// }' "https://graph.facebook.com/v2.6/me/thread_settings?access_token=EAAaZBXy1wLDMBAM5uLZA40rnFVburiWhxrncV6Bclv9b1CfZAhrFWcwo7REVMguMhZC2tAWY4eUM2gfenEP0k46DsfImKoGYIS8e4WZBZA34kZCeO3MmuQrn0KRjPsUJGrKf8uYzBZAu04oML7ALlWv5msl6yqiZABmc8sSPrSAZCpZBQZDZD"    
