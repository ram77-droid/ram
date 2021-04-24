    var e= require('./db.js');
    var express = require('express');   
    var app = express();
    var mongoose = require('mongoose');
    var body_parser = require('body-parser');
    app.use(body_parser.json());
    const {Schema}  = mongoose;

    var waveschema= new Schema({
        mobilenumber:Number,
        otp:Number,
       email:String,
       password:String,
       name:String,
       dob:Date,
       gender:String,
       image:String,
       bio:String,
       work:String,
       education:String,
       token:Array
          
      
       
    });
    var settingschema= new Schema({
        user_id:{
            type:mongoose.Types.ObjectId,
            ref:"users"
        },
        distance:String,
        age:{ 
            min: Number, 
            max: Number 
         },
        notification:{
            newmatch:String,
            message:String,
            waves:String
        }
    });

    var wave = mongoose.model('users',waveschema);
    var sett= mongoose.model('setting',settingschema);
    module.exports.wave=wave;
    module.exports.sett=sett;
    