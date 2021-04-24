var fs= require('fs');

fs.rename('r1.txt','r2.txt', function (err) {
  if (err) throw err;
  console.log('File renamed!');
});