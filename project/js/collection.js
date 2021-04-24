var e= require('./db1.js');
var express = require('express');   
var app = express();
var mongoose = require('mongoose');
var body_parser = require('body-parser');
app.use(body_parser.json());
const {Schema}  = mongoose;

// user1 schema
    var user1_schema= new Schema({
        devicetoken:  String,
        devicename:  String,
        username:  String,
        fullname:String,
        email: String,
       password: String,
        location:{
            type: { type: String },
            coordinates: { type: []}            
        },
            lat:{
            type: Number,  
            default:0           
               },

        long:{
            type: Number,
            default:0             
        }
    });
    
// post schema
    var post_schema= new Schema({
        user_id:{
            type:mongoose.Types.ObjectId,
            ref:"user1"
        },
        caption:String,
        image:String
    });

    // comment schema
    var comment_schema= new Schema({
        user_id:{
                type:mongoose.Types.ObjectId,
                ref:"user1"
            },
            post_id:{
                type:mongoose.Types.ObjectId,
                ref:"posts"
            },
            comment:String
    });

    // like schema
    var like_schema= new Schema({
        user_id:{
                type:mongoose.Types.ObjectId,
                ref:"user1"
            },
            post_id:{
                type:mongoose.Types.ObjectId,
            ref:"posts"
            },
            like_status:Boolean,
            created_at:Date
    });

// cafe schema
    var cafe_schema= new Schema({
        location:{
            type: { type: String },
            coordinates: { type: []}            
        },
            lat:{
            type: Number,  
            default:0           
               },

        long:{
            type: Number,
            default:0             
        },
        name:String
    });

    user1_schema.index({location:'2dsphere'});
    var user = mongoose.model('user1',user1_schema);
    var post= mongoose.model('posts',post_schema);
    var comment= mongoose.model('comments',comment_schema);
    var like= mongoose.model('likes',like_schema);
    cafe_schema.index({location:'2dsphere'});
    var cafe= mongoose.model('cafes',cafe_schema);

    module.exports.user1=user;
    module.exports.post=post;
    module.exports.comment=comment;
  //  module.exports.cafe1=cafe;
    module.exports.like=like;
    module.exports.cafe=cafe;
   
   
   
    