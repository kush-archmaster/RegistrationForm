require('dotenv').config()
const express = require('express');
const app = express();
const path = require('path');
require('./db/conn');
const Register = require('./model/collection');
const hbs = require('hbs');
const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname,'../public');
const templatepath = path.join(__dirname,'../template/views');
const partialPath = path.join(__dirname,'../template/partials');

const bcrypt = require('bcrypt'); //for securing passwword



app.use(express.static(publicPath));
app.set('view engine', 'hbs');
app.set('views', templatepath)
app.use(express.urlencoded({extended:false}));
hbs.registerPartials(partialPath);

//console.log(process.env.SECRET_KEY);


app.get('/', (req,res)=>{
    res.render('index');
})

app.get('/register', (req,res)=>{
    res.render('register');
   
})

app.get('/login', (req,res)=>{
    res.render('login')
})


//create a new user in db
app.post('/register',express.json(), async(req,res)=>{
     try{
         const password = req.body.password;
         const cpassword = req.body.passwordConfirmation;

         if(password === cpassword){
              
            const registerEmp = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                phone: req.body.phone,
                password,
                passwordConfirmation: cpassword
                
            })
      
            //middleware for generating token 
            const token = await registerEmp.generateToken();
            
            //middleware for password hashing will act before save
            const data = await registerEmp.save();
            res.status(201).render('index');

         }
         else{
             res.send('Password not matching');
         }

     }catch(err){
         res.status(400).send(err);
     }
})

//checking login details
app.post('/login',express.json(), async(req,res)=>{
    try{
        const email = req.body.email;
        const passw = req.body.password; //entered by user at login page

        const response = await Register.find({email});  //returns the array of our doc
        const matched = await bcrypt.compare(passw,response[0].password);
        
        const token = await response[0].generateToken();
        if(matched)
        {
           
            res.status(201).render('userpage',{user: response[0].firstname});
        }
        else{
            res.send('Paswword no');
        }
        

    }catch(err){
         res.status(400).send('Invalid Email')
    }
})

/*
const securePass = async(pass) =>{ //converts the password into a hash value
      const final = await bcrypt.hash(pass,10); //returns a promise
      console.log(final);

      //comparing our original pass and hashed passw
      const hashedPass = await bcrypt.compare(pass,final);
      console.log(hashedPass);
}

securePass('kush!12');



const createToken = async() =>{
    try{
        const token = await jwt.sign({_id: '60bcddd02d8ae91ff4a8d36e'}, 'kushahahah',{expiresIn: '5 seconds'}) ;  // (payload, secretKey)
        console.log(token);  //jw token generated

        const userVerify = await jwt.verify(token, 'kushahahah'); //(token generated, secretkey)
        console.log( userVerify); //returns an object

    }
    catch(err){
        console.log(err)
    }
}

createToken();
*/

app.listen(port,()=>console.log(`Server running at ${port}`));
