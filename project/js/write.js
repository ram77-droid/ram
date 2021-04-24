var fs = require('fs');
var h= require('http');
fs.writeFile('mynewfile1.txt', 'this the content \n', function (err) {
  if (err) throw err;
  console.log('Saved!');
 });
h.createServer(function(req,res){
fs.readFile('mynewfile1.txt', function(err, data) {
      res.write(data);
    return res.end();
 });
}).listen(3332);