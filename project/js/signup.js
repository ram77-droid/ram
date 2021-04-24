var e= require('./db1.js');
var express = require('express');   
var app = express();
var md = require('md5');
var body_parser = require('body-parser');
var mongoose = require('mongoose');
const {Schema}  = mongoose;
app.use(body_parser.json());
var jwt = require('jsonwebtoken');
var aa = mongoose.model('users', new Schema(
    { 
        username: {type:String},
        fullname: {type:String},
        email:{type:String},
        password:{type:String}
       
    }));
    var mail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    var pass = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,8}$/;
   
   
    //signup API
    app.post('/signup',function(req,res)
    {
        if(mail.test(req.body.email)==false)
        {
            return res.json({
             message:"invalid email.."   
            })
        }
        else if(pass.test(req.body.password)==false)
        {
            return res.json({
                message:"invalid password.."
            })
        }
        
      else
       {
        
         aa.findOne( {
            $or: [
                   { email :req.body.email },
                   { password: req.body.password }
                 ]
           },function(error,result)
           {
              if(result)
              {
                  return res.json({
                      message:"already exists.."
                  })
              }
              else 
              { 
                req.body.password=md(req.body.password);
                aa.create(req.body,function(error,success){
                   // console.log(success);
                    if(error)
                    {
                        return res.json({
                          message:"sign up unsuccessful.."  
                        })
                    }
                    if(success)
                    {
                        var us={
                            _id:success._id,
                            // username:success.username,
                            // fullname:success.fullname,
                            email:success.email
                            //password:success.password

                        };
                        jwt.sign(us, 'ram',function(token_err,token_result){
                            console.log(trest);
                            if(trest)
                            {
                                var us1={
                                    _id:success._id,
                                     username:success.username,
                                     fullname:success.fullname,
                                    email:success.email,
                                    password:success.password,
                                    token:trest

                                };
                                console.log('successful');
                                return res.json({
                                    data:us1,
                                    message:"signup successful..."
                                });
                            }
                            else{
                                console.log(terr);
                            }
                        });
                        // return res.json({
                        //     message:"successful.."
                        // })
                    }
                })
              }
            }

            );
        
        }
       
    });

    //get API
    app.get('/signup',function(req,res){
      token=req.headers.authorization.split(' ')[1];  
      var r=jwt.verify(token,'ram');
      aa.findOne({email:r.email},function(err,suc){
          if(suc)
          {
              console.log("done");
              return res.json({
                  data:suc,
                  message:"ramram.."
              })
          }
          else
          {
              console.log(err);
          }
      })
    });

     //login API
  app.post('/login',function(req,res)
  {
    if(mail.test(req.body.email)==false)
    {
     return res.json({
         message:"enter valid email"
     });  
    }
     // req.body.password=md(req.body.password);
     aa.findOne({email:req.body.email},function(error,result)
    {
        try{
            console.log('result',result);
      if(result)
        {
            var uss={
                _id:result._id,
                username:result.username,
                fullname:result.fullname,
                email:result.email
                //password:success.password

            };
            jwt.sign(uss, 'ram',function(terr1,trest1){
                console.log(trest1);
                
                if(trest1)
                {
                    uss.token = trest1;                    
                    return res.json({
                        data:uss,
                        message:"login successful..."
                    });                                       
                }
                else{
                    console.log("error");
                }
            });
        }  

      else 
        {
          return res.json({
          mesage:"unable to login..data is not existed.."
           });
        }

    }catch(error)
    {
        console.log('error',error);
    }
    });
   

 });

 // multer is required for dealing with files or images
 const multer = require('multer');
 const path= require('path');
 const storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, '/js');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname+'-'+Date.now() + path.extname(file.originalname));
  }
 });
const upload = multer({storage:storage});


   //upload API
   app.post('/upload',upload.any(),function(req,res){
    try{
console.log(req.files);
        //console.log('req',req.files[0].filename);
//console.log(req.body.email);
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



// change password API
app.post('/change',function(req,res){

 //requiring and verifying the token

    token=req.headers.authorization.split(' ')[1];  
    var r=jwt.verify(token,'ram');
    // finding ud matching with token id in database
    aa.findOne({_id:r._id},function(err,suc){
          if(suc)
          {
            //   console.log("done");
            //   return res.json({
            //       data:suc,
            //       message:"ramram.."
            //   });
           
            // encrypting password
            req.body.password=md(req.body.password);
            console.log(req.body.password);
            console.log(suc.password);
            // comparing encrypted password 
            if(req.body.password===suc.password)
            {
              
              if(req.body.newpassword===req.body.confirmpassword)
              {
                  //encrypting confim password
                  req.body.confirmpassword=md(req.body.confirmpassword);
                  // update the old password with confirm password
                  aa.updateOne({password:req.body.password},{password:req.body.confirmpassword},function(err,re){
                      if(err)
                      {
                          return res.json({
                              message:"something is wrong"
                          });
                      }
                      else{
                          return res.json({
                              message:"password updated.."
                          })
                      }
                  })
              }
              else{
                  console.log("password not matching..");
              }

            }
            else{
                console.log("not matched");
            }
          }
          else
          {
              console.log(err);
          }
      })

})

    app.listen('3000', function(){
        console.log('Server listening on port 3000');
    });