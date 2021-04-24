var v= require('./projectdatabase.js');
    var express = require('express');   
    var app = express();
    var mongoose = require('mongoose');
    var body_parser = require('body-parser');
    app.use(body_parser.json());
    const {Schema}  = mongoose;

    var user_schema= new Schema({
       username:{type:String, unique:true},
       fullname:String,
       email:{type:String, unique:true},
       password:{type:String, unique:true},
       device_token:String,
       token:String
     });
     var post_schema= new Schema({
      user_id:{
          type:mongoose.Types.ObjectId,
          ref:"users"
      },
      caption:String,
      image:String
     });

     var comment_schema= new Schema({
      user_id:{
              type:mongoose.Types.ObjectId,
              ref:"users"
          },
          post_id:{
              type:mongoose.Types.ObjectId,
              ref:"posts"
          },
          comment:String
        });

  var like_schema= new Schema({
   user_id:{
           type:mongoose.Types.ObjectId,
           ref:"users"
       },
       post_id:{
           type:mongoose.Types.ObjectId,
       ref:"posts"
       },
       like_status:Boolean,
       created_at:Date
      });

    var users = mongoose.model('users',user_schema);
    module.exports.users=users;

    var posts= mongoose.model('posts',post_schema);
    module.exports.posts=posts;

    var comment= mongoose.model('comments',comment_schema);
    module.exports.comment=comment;

    var like= mongoose.model('likes',like_schema);
    module.exports.like=like;