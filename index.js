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

    MongoClient.connect(dbUrl, (err, client) => {
        assert.equal(null, err);
        var db = client.db(dbName);
        const collection = db.collection('users');
        collection.find({}).toArray((err, result) => {
            //if (err) throw err;

            if (result == '') {
                console.log('not found');
            }
            console.log("Connected successfully !");
            console.log(result);
        })
       
        client.close();
      });

      res.send({status: "ok"})
})

app.post('/webhook', (req,res) => {
    //console.log('------ /webhook ------');
    let body = req.body;
    let events = body.events[0];
    let source = events.source;
    let message = events.message;
    let type = events.type;
    let replyToken = events.replyToken;

    console.log('Body ==>');
    console.log(body);
    // console.log(`Source ==>`);
    // console.log(source);
    // console.log(`Message ==>`);
    // console.log(message);
    // console.log(`type ==> ${type}`);
    // //console.log(type);
    // console.log(`replyToken ==> ${replyToken}`);
    // //console.log(replyToken);
    // console.log('----------------------------------------');

    switch (type) {
        case 'message' :
            let type = message.type;
            //let id = message.id;
            
            if (type == 'text') {
                let text = message.text;

                console.log(`received text : ${text}`);

                let item = text.split(' ');

                let action = item[0];
                let names = item[1];

                // let types;
                // let texts;

                let results;

                switch (action) {
                    case 'age' :
                        MongoClient.connect(dbUrl, (err, client) => {
                            assert.equal(null, err);
                            var db = client.db(dbName);
                            const collection = db.collection('users');
                            collection.find({ name : names }).toArray((err, result) => {
                                if (err) {
                                    console.log(err);
                                    client.close();
                                }

                                if (result == '') {

                                    const messageResponse = [
                                        {
                                            type: 'text',
                                            text: 'ใครหว่า ไม่รู้จักง่า'
                                        },
                                        {
                                            type: "sticker",
                                            packageId: "11537",
                                            stickerId: "52002758"
                                        }
                                    ];
                                    replyMessage(replyToken, messageResponse);

                                } else {
                                    console.log(result);
                                    results = result[0].age;
                                    console.log('------------------------------------------------------');

                                    const messageResponse = [{
                                        type: 'text',
                                        text: results + 'ขวบจ้า'
                                    }];
                                    replyMessage(replyToken, messageResponse);
                                }
                            });
                        });

                        break;
                    case 'facebook':
                        
                        break;
                    default:
                        break;
                }

                // const messageResponse = [
                //     {
                //         type: types,
                //         text: texts
                //     }
                //     // {
                //     //     type: "sticker",
                //     //     packageId: "11537",
                //     //     stickerId: "52002758"
                //     // }
                // ];

                //replyMessage(replyToken, messageResponse);
                
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
        status: 'ok'
    };

    res.send(respone);
})

// Method reply message
const replyMessage = (replyToken, message) => {
    console.log('==> [replyMessage]');
    console.log(`replayToken: ${replyToken}`);
    console.log(`message : `);
    console.log(message);

    client.replyMessage(replyToken, message)
        .then(() => {
            console.log(`replyMessage is successfully`);
        })
        .catch((err) => {
            console.log(`${err}`);
        });
}

app.listen(port, () => {
    console.log(`run on port : ${port}`);
})