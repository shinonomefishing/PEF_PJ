const maria = require('mysql');

const conn = maria.createConnection({
    host : 'svc.sel5.cloudtype.app',
    port : 31606,
    user : 'root',
    password : 'aa156354',
    database : 'pef'
});

conn.connect(function(err){
    if(err) throw err;
    console.log("connected");
});

module.exports = conn;