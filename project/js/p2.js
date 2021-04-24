var http = require('http');
var f = require('fs');

http.createServer(function (req, res) {
f.readFile('calculator.html',function(err,data){
res.write(data);
return res.end();
});  
}).listen(8080);