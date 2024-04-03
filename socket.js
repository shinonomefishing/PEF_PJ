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
    console.log(pef_message);
  });*/

module.exports = (server) => {
    const wss = new WebSocket.Server({server});

    var i = 0;
    var uwbmessage = 0;

    wss.on('connection', (ws, req) => {
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        console.log('새로운 클라이언트 접속', ip);
        ws.on('message', (message) => {
            console.log(message.toString());
            uwbmessage = message.toString();
        });
        ws.on('error', (error) => {
            console.error(error);
        });
        ws.on('close', () => {
            console.log('클라이언트 접속 해제', ip);
            clearInterval(ws.interval);
        });

        client.on("message", (topic, message) => {
            count = count + 1;
            pef_message = count + "|" + message.toString();
            if(ws.readyState === ws.OPEN){
                ws.send(pef_message);
            }
        })
        /*const interval = setInterval(() => {
            if (ws.readyState === ws.OPEN){
                if(mqtt_connect === true){
                    ws.send(pef_message);
                }
                mqtt_connect = false;
            }
        }, 1000);
        ws.interval = interval;*/
    });
};