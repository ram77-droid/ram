    var wav= require('./wavecollection.js');
    var express = require('express');   
    var app = express();
    var md = require('md5');
    var body_parser = require('body-parser');
    app.use(body_parser.json());
    var jwt = require('jsonwebtoken');
    var otpgen= require('otp-generator');

      // signup API
    app.post('/signup',function(req,res){
        function addDays(date) {
            var result = new Date(date);
            result.setDate(result.getDate() + 1);
            return result;
          }
          var add = addDays(req.body.dob);

        var mail= /^[a-zA-Z0-9_\-]+[@][a-z]+[\.][a-z]{2,3}$/;
        var pass= /^[0-9]{4,6}$/;
   
        var phone=/^[89][0-9]{9}$/;
        if(phone.test(req.body.mobilenumber)==false)
        {
            return res.json({
                message:"enter valid number."
            });
        }
        else if(mail.test(req.body.email)==false || req.body.email==' '|| req.body.email==null)
        {
            return res.json({
                message:"enter valid email."
            });
        }
        else if(pass.test(req.body.password)==false || req.body.password==' '|| req.body.password==null)
        {
            return res.json({
                message:"enter valid password."
            });
        }
        else
        {
            req.body.password=md(req.body.password);

            wav.wave.findOne({
                $or: [
                    { email :req.body.email },
                    { password: req.body.password },
                    {mobilenumber:req.body.mobilenumber}
                    
                  ]
            },function(err,result){
                if(result)
                {
                    return res.json({
                        message:"email or password or mobilenumber already exists.."
                    });
                }
                else
                {
                    obj={
                        mobilenumber:req.body.mobilenumber,
                        otp:otpgen.generate(4,{ digits:true, alphabets:false, upperCase: false, specialChars: false }),
                        email:req.body.email,
                        password:req.body.password,
                        name:req.body.name,
                        gender:req.body.gender,
                        dob:add
                       
                       
                    }
                  
                    wav.wave.create(obj,function(err,success){
                        if(err)
                        {
                            return res.json({
                                message:err.message
                            });
                        }
                        else if(success)
                        {
                           
                            return res.json({
                                message:"sign up successful!!"
                            });
                        }
                        else
                        {
                            return res.json({
                                message:"something went wrong"
                            });
                        }
                    });
        
                }
            })
            

        }
      
    });

    // login API
    app.post('/login',function(req,res){
        wav.wave.findOne({email:req.body.email},function(err,success){
            console.log("success",success);
            
            if(success && success!=null)
            {
                toke_obj={
                    email:req.body.email,
                    password:req.body.password
                }
                jwt.sign(toke_obj,'ram',function(toke_error,toke_result)
                {
                    if(toke_error)
                    {
                        return res.json({
                            message:err.message
                        });
                    }
                    else if(toke_result)
                    {
                        console.log('token:',toke_result);
                      //  wav.wave.updateOne({email:req.body.email},{token:toke_result},function(err,success1){

                      if(req.body.device_token)
                      {
                          wav.wave.find({ token: { $elemMatch: { "device_token": req.body.device_token } } }, function(find_error, find_success){
                                console.log('error', find_error);
                                console.log('success', find_success);
                                if(find_success && find_success.length == 0)
                                {
                                    wav.wave.updateOne({email:req.body.email},
                                        {
                                            $push:{
                                                "token":{
                                                    "device_token":req.body.device_token,
                                                    "auth_token":toke_result
                                                }
                                            }
                                        },function(err,success1){  
                                
                                        if(err)
                                        {
                                            return res.json({
                                                message:err.message
                                            });
                                        }
                                        else if(success1)
                                        {
                                        
                                            return res.json({
                                                message:"login successful!!"
                                            });
                                        }
                                        else
                                        {
                                            return res.json({
                                                message:"errore"
                                            });
                                        }
                                    });
                                }else{
                                    return res.json({
                                        message:"login successful!!"
                                    });
                                }
                          });
                      }
                      else
                      {
                        return res.json({
                            message:"Please send device token"
                        });
                      }  
                       
                    }
                    else
                    {
                        return res.json({
                            message:"login failed.something went wrong!!"
                        });

                    }

                });
               
               
            }
            else if(err)
            {
                return res.json({
                    message:err.message
                });
            }
            else
            {
                return res.json({
                    message:"email and password doesn't match."
                });
            }
        });
    });  

    // logout API
    app.get('/logout',function(req,res){
        token=req.headers.authorization.split(' ')[1];
        console.log('token :',token);
        var vary=jwt.verify(token,'ram');
        wav.wave.findOne({email:vary.email},function(err,result){
            if(err)
            {
                return res.json({
                    message:err.message
                });

            }
            else if(result)
            {
                console.log('result is:',result);
                console.log('device token:',result.token[0]);
                wav.wave.updateOne({email:result.email}, {
                    $pull:{
                        "token":[0]
                    }
                },function(err,result){
                if(err)
                {
                    return res.json({
                        message:err.message
                    });
                }
                else if(result)
                {
                    console.log('data:',result);
                    return res.json({
                        message:"you logged out"
                    });
                }
                 });

            }
            else
            {
                return res.json({
                    message:"error"
                });
            }
        });
      
      
       

    });

    const multer = require('multer');
    const path= require('path');
    app.use(express.static(__dirname));
   
    const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname+'/js1');
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname+'-'+Date.now() + path.extname(file.originalname));
    }
    });
    const upload = multer({storage:storage});
    
    //updating picture
   app.post('/updateprofile',upload.any(),function(req,res){

    token=req.headers.authorization.split(' ')[1];
    var vary=jwt.verify(token,'ram');

    wav.wave.findOne({email:vary.email},function(err,result){
        if(err)
        {
            return res.json({
                message:err.message
            });

        }
        else if(result)
        {
            // verifying that the token is in header is equal to stored token or nots
            if(token===result.token)
            {
         wav.wave.updateOne({email:result.email},{image:'http://192.168.1.75:3000/js1/'+req.files[0].filename},function(err,result1){
                if(err)
                {
                    return res.json({
                        message:err.message
                    });
                }
                else if(result1)
                {
                    return res.json({
                        message:"profile updatedd.."
                    });
                }
                else
                {
                    return res.json({
                        message:"error occur"
                    });
                }

                 });


            }
            else
            {
               return res.json({
                   message:"token expired."
               });
            }
        }
        else
        {
            return res.json({
                message:"nothing!!!"
            });

        }
    });


    });

    //delete account API
    app.get('/delete',function(req,res){
        token=req.headers.authorization.split(' ')[1];
        var vary=jwt.verify(token,'ram');
        wav.wave.deleteOne({email:vary.email},function(err,result){
            if(err)
            {
                return res.json({
                    message:err.mesage
                });
            }
            else
            {
                return res.json({
                    message:"account deleted.."
                });
            }
        });

    })

    //updating or editing profile
    app.post('/edit',function(req,res){
        token=req.headers.authorization.split(' ')[1];
        var vary=jwt.verify(token,'ram');

        wav.wave.findOne({email:vary.email},function(err,result){
            if(err)
            {
                return res.json({
                    message:err.message
                });

            }
            else if(result)
            {
                if(token===result.token)
                {
             wav.wave.updateOne({email:result.email},{bio:req.body.bio,work:req.body.work,education:req.body.education},function(err,result1){
                    if(err)
                    {
                        return res.json({
                            message:err.message
                        });
                    }
                    else if(result1)
                    {
                        return res.json({
                            message:"profile updatedd.."
                        });
                    }
                    else
                    {
                        return res.json({
                            message:"error occur"
                        });
                    }

                     });


                }
                else
                {
                   return res.json({
                       message:"token expired."
                   });
                }
            }
            else
            {
                return res.json({
                    message:"nothing!!!"
                });

            }
        });

      
    });

    //view profile API
    app.get('/viewprofile',function(req,res){
        token=req.headers.authorization.split(' ')[1];
        var vary=jwt.verify(token,'ram');
        wav.wave.findOne({email:vary.email},function(err,reslut){
            if(reslut)
            {
                return res.json({
                    dat:reslut
                });
            }
            else if(err)
            {
                return res.json({
                    message:err.message
                });
            }
            else
            {
                return res.json({
                    message:"err message"
                });
            }
        });
    });

 // profile settings API
    app.post('/setting',function(req,res){
        wav.sett.create(req.body,function(err,success){
            if(err)
            {
                return res.json({
                    message:err.message
                });
            }
            else if(success)
            {
                return res.json({
                    data:success,
                    message:"setting created."
                });
            }
            else
            {
                return res.json({
                   message:"error"
                });
            }
        });
    });

    //get setting AAPI
    app.get('/getsetting',function(req,res){
        wav.sett.aggregate([{
            $lookup:
            {
                from: "users",
              localField: "user_id",
              foreignField: "_id",
              as: "usersetting"
            }
        },
    {
        $unwind:"$usersetting"
    }

       ],function(err,result){
           if(err)
           {
               return res.json({
                   message:err.message
               });
           }
           else
           {
               return res.json({
                   data:result,
                   message:"done!!"
               });
           }
       });
    });


    app.listen('3000', function(){
        console.log('Server listening on port 3000');
      });