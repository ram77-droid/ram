var express = require('express');   
 var app = express();
 var body_parser = require('body-parser');
 app.use(body_parser.json());
 var ejs = require('ejs');


 app.get('/getuser', function(req,res){     

    ejs.renderFile('./middlewares/webpage.ejs', {}, 
       {}, function (err, template) {
       if (err) {
           throw err;
       } else {
           res.end(template);
       }
   });
});
app.listen('3000', function(){
    console.log('Server listening on port 3000');
});