const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;

const line = require('@line/bot-sdk');
const client = new line.Client({
    channelAccessToken: '4bpYw3g3xJCxM1aURCIilx/NGBcInRFHjUhFXZy3Jl4KvnRrpZkUoJgwc4kAjuyCrcWhFHyKdHbMAbWHh4OYKU1C5l5ty00VxKtEzwpIp1/16i1RDwXD5WFdvd5wKWEV7JASy9HScLtLbqRTGob2NwdB04t89/1O/w1cDnyilFU='
});

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

                const messageResponse = [
                    {
                        type: 'text',
                        text: 'แบร่ แบร่'
                    },
                    {
                        type: "sticker",
                        packageId: "1",
                        stickerId: "1"
                    }
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