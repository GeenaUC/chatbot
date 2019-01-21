const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;

const line = require('@line/bot-sdk');
const client = new line.Client({
    channelAccessToken: '4bpYw3g3xJCxM1aURCIilx/NGBcInRFHjUhFXZy3Jl4KvnRrpZkUoJgwc4kAjuyCrcWhFHyKdHbMAbWHh4OYKU1C5l5ty00VxKtEzwpIp1/16i1RDwXD5WFdvd5wKWEV7JASy9HScLtLbqRTGob2NwdB04t89/1O/w1cDnyilFU='
});

const mysql = require('mysql');
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password : '',
    database : 'chatbot'
})

conn.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('connect database success!');
    }
})

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req,res) => {
    res.send('Hello');
})

app.post('/webhook', (req,res) => {
    console.log('---- /webhook ----');
    let body = req.body;
    let events = body.events[0];
    let source = events.source;
    let message = events.message;
    let type = events.type;
    let replyToken = events.replyToken;

    console.log('Body ==>');
    console.log(body);
    console.log(`Source ==>`);
    console.log(source);
    console.log(`Message ==>`);
    console.log(message);
    console.log(`type ==>`);
    console.log(type);
    console.log(`replyToken ==>`);
    console.log(replyToken);

    switch (type) {
        case 'message' :
            let type = message.type;
            console.log(`[message type] => ${type}`);

            let id = message.id;
            
            if (type == 'text') {
                let text = message.text;

                console.log(`received text : ${text}`);

                let query = conn.query(`select * from reply`,(err, result) => {
                    if (err) {
                        console.log('error : ');
                        console.log(err);
                    };
                    console.log(`result ==>`);
                    console.log(result);
                });

                //console.log(query.sql);

                // const messageResponse = [
                //     {
                //         type: 'text',
                //         text: 'แบร่ แบร่'
                //     },
                //     {
                //         type: "sticker",
                //         packageId: "11537",
                //         stickerId: "52002758"
                //     }
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