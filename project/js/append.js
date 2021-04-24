var fs = require('fs');
var h= require('http');
fs.appendFile('mynewfile1.txt', 'heellllo', function (err) {
  if (err) throw err;
  console.log('Saved!');
 });
h.createServer(function(req,res){
fs.readFile('mynewfile1.txt', function(err, data) {
      res.write(data);
    return res.end();
 });
}).listen(2222);