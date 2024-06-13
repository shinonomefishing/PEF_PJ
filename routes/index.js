const express = require('express');
const multer = require('multer');
const path = require('path');
//const mqtt = require('mqtt');
const maria = require('../database/maria');

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
    maria.query('select *, max(date_format(pef_dateTime, "%Y-%m-%d %T")) as date from pef_info group by pef_dvsn', function(err,result,fields){
        var datalist = [];
        for(var data of result){
            datalist.push(data);
        }
        maria.query('select * from t_pef_co', function(err,result2,fields){
            console.log(result2);
            res.render('index', { result: datalist, co_info: result2 });
        });
    });
});


router.get('/packet', (req, res) => {
    res.render('packet');
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

router.post('/update_corpname', (req, res) => {
    var corpname = req.body.corpname;
    var dvsn = req.body.device_number;
    var param = [dvsn,corpname];
    var sql = 'insert into t_pef_co (pef_dvsn, pef_corpname) values(?,?) on duplicate key update pef_dvsn=values(pef_dvsn), pef_corpname=values(pef_corpname)';
    maria.query(sql,param,function(err,rows,fields){
        if(err){
            console.log(err);
        }else{
            console.log(rows.insertId);
        }
        res.redirect('/');
    })
})

module.exports = router;