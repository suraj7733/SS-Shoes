var mysql = require("mysql");
var conn = mysql.createConnection({
    host : "sql6.freemysqlhosting.net",
    user : "sql6413983",
    password : "8su1uHyWI6",
    database : "sql6413983"
});
conn.connect(function(err){
    if(err) throw err;
    console.log("connected !");
});

module.exports = conn;