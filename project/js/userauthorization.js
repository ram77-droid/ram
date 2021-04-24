var express = require('express'); 
var user = require('./projectcollection.js');
 var app = express();
 var body_parser = require('body-parser');
 app.use(body_parser.json());
 var jwt = require('jsonwebtoken');
module.exports.isLogin = function isLogin(req, res, next) {
    if (req.headers.authorization)
     {
        var token=req.headers.authorization.split(' ')[1];
        var verify=jwt.verify(token,'ram');
        user.user1.findOne({email:verify.email},function(err,result){
          if(err)
          {
            return res.json({
              message:"email not found.."
            });
          }
          else
          {
           next();
          }
        });
      
     } 
    else {
      // return unauthorized
      res.status(200).json({
            message:'unauthorization'
           
      });
    }
  };