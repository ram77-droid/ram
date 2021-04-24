var e= require('./db1.js');
var express = require('express');   
var app = express();
var md = require('md5');
var body_parser = require('body-parser');
var mongoose = require('mongoose');
const {Schema}  = mongoose;
app.use(body_parser.json());
var aa = mongoose.model('users', new Schema(
    { 
        username: {type:String,required:true},
        fullname: {type:String,required:true},
        email:{type:String,required:true},
        password:{type:String,required:true},
        profile:{type:String}
    }
    )
    );

    var mail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    var pass = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,8}$/;
    //register API
app.post('/register', function(request, response){
  
   if(typeof(request.body.username)!='string')
   {
    return response.json({
        message:"username must be valid"
    }); 
   }
  
   if(mail.test(request.body.email)==false)
   {
    return response.json({
        message:"enter valid email"
    });  
   }
    //comparing password is in valid format
   else if(pass.test(request.body.password)==false)
   {
    return response.json({
        message:"enter valid password..it should be of length 6 containing uper and lowercase,special character and numeric"
    });  
   }
   else{
       //finding is email or password pre exists?
   aa.findOne( {
    $or: [
           { email :request.body.email },
           { password: request.body.password }
         ]
  },function(err,result){
        if(result)
        {
            return response.json({
                message:"already exists"
            });
        }
        else
        {
            request.body.password=md(request.body.password);
            // creating
                 aa.create(request.body,function(error,success)    
                 {
                     if(error)
                     {
                     return response.json({
                         message:"unsuccessful"
                     });
                     }
             
                     if(success)
                     {
                         return response.json({
                             message:"successful"
                         });
                     }
                 });
        }
    });

        
    
   }


 } 
 );

    //login API
//   app.post('/login',function(req,res)
//   {
//     if(mail.test(req.body.email)==false)
//     {
//      return res.json({
//          message:"enter valid email"
//      });  
//     }
//       req.body.password=md(req.body.password);
// aa.findOne({email:req.body.email,password:req.body.password},function(error,result)
// {
//   if(result)
//   {
//       return res.json({
//           mesage:"login successful.."
//       });
//   }  
//   else{
//     return res.json({
//         mesage:"unable to login..data is not existed.."
//     });
//   }
// });
//   });
//for uploading pictures
const multer = require('multer');
const path= require('path');
const storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, './js');
  },
  filename: function (req, file, callback) {
      console.log(file);
    callback(null, file.fieldname+'-'+Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({storage:storage});
//app.use();
//console.log(upload);

//upload API
app.post('/upload',upload.any(),function(req,res){
    try{
console.log(req.files);
        //console.log('req',req.files[0].filename);
console.log(req.body.email);
        aa.updateOne({email:req.body.email},{profile:req.files[0].path},function(err,ress){
             console.log(err);
            console.log(ress);
            
        if(err)
        {
            console.log(err);
        }
        else
            {
                  return res.json({
                message:"profile picture updated"
                   });
            }
        });

        

    }catch(error)
    {

        return res.json({
            message:error.message
        });
    }
});
app.listen('3000', function(){
    console.log('Server listening on port 3000');
});
