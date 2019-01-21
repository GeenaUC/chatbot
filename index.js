const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;

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
    console.log('==> Body');
    console.log(body);
    console.log(`Source ==> ${source}`);
    console.log(`Message ==> ${message}`);

    let respone = {
        status: 'ok',
        body: body
    };
    console.log('===> Body');
    console.log(body);
    res.send(respone);
})

app.listen(port, () => {
    console.log(`run on port : ${port}`);
})