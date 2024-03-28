const express = require('express');
const multer = require('multer');
const path = require('path');
//const mqtt = require('mqtt');

const router = express.Router();

var map_name;
var xpos = new Array;
var ypos = new Array;
var xpos = [0,0,0,0,0,0];
var ypos = [0,0,0,0,0,0];

// const option = {
//     host: '121.182.245.200',
//     port: 1883,
//     username: 'admin',
//     password: 'zhfjtld',
//     protocol: 'mqtt',
// }

// const client = mqtt.connect(option);

// const topic = "pef";

// var pef_message;
// var count = 0;

// client.on("connect", () => {
//     console.log("connected" + client.connected);
//     client.subscribe(topic,()=>{
//         console.log(`Subscribe to topic '${topic}'`)
//     })
// })

// client.on("error", (error) => {
//     console.log("can not connet" + error);
// })

//   client.on("message", (topic, message) => {
//     // message is Buffer
//     pef_message = message.toString();
//     count = count + 1; 
//   });



router.get('/', (req, res) => {
    res.render('index');
    //console.log(map_name)
});

router.get('/view', (req, res) => {

});

router.get('/innerMap', (req, res) => {

    //console.log("map = " + map_name);
});



router.get('/files/:imageName', function(req, res){

});

//const upload = multer({dest: 'files/'})



router.post('/upload', (req, res) => {

});

router.post('/anchorpoint', (req, res) => {

});

module.exports = router;