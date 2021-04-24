    var user= require('./schemas.js');
    var express = require('express');   
    var app = express();
    var md = require('md5');
    var body_parser = require('body-parser');
    app.use(body_parser.json());
    var jwt = require('jsonwebtoken');
  //const { constant } = require('async');
  var midleware= require('./authorization.js');

    var mail= /^[a-zA-Z0-9_\-]+[@][a-z]+[\.][a-z]{2,3}$/;
    var pass= /^[0-9]{4,6}$/;

    // sign up API for users
    app.post('/signup',function(req,res){
           
        if(mail.test(req.body.email)==false || req.body.email==' '|| req.body.email==null)
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

            user.users.findOne({
                $or: [
                    { email :req.body.email },
                    { password: req.body.password }               
                ]
            },function(err,result){
                if(result)
                {
                    return res.json({
                        message:"email or password or already exists.."
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

                    user.users.create(req.body,function(err,result){
                        if(err)
                        {
                            return res.json({
                                message:err.message
                            });
                        }
                        else if(result)
                        {
                            return res.json({
                                message:"signup successful!!"
                            });
                        }
                    })
                

                }
            });
        }

    });

    // login API for users
    app.post('/login',function(req,res){

      if(pass.test(req.body.password)==false || req.body.password==' '|| req.body.password==null)
        {
            return res.json({
                message:"enter valid password."
            });
        }

        else
        {
            req.body.password=md(req.body.password);
            user.users.findOne({username:req.body.username},function(find_err,find_success){
                if(find_err)
                {
                    return res.json({
                        message:find_err.message
                    });
                }
                else if(find_success && find_success!=null)
                {
                    console.log('success:',find_success);
                    if(find_success.username===req.body.username && find_success.password===req.body.password)
                    {
                    obj={
                        _id:find_success._id,
                        username:find_success.username
                        }
                        jwt.sign(obj,'ram',function(err,success){
                            if(err)
                            {
                                return res.json({
                                    message:err.message
                                });
                            }
                            else if(success)
                            {
                            console.log('token:',success);
                            user.users.updateOne({_id:find_success._id},{device_token:req.body.device_token,token:success},
                            function(err,result){
                                if(err)
                                {
                                    return res.json({
                                        message:err.message
                                    });
                                }
                                if(result)
                                {
                                    return res.json({
                                        message:"login successful!!"
                                    });
                                }
                            })                              
                                                             
                            }
                        });
                       
                    }
                    else
                    {
                        return res.json({
                            message:"username or password doesn't match.."
                        });
                    }
                   
                }
                else
                {
                    return res.json({
                        message:"username or password doesn't match.."
                    });
                }
            });
        }

        
    });

    // logout API for users
    app.get('/logout',function(req,res){
        token1=req.headers.authorization.split(' ')[1];
        console.log('token :',token1);
        var vary=jwt.verify(token1,'ram');
        console.log("result:",vary);
        user.users.updateOne({_id:vary._id},{device_token:null,token:null},function(err,result){
            if(err)
            {
                return res.json({
                    message:err.message
                });
            }
            if(result)
            {
                return res.json({
                    message:"you are logged out"
                });
            }

        });
    });

    //forget password API
    app.post('/forgetpassword',function(req,res){
        user.users.findOne({email:req.body.email},function(err,success){
            if(err)
            {
                return res.json({
                    message:err.message
                });
            }
            if(success)
            {
                if(req.body.email===success.email)
                {
                    return res.json({
                        message:"email found"
                    });
                }
               
            }
            else
            {
                return res.json({
                    message:"email doesn't exists"
                });
            }
        });
    });

    // new password API
    app.post('/newpassword',function(req,res){
        user.users.findOne({email:req.body.email},function(err,success){
            if(err)
            {
                return res.json({
                    message:err.message
                });
            }
            if(success)
            {
                console.log('success:',success);
                if(req.body.email===success.email)
                {
                  req.body.password=md(req.body.password);
                  if(req.body.password===success.password)
                  {
                    req.body.newpassword=md(req.body.newpassword);
                      user.users.updateOne({email:req.body.email},{password:req.body.newpassword},function(err,result){
                          if(err)
                          {
                              return res.json({
                                  message:err.message
                              });
                          }
                          if(result)
                          {
                              return res.json({
                                  message:'paasword updated!!'
                              });
                          }
                      });
                    }
                    else
                    {
                        return res.json({
                            message:"old password is not matched"
                        });
                    }
                   
                }
                else
                {
                    return res.json({
                        message:"email not found"
                    });
                }
               
            }
            else
            {
              return res.json({
                  message:"email not found"
              });
            }
        });
        
    });

    // profile API
    app.get('/view',midleware.check,function(req,res){
        token=req.headers.authorization.split(' ')[1];
        var vary=jwt.verify(token,'ram');
        user.users.findOne({_id:vary._id},function(err,result){
            if(err)
            {
                return res.json({
                    message:err.message
                });
            }
            if(result)
            {
                obj={
                    username:result.username,
                    fullname:result.fullname,
                    email:result.email
                };
                return res.json({
                    data:obj,
                    message:"found"
                });
            }       
        });     
       
    });


    const multer= require('multer');
    const path= require('path');
    app.use(express.static(__dirname));
    console.log('dirname',__dirname);
    const storage= multer.diskStorage({
        destination: function(req,file,callback){
            callback(null,__dirname+'/pictures');
        },
        filename: function(req,file,callback){
            callback(null,file.fieldname+'-'+ Date.now()+ path.extname(file.originalname));
        }
    });
    const upload=multer({storage:storage});

    // post API for post collection
    app.post('/post',upload.any(),function(req,res){
        token=req.headers.authorization.split(' ')[1];
        var vary=jwt.verify(token,'ram');
        obj={
            user_id:vary._id,
            caption:req.body.caption,
            image:'http://192.168.1.75:3000/pictures/'+req.files[0].filename
        };
     user.posts.create(obj,function(err,result){
         if(err)
         {
             return res.json({
                 message:err.message
             });
         }
         else if(result)
         {
             return res.json({
                 data:result,
                 message:"post created!!"                
             });

         }
     });

    });

    // comment API for comment collection
    app.post('/comment',function(req,res){
        token=req.headers.authorization.split(' ')[1];
        var vary=jwt.verify(token,'ram');
        console.log("result:",vary);
        obj={
            user_id:vary._id,
            post_id:req.body.post_id,
            comment:req.body.comment
        }
        user.comment.create(obj,function(err,result){
            if(err)
            {
                return res.json({
                    message:err.message
                });
            }
            if(result)
            {
                return res.json({
                    message:"comment added."
                });
            }
        })
    });

    // like API for like collection
    app.post('/like',function(req,res){
        token=req.headers.authorization.split(' ')[1];
        var vary=jwt.verify(token,'ram');
        obj={
            user_id:vary._id,
            post_id:req.body.post_id,
            like_status:req.body.like_status,
            created_at:Date.now()
        }
        user.like.create(obj,function(err,result){
            if(err)
            {
                return res.json({
                    message:err.message
                });
            }
            if(result)
            {
                if(req.body.like_status===true)
                {
                    return res.json({
                        message:"liked!!"
                    });
                }
                else
                {
                    return res.json({
                        message:"disliked!!"
                    });
                }
               
            }
        })
    });


    app.listen('3000', function(){
        console.log('Server listening on port 3000');
    });