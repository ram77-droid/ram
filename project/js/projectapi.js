
    var user = require('./projectcollection.js');
    var middleware = require('./middlewares/authorization');
    var middleware1 = require('./userauthorization.js');
    var express = require('express');   
    var app = express();
    var jwt = require('jsonwebtoken');
    var md = require('md5');
    var body_parser = require('body-parser');
    app.use(body_parser.json());
    var ejs = require('ejs');
    var valid= require('validator');



// var mail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

//  var pass = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,8}$/;

 var mail= /^[a-zA-Z0-9_\-]+[@][a-z]+[\.][a-z]{2,3}$/;
  var pass= /^[0-9]{4,6}$/;
   
  // signup API for the user
 //user1 collection and creating its token

   app.post('/signup',function(req,res){

    if(req.body.username==null || req.body.username=='')
    {
        return res.json({
         message:"invalid username.."   
        })
    }
   
   else if(valid.isEmpty(req.body.email)==true || req.body.email=='')
    {
        return res.json({
            message:"mail should not be empty"
        })
    }
    else if(valid.isEmail(req.body.email)==false)
    {
        return res.json({
         message:"invalid email.."   
        })
    }
   
    else if(req.body.password==null)
    {
        return res.json({
            message:"null password"
        })
    }

    else if(pass.test(req.body.password)==false)
    {
        return res.json({
            message:"invalid password"
        })
    }

     else
     {
         user.user1.findOne({
            $or: [
                { email :req.body.email },
                { password: req.body.password },
                {username:req.body.username}
              ]
         },function(err,result)
         {

            if(result)
            {
                return res.json({
                    message:"user name, password or email already exiists.."
                });
            }
            else
            {
                req.body.password=md(req.body.password);
                toke_obj={
                   location:{
                       type:"Point",
                       coordinates:[parseFloat(req.body.long),parseFloat(req.body.lat)]
                   },
                   lat:parseFloat(req.body.lat),
                   long:parseFloat(req.body.long),
                   devicetoken: req.body.devicetoken,
                   devicename: req.body.devicename,
                   username:req.body.username,
                   fullname:req.body.fullname,
                   name: req.body.name,
                   email: req.body.email,
                  password: req.body.password
                 
                          }
              
           // creating user1 collection
               user.user1.create(toke_obj,function(err,success){
                       console.log('sucess',success);
                       if(success)
                      {
                          //here token creation start
                           var toke={
                               _id:success._id,
                               lat:success.lat,
                               long: success.long,
                               location:success.location,
                               devicetoken: success.devicetoken,
                               devicename:  success.devicename,
                               username:success.username,
                               fullname:success.fullname,
                               name:  success.name,
                               email: success.email
           
                                };
               
                                jwt.sign(toke, 'ram',function(token_error,token_result){
                                   console.log(token_result);
                                   
                                   if(token_result)
                                   {
                                      // toke1.token = token_result;                    
                                       return res.json({
                                           data:toke,
                                           message:"created.."
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
                                        mesaage:err.message
                                    });
                                }
                      
               
                   });
             }
        
            }
         );
       
    

     }
    });

   // login API
 app.post('/login',function(req,res){

    //checking if the mail is in correct format
     if( req.body.username=='' || pass.test(req.body.password)==false)
     {
         return res.json({
             message:"invalid username or password"
         })
     } 

     else{
        token=req.headers.authorization.split(' ')[1];  
        var verify=jwt.verify(token,'ram');
        

        // coverting the password into encrypt password
        req.body.password=md(req.body.password);

        //finding the user by given token and verify it by the _id key
         user.user1.findOne({username:verify.username},function(err,success){
             console.log('username',success.username);
             console.log('success:',success);
          if(err)
          {
              return res.json({
                  message:err.message
              })
          }
          else
          {        
             //here success.password and email is a user password and email that he use for signup...
            //here we compare that within the request body
             if(req.body.password===success.password && req.body.username===success.username)
             {
                return res.json({
                    message:"login successful.."
                 });
             }
             else
             {
                 return res.json({
                     message:"password or username not matched"
                 })
             }
           
          }
         });
     }  
 });

 
 // cafe API
 app.post('/caf',function(req,res){

    toke_obj={
        location:{
            type:"Point",
            coordinates:[parseFloat(req.body.long),parseFloat(req.body.lat)]
        },
        lat:parseFloat(req.body.lat),
        long:parseFloat(req.body.long),
        name:req.body.name
      
    }
    user.cafe.create(toke_obj,function(err,success){
        console.log('sucess',success);
        if(success)
       {
          return res.json({
              data:success,
              message:"done"
          });
        } 
        else{
            return res.json({
                message:err.message
            });
        }        

 });
});
 

 // get API for user collection data
   app.get('/getuser',function(req,res){

    token=req.headers.authorization.split(' ')[1];  
    var verify=jwt.verify(token,'ram');
    user.user1.findOne({email:verify.email},function(err,result){
        if(err)
        {
            return res.json({
                message:"it's error"
            })
        }
        else
        {
           
           user.user1.aggregate([{
            $geoNear: {
                near: { type: "Point", coordinates: [parseFloat(verify.long),parseFloat(verify.lat)] },
                distanceField: "dist.calculated",
                maxDistance: 2,
                spherical: true
             }
           
        }
       ],function(err,result){
            if(result){
                return res.json({
                 data:result,
                 message:"ok aa"   
                });
            }
            else
            {
                return res.json({
                    message:err.message   
                   }); 
            }
        });
        }
    });

   
   });

   //get API for cafe
   app.get('/getcaf',function(req,res){

    token=req.headers.authorization.split(' ')[1];  
    var verify=jwt.verify(token,'ram');
    console.log(verify);

    user.cafe.aggregate([{
        $geoNear: {
            near: { type: "Point", coordinates: [parseFloat(verify.long),parseFloat(verify.lat)] },
            distanceField: "dist.calculated",
            maxDistance: 3*1000,
            spherical: true
         }
       
    }
   ],function(err,result){
        if(result){
            return res.json({
             data:result,
             message:"ok aa"   
            });
        }
        else
        {
            return res.json({
                message:err.message   
               }); 
        }
    });

   });

    const multer = require('multer');
    const path= require('path');
    app.use(express.static(__dirname));

    const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname+'/js');
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname+'-'+Date.now() + path.extname(file.originalname));
    }
    });
    const upload = multer({storage:storage});

    // image uploading in user collection
    app.post('/uploadimage',upload.any(),function(req,res){
        try{
    console.log(req.files);
            //console.log('req',req.files[0].filename);
    //console.log(req.body.email);

            user.user1.updateOne({email:req.body.email},{image:'/js/'+req.files[0].filename},function(err,ress){
                console.log('err',err);
                console.log('ress',ress);
            
              if(err)
                {
                return res.json({
                    message:"errorororr"
                });
                }
        else
         {
            user.user1.findOne({email:req.body.email},function(err,show){
                console.log(show);
                if(show)
                {
                    show.image = 'http://192.168.1.75:3000'+show.image;
                    return res.json({
                        data:show,
                        message:"profile picture updated"
                            });
                }
                
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