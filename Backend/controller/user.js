const User = require("../models/user");
const Emailverificationtoken = require('../models/emailverificationtoken');
const PasswordResetToken = require('../models/passwordResetToken');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const { isValidObjectId } = require("mongoose");
const {generateOTP,generateMailTransporter} = require('../utils/mail');
const {sendError, generateRandomByte} = require('../utils/helper');

exports.create = async (req, res) => {
  const { name, email, password } = req.body;
  const olduser = await User.findOne({email});
  if(olduser) return res.status(401).json({error:'This email is already in use'})

  const newUser = new User({ name, email, password });
  await newUser.save();

  //6 digit otp
  let otp = generateOTP();

  const newEmailVerificationtoken = new Emailverificationtoken({
    owner:newUser._id,
    token:otp
  });

  await newEmailVerificationtoken.save(); 

  var transport = generateMailTransporter();

  transport.sendMail({
    from:'verification@reviewapp.com',
    to:newUser.email,
    subject:'email verification',
    html:`<p>Your verification OTP</p>
        <h1>${otp}</h1>
    `

  });

  res.status(201).json({user:{
    id:newUser._id,
    name:newUser.name,
    email:newUser.email,
  }});
};

exports.verifyemail = async(req,res)=>{
  const{userId,OTP} = req.body;
  
  if(!isValidObjectId(userId)) return res.json({error:"invalid user!"});
  
  const user = await User.findById(userId)
  
  if(!user) return sendError(res,"user not found!",404);

  if(user.isVerified) return sendError(res,"user is already verified!");
 
  const token = await Emailverificationtoken.findOne({owner:userId});
  if(!token) return sendError(res,"token not found!");

  const isMatched = await token.comparetoken(OTP);
  if(!isMatched) return sendError(res,'please submit a valid otp')
  
  user.isVerified = true;
  await user.save();
  
  await Emailverificationtoken.findByIdAndDelete(token._id);

  
  var transport = generateMailTransporter();
  
  transport.sendMail({
    from:'verification@reviewapp.com',
    to:user.email,
    subject:'Welcome email',
    html:`<h1>Welcome to our app and thanks for choosing us</h1>` 
  });
  const jwttoken = jwt.sign({userId:user._id},process.env.JWT_SECRET);

  res.json({
    user:{id:user._id,
      name:user.name,
      email:user.email,
      token:jwttoken,
      isVerified:user.isVerified,
      role:user.role
    } ,
    message :'your email is verified'
  });
};

exports.resendEmailverificationtoken = async (req,res)=>{
  const{userId} = req.body;
  const user = await User.findById(userId);
  if(!user) return sendError(res,"user not found");
  
  if(user.isVerified) return sendError(res,"This email id is already verified");

  const alreadytoken = await Emailverificationtoken.findOne({
    owner:userId
  });
  if(alreadytoken) return sendError(res,'Only after one hour you can request for another token!');
  

  let OTP = generateOTP();

  //store inside our db
  const newEmailVerificationtoken = new Emailverificationtoken({
    owner:user._id,
    token:OTP
  });

  await newEmailVerificationtoken.save(); 

  var transport = generateMailTransporter();

  transport.sendMail({
    from:'verification@reviewapp.com',
    to:user.email,
    subject:'email verification',
    html:`<p>Your verification OTP</p>
        <h1>${OTP}</h1>
    `

  });

  res.json({message:"New OTP has been send it to your registered email"});
};

exports.forgetPassword = async (req,res)=>{
  const {email} = req.body;
  if(!email) return sendError(res,'email is missing');

 const user = await User.findOne({email});
 if(!user) return sendError(res,'User not found',404);

 const alreadyToken  = await PasswordResetToken.findOne({owner:user._id});
if(alreadyToken) return sendError(res,'Only after one hour you can request for another token!');

const token = await generateRandomByte();
const newPasswordresetToken = await PasswordResetToken({owner:user._id,token});
await newPasswordresetToken.save();

const resetPasswordUrl = `http://localhost:3000/auth/reset-password?token=${token}&id=${user._id}`;
const transport = generateMailTransporter();

  transport.sendMail({
    from:'security@reviewapp.com',
    to:user.email,
    subject:'Reset password link',
    html:`<p>Click here to reset password</p>
        <a href='${resetPasswordUrl}'>Change password</a>
    `
  });
  res.json({message:'Link sent to your email'})
 
};

exports.sendResetPasswordtokenStatus = (req,res)=>{
  res.json({valid:true});
}

exports.resetPassword = async(req,res)=>{
 const{newPassword,userId} = req.body;
 const user = await User.findById(userId);
 const matched =  await user.comparePassword(newPassword)
 if(matched) return sendError(res,'the new password must be different from old one!');

 user.password = newPassword;
 await user.save();

 await PasswordResetToken.findByIdAndDelete(req.resetToken._id)

 const transport = generateMailTransporter();
 transport.sendMail({
  from:'security@reviewapp.com',
  to:user.email,
  subject:'Password Reset successfully',
  html:`<h1>Password Reset successfully</h1>
      <p>Now you can use new password</p>
  `
 });

 res.json({message:'Password reset successfully'})
};

exports.signIn = async(req,res,next)=>{
   const{email,password} = req.body;
   try{
    const user = await User.findOne({email})
    if(!user) return sendError(res,'Email/Password mismatch!');
 
    const matched = await user.comparePassword(password);
    if(!matched) return sendError(res,'Email/Passwrod mismatch')
 
    const{_id, name,role,isVerified} = user
    const jwttoken = jwt.sign({userId:user._id},process.env.JWT_SECRET)
    res.json({user:{id:_id,name,email,token:jwttoken,isVerified,role}});
   }
   catch(error){
    next(error.message);
  }
  }