var fs = require('fs');

fs.open('mynewfile1.txt', 'w', function (err) {
  if (err) throw err;
  console.log('Saved!');
});
