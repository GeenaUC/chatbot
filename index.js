const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;

const line = require('@line/bot-sdk');
const client = new line.Client({
    channelAccessToken: '4bpYw3g3xJCxM1aURCIilx/NGBcInRFHjUhFXZy3Jl4KvnRrpZkUoJgwc4kAjuyCrcWhFHyKdHbMAbWHh4OYKU1C5l5ty00VxKtEzwpIp1/16i1RDwXD5WFdvd5wKWEV7JASy9HScLtLbqRTGob2NwdB04t89/1O/w1cDnyilFU='
});

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const dbUrl = 'mongodb://user02:user02@ds157834.mlab.com:57834/smartqr';
const dbName = 'smartqr';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req,res) => {

    // MongoClient.connect(dbUrl, (err, client) => {
    //     assert.equal(null, err);
    //     var db = client.db(dbName);
    //     const collection = db.collection('users');
    //     collection.find({}).toArray((err, result) => {
    //         if (err) throw err;
    //         console.log("Connected successfully !");
    //         console.log(result);
    //     })
       
    //     client.close();
    //   });

      res.send({status: "ok"})
})

app.post('/webhook', (req,res) => {
    console.log('------ /webhook ------');
    let body = req.body;
    let events = body.events[0];
    let source = events.source;
    let message = events.message;
    let type = events.type;
    let replyToken = events.replyToken;

    // console.log('Body ==>');
    // console.log(body);
    // console.log(`Source ==>`);
    // console.log(source);
    // console.log(`Message ==>`);
    // console.log(message);
    // console.log(`type ==> ${type}`);
    // //console.log(type);
    // console.log(`replyToken ==> ${replyToken}`);
    // //console.log(replyToken);
    // console.log('----------------------');

    switch (type) {
        case 'message' :
            let type = message.type;
            //let id = message.id;
            
            if (type == 'text') {
                let text = message.text;

                console.log(`received text : ${text}`);

                let item = text.split(' ');

                let action = item[0];
                let name = item[1];

                let types;
                let texts;

                switch (name) {
                    case 'Gna' :
                        let results;
                        MongoClient.connect(dbUrl, (err, client) => {
                            assert.equal(null, err);
                            var db = client.db(dbName);
                            const collection = db.collection('users');
                            collection.find({name : 'Gna'}).toArray((err, result) => {
                                if (err) throw err;
                                console.log(result);
                                results = result[0].age;
                            })
                        });

                        switch (action) {
                            case 'age' :
                                types = "text";
                                texts = results;
                                break;
                            default:
                                break;
                        }

                        break;
                    default:
                        break;
                }

                const messageResponse = [
                    {
                        type: types,
                        text: texts
                    }
                    // {
                    //     type: "sticker",
                    //     packageId: "11537",
                    //     stickerId: "52002758"
                    // }
                ];

                replyMessage(replyToken, messageResponse);
                
            } else if (type == 'sticker') {
                let stickerID = message.stickerId;
                let packageID = message.packageId;
            }

            break;
        case 'follow' :
            break;
        case '่join' :
            break;
        case 'follow' :
            break;
        case 'unfollow' :
            break;
        default:
            break;
    }

    let respone = {
        status: 'ok',
        body: body
    };

    res.send(respone);
})

// Method reply message
const replyMessage = (replyToken, message) => {
    console.log('==> [replyMessage]');
    console.log(`replayToken: ${replyToken}`);
    console.log(`message: `);
    console.log(message);

    client.replyMessage(replyToken, message)
        .then(() => {
            console.log(`replyMessage is successfully`);
        })
        .catch((err) => {
            console.log(`error : ${err}`);
        });
}

app.listen(port, () => {
    console.log(`run on port : ${port}`);
})