const WebSocket = require('ws');
const mqtt = require('mqtt');
const option = {
    host: '121.182.245.200',
    port: 1883,
    username: 'admin',
    password: 'zhfjtld',
    protocol: 'mqtt',
}

const client = mqtt.connect(option); 

const maria = require('./database/maria');

// maria.query('insert into pef_info values(05,03,03,64,01,00,00,01,04,00,00,00,00,00)', function(err, rows, fields){
//     if(err){
//         console.log(err);
//     }else{
//         console.log(rows.pef_dvsn);
//     }
// })

const topic = "pef";

var mqtt_connect = false;

var pef_message;
var count = 0;

client.on("connect", () => {
    console.log("connected" + client.connected);
    client.subscribe(topic,()=>{
        console.log(`Subscribe to topic '${topic}'`)
    })
})

client.on("error", (error) => {
    console.log("can not connet" + error);
})

  /*client.on("message", (topic, message) => {
    // message is Buffer
    count = count + 1; 
    pef_message = count + "|" + message.toString();
    mqtt_connect = true;
    //console.log(pef_message);
  });*/

module.exports = (server) => {
    const wss = new WebSocket.Server({server});

    var i = 0;
    var uwbmessage = 0;
    var insert_query = 'insert into pef_info values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    var parameter;
    wss.on('connection', (ws, req) => {
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        console.log('새로운 클라이언트 접속', ip);
        ws.on('message', (message) => {
            console.log(message.toString());
            uwbmessage = message.toString();
            if(message == "aa"){
                count = 0;
            }
            if(message == "insert"){
                maria.query('insert into pef_info values(NULL,23,03,64,01,00,00,01,04,00,00,00,00,00,default)', function(err, rows, fields){
                    if(err){
                        console.log(err);
                    }else{
                        console.log(rows.pef_dvsn);
                    }
                });
            }
        });
        ws.on('error', (error) => {
            console.error(error);
        });
        ws.on('close', () => {
            console.log('클라이언트 접속 해제', ip);
            //clearInterval(ws.interval);
        });

        client.on("message", (topic, message) => {
            count = count + 1;
            if(ws.readyState === ws.OPEN){ 
                var pef_data = message.toString();
                pef_message = count + "|" + pef_data;
                var sp_data = pef_data.split(',');
                ws.send(pef_message);
                console.log(pef_message);
                var dvsn = parseInt(sp_data[2],16);
                var command = parseInt(sp_data[4],16);
                var changevalue = parseInt(sp_data[5],16);
                var pulseon = parseInt(sp_data[6],16);
                var setfrq = parseInt(sp_data[7],16);
                var setpulsetime = parseInt(sp_data[8],16);
                var setpulseoff = parseInt(sp_data[9],16);
                var pulsemoni = parseInt(sp_data[10],16);
                var hvon = parseInt(sp_data[11],16);
                var setvolt = parseInt(sp_data[12],16);
                var hvmoni = parseInt(sp_data[13],16);
                var opensense = parseInt(sp_data[14],16);
                var power = parseInt(sp_data[15],16);
                parameter = [null,dvsn,command,changevalue,pulseon,setfrq,setpulsetime,setpulseoff,pulsemoni,hvon,setvolt,hvmoni,opensense,power,'2024-06-13'];
                maria.query(insert_query,parameter,function(err,rows,fields){
                    if(err){
                        console.log(err);
                    }else{
                        console.log(rows.insertId);
                    }
                });
            }
        })
        /*const interval = setInterval(() => {
            if (ws.readyState === ws.OPEN){
                if(mqtt_connect === true){
                    ws.send(pef_message);
                    console.log(pef_message);
                }
                mqtt_connect = false;
            }
        }, 1000);
        ws.interval = interval;*/
    });
};