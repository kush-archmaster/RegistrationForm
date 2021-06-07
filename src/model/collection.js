const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const empSchema = new mongoose.Schema({
    firstname:{
        type: String,
        required: true
    },
    lastname:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique:true
    },
    phone:{
        type: Number,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
    },
    passwordConfirmation:{
        type: String,
        required: true,
    },
    tokens: [{
         
        token:{
            type: String,
            required: true
        }
    }]

});
//defining a middleware functions
//empSchema.methods let me get the document i m gonna store in db
empSchema.methods.generateToken = async function(){
    try{
       //process.env.SECRET_KEY is given the value of secret key 
        const token =  await jwt.sign({_id: this._id.toString()}, process.env.SECRET_KEY);  //since this._id is ObjectIds
        this.tokens = this.tokens.concat({token}) //token:token
        console.log(token);
        //now we will save it in the database and will wait for this.save


    }catch(err){
        console.log(err);
        
}
}


empSchema.pre("save", async function(next){
    if(this.isModified('password')){  //kabhi agar password update krna hua toh
        console.log(`curr password ${this.password}`); //before hashing
        this.password = await bcrypt.hash(this.password,10);
        console.log(`curr password ${this.password}`);  //after hashing

        this.passwordConfirmation = undefined;//confirm password will not be stored
    }
   
    next();
   
})

//collection
const Register = new mongoose.model('Register',empSchema);

module.exports = Register;