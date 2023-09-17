const express= require('express');
const User= require('../models/User');
//Router is used to create different end Points of API
const router=express.Router();

//To use Validations on email and Passward.
const { body, validationResult } = require('express-validator');

//For Hashing and adding Salt to Passward.
const bcrypt = require('bcryptjs');

//Used for Authentication.
const jwt = require('jsonwebtoken');

//For fetching User
const fetchUser=require('../middleware/fetchUser')

//Secret Key for JWT
const jwt_secret=process.env.SECRET_KEY;


//Route 1:create a user using Post: '/api/auth/createUser' No login required
router.post('/createUser',[body('name','Enter a valid name').isLength({min:3}),body('email',"Enter a Valid Email").isEmail(),body('passward').isLength({min:4})],
 async (req,res)=>
{
  let success = false;

    //   obj=
    //   {
    //     a:'this',
    //     number:54
    //   }

    //   res.json(obj)
    // console.log(req.body)
    // const user= User(req.body);
    // user.save();
 
    //if there are errors return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }   

    try {
    //check whether the user already exists
    let user=await User.findOne({email:req.body.email});

    if(user)
    {
      return res.status(400).json({success,error:"sorry user with this email already exists "});
    }

    const salt= await bcrypt.genSalt(10);
    const secPass= await bcrypt.hash(req.body.passward,salt);

  user= await User.create({
        name: req.body.name,
        email: req.body.email,
        passward: secPass,
      })

      const data={
        user:{
          id:user.id
        }
      }

      const authToken=jwt.sign(data,jwt_secret);
      success = true;
      res.json({success,authToken})
      // .then(user => res.json(user))
      // .catch(err=>{console.log(err)
      // res.json({error: 'Please Enter Valid Input',message:err.message})})
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Internal Server Error');
    }
})

// Route 2:create a user using Post: '/api/auth/login' No login required
router.post('/login',[
    body('email','Enter valid email').isEmail(),
    body('passward',"passward can't be blank").exists(),
  ],async (req,res)=>
  {
    let success = false;
       //if there are errors return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }   
//getting email and passward using destructuring
const {email,passward}=req.body;

//trying to catch user if it exists or not
try {
  let user= await User.findOne({email})
  if(!user)
  {
    return res.status(400).json({success,error:'please try to login with correct credentials'});
  }

  const passCompare=await bcrypt.compare(passward,user.passward);
  if(!passCompare)
  {
    return res.status(400).json({success,error:'please try to login with correct credentials'});
  }

  const data={
    user:{
      id:user.id
    }
  }
  success = true;
  const authToken=jwt.sign(data,jwt_secret);
  res.json({success,authToken})
} catch (error) {
  console.error(error.message);
      res.status(500).send('Internal Server Error');
}
  })

//Route 3: Get login details of user using Post: "/api/auth/getuser" login required
router.post('/getUser',fetchUser,[
],async (req,res)=>
{
try {
 let userId= req.user.id;
  const user= await User.findById(userId).select('-passward')
  res.send(user);
} catch (error) {
  console.error(error.message);
  res.status(500).send('Internal Server Error');
}
})
module.exports=router