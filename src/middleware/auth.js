const jwt = require('jsonwebtoken');
const Register = require('../model/collection')

//middleware for user authentication
const authenticate = async(req,res,next) =>{
      try {
           const token = req.cookies.jwt_Login;
           const verifyUser = await jwt.verify(token,process.env.SECRET_KEY)  ;
           //console.log(verifyUser);
           const user = await Register.findOne({_id: verifyUser._id});
           //console.log(user);  //returns the entire document
           
           req.token = token;  
           req.user = user;
           
           next();

      } catch (error) {
          res.status(401).send('not authenticated bruh !')
      }

}

module.exports = authenticate;