var express = require('express');   
var body_parser = require('body-parser')
var app = express();
app.use(body_parser.json());

app.get('/register', function(request, response){
    console.log('request', request);
    return response.json({
       // 'sucess':true,
       // status:200,
        message:'Registered!'
    })
});


app.listen('8080', function(){
    console.log('Server listening on port 3000');
});

