
 var user = require('./collection.js');
 var express = require('express');   
 var app = express();
 var jwt = require('jsonwebtoken');
 var md = require('md5');
 var body_parser = require('body-parser');
 app.use(body_parser.json());
//module.exports=app;
// console.log('__dirname',__dirname);

//user1 collection and creating its token

var mail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

 var pass = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,8}$/;
   
// sign up API for the user
   app.post('/user',function(req,res){

    if(mail.test(req.body.email)==false)
    {
        return res.json({
         message:"invalid email.."   
        })
    }
    else if(pass.test(req.body.password)==false)
    {
        return res.json({
            message:"invalid password"
        })
    }
       req.body.password=md( req.body.password);
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
                   
    
           // password: success.password
                     };
    
                     jwt.sign(toke, 'ram',function(token_error,token_result){
                        console.log(token_result);
                        
                        if(token_result)
                        {
                            toke1.token = token_result;                    
                            return res.json({
                                data:toke1,
                                message:"created.."
                            });                                       
                        }
                        else{
                            console.log("error");
                        }
                    });
    
     
                return res.json({
                    message:" created.."
                });
            }
           
    
        });

   });
 
   // cafe collection API
   app.post('/cafe',function(req,res){
       cafe_obj={
           name:req.body.name,
           location:{
               type:"Point",
               coordinates:[parseFloat(req.body.long),parseFloat(req.body.lat)]
           },
           lat:parseFloat(req.body.lat),
           long:parseFloat(req.body.long)
       }
      user.cafe.create(cafe_obj,function(err,suc){
        if(suc)

        {
            return res.json({
                data:suc,
                message:"alright.."

            });
        }
        else
        {
            return res.json({
                message:err.message
            })
        }
    })
   });
   //post collection API containing user_id of user1 collection
   app.post('/postuser',function(request,response){
    token=request.headers.authorization.split(' ')[1];  
    var r=jwt.verify(token,'ram');
    console.log(r);

    var post_obj = {
        user_id:r._id,
        caption:request.body.caption
    }
    console.log(post_obj);
    user.post.create(post_obj,function(err,result){
        if(result){
            return response.json({
                message:"operation done..!"
            });
        }
        if(err)
        {
            return response.json({
                message:err
            });
        }
    });

       
});
   
//comment collection API
app.post('/comment',function(request,response){
    token=request.headers.authorization.split(' ')[1];  
    var r=jwt.verify(token,'ram');
    console.log(r);
    var post_obj = {
        user_id:r._id,
        post_id:request.body.post_id,
        comment:request.body.comment
    }
    user.comment.create(post_obj,function(err,result){
        if(result){
            return response.json({
                message:"commented..!"
            });
        }
        if(err)
        {
            return response.json({
                message:err
            });
        }
    });
});

 //like collection  API
 app.post('/like',function(request,response){
    token=request.headers.authorization.split(' ')[1];  
    var r=jwt.verify(token,'ram');
    console.log(r);
    var post_obj = {
        user_id:r._id,
        post_id:request.body.post_id,
        like_status:request.body.like_status,
        created_at:Date.now()
        
    }
    user.like.create(post_obj,function(err,result){
        if(result){
            if(result.like_status==true)
            {
                return response.json({
                    message:"liked..!"
                });
            }
            else if(result.like_status==false)
            {
                return response.json({
                    message:"disliked..!"
                });
            }
            
        }
        if(err)
        {
            return response.json({
                message:err
            });
        }
    });
});


 // get post API
 app.get('/getpost',function(req,res){
     
     
    token=req.headers.authorization.split(' ')[1];  
    var r=jwt.verify(token,'ram');
    console.log(r._id);
    console.log(user);
    // user.find({user_id:r._id},function(err,suc){
    //     console.log('success',suc);
    //     if(suc)
    //     {       
            
    //         console.log("done");
    //         return res.json({
    //             data:suc,
    //             message:"ramram.."
    //         })
    //     }
    //     else
    //     {
    //         console.log('err',err);
    //     }
    // })
     
    user.post.aggregate([
    //     {
    //       $lookup:
    //         {
    //           from: "user1",
    //           localField: "user_id",
    //           foreignField: "_id",
    //           as: "ram"
    //         }
    //    },
    //    {
    //     $unwind:"$ram"
    //    },
    //    {
    //        $project:
    //        {
    //            caption:1,
    //            "ram.name" :1
    //        }
    //    },
      
   // group by something

    //   {
    //     $group:
    //     {
    //         _id:"$_id"
    //     }
 
    //    },

    // for sorting, 1 for ascending and -1 for descending
       { $sort : { _id : 1 } },

       // for setting limits of document...use limit
       {
           $limit:3
       },

       //set...for updating or inserting
       {
        $set: {
            totalHomework: { $sum: "_id" }
           }
       },

       //unset a set value
    //    {
    //        $unset:"totalHomework"
    //    },
        
       //addfield...for adding a new field in response
       {
           $addFields:
           {
               //ram:"$user_id"
               ram:"$_id",
               con:{
                $convert:
                {
                    input:"$caption",
                    to:"string"
                }
               } 
           }
       },

       //skip...for skipping the documents
      // { $skip : 1 }
   
    //   {
    //     $convert:
    //                 {
    //                     input:"$_id",
    //                     to:"string"
    //                 }
    //   },

       {
           $match:
           {
               caption:"wwwwww"
           }
       }
      
     ],function(err,result){
         if(err)
         {
             return res.json({
                 message:err.message
             });
         }
         if(result)
         {
             console.log('result is:',result);
             return res.json({
                 data:result,
                 message:"done!!"
             })
         }

     });
 });

  //get comment API

  app.get('/getcomment',function(req,res){
     
    token=req.headers.authorization.split(' ')[1];  
    var r=jwt.verify(token,'ram');
    //console.log(r._id);
    console.log(user);
    // user.find({post_id:req.query.post_id},function(err,suc){
    //     console.log('success',suc);
    //     if(suc)
    //     {
            
    //         console.log("done");
    //         return res.json({
    //             data:suc,
    //             message:"ramram.."
    //         })
    //     }
    //     else
    //     {
    //         console.log('err',err);
    //     }
    // })
    user.comment.aggregate([{
        $lookup:
        {
            from:"posts",
            localField:"post_id",
            foreignField:"_id",
            as:"comment_on_post"
        }
    }, {
        $unwind:"$comment_on_post"
       },
       {
           $project:
           {
               caption:1,
               "comment_on_post.name" :1
           }
       }],function(err,result){
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

 // get like API
 app.get('/getlike',function(req,res){
     
    token=req.headers.authorization.split(' ')[1];  
    var r=jwt.verify(token,'ram');
    //console.log(r._id);
    console.log(user);
    // bool=true;
    // user.find({user_id:r._id},function(err,suc){
    //     console.log('success',suc);
    //     if(suc)
    //     {
           
    //         console.log("done");
    //         return res.json({
    //             data:suc,
    //             message:"ramram.."
    //         })
    //     }
    //     else
    //     {
    //         console.log('err',err);
    //     }
    // })

    user.like.aggregate([{
        $lookup:
        {
            from:"posts",
            localField:"post_id",
            foreignField:"_id",
            as:"like on post"
        }
    }, 
       
    {
        $count: "likes"
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

 // get cafe API
 app.get('/getcafe',function(req,res){
    // token=req.headers.authorization.split(' ')[1];  
    // var r=jwt.verify(token,'ram');
   var a={};
    user.cafe.aggregate([{
        $geoNear: {
            near: { type: "Point", coordinates: [76.72211,30.67995] },
            distanceField: "dist.calculated",
           maxDistance:2,
            spherical: true
         }
       
    }
   ],function(err,result){
       console.log(result);
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

  // multer for uploadiing images

 const multer = require('multer');
 const path= require('path');
//const { parse } = require('node:path');
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

app.post('/upload',upload.any(),function(req,res){
    try{
console.log(req.files);
        //console.log('req',req.files[0].filename);
//console.log(req.body.email);

        user.post.updateOne({caption:req.body.caption},{image:'/js/'+req.files[0].filename},function(err,ress){
             console.log(err);
            console.log(ress);
            
            
        if(err)
        {
            console.log(err);
        }
        else
            {
                user.findOne({caption:req.body.caption},function(err,show){
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