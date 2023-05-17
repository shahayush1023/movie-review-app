const User = require("../models/user");
const Emailverificationtoken = require('../models/emailverificationtoken');
const PasswordResetToken = require('../models/passwordResetToken');
const nodemailer = require('nodemailer');
const { isValidObjectId } = require("mongoose");
const {generateOTP,generateMailTransporter} = require('../utils/mail');
const {sendError} = require('../utils/helper');

exports.create = async (req, res) => {
  const { name, email, password } = req.body;
  const olduser = await User.findOne({email});
  if(olduser) return res.status(401).json({error:'This email is already in use'})

  const newUser = new User({ name, email, password });
  await newUser.save();

  //6 digit otp
  let otp = generateOTP();

  //store inside our db
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

  res.status(201).json({ message:"please verify your email.OTP has been sent to your email"});
};

exports.verifyemail = async(req,res)=>{
  const{userId,otp} = req.body;
  
  if(!isValidObjectId(userId)) return res.json({error:"invalid user!"});
  
  const user = await User.findById(userId)
  
  if(!user) return sendError(res,"user not found!",404);

  if(user.isVerified) return sendError(res,"user is already verified!");
 
  const token = await Emailverificationtoken.findOne({owner:userId});
  if(!token) return sendError(res,"token not found!");

  const isMatched = await token.comparetoken(otp);
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
  res.json({mesaage:'your email is verified'})
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
  

  let otp = generateOTP();

  //store inside our db
  const newEmailVerificationtoken = new Emailverificationtoken({
    owner:user._id,
    token:otp
  });

  await newEmailVerificationtoken.save(); 

  var transport = generateMailTransporter();

  transport.sendMail({
    from:'verification@reviewapp.com',
    to:user.email,
    subject:'email verification',
    html:`<p>Your verification OTP</p>
        <h1>${otp}</h1>
    `

  });

  res.json({message:"New OTP has been send it to your registered email"});
};

exports.forgetPassword = async ()=>{
  const {email} = req.body;
  if(!email) return sendError(res,'email is missing');

 const user = await User.findOne({email});
 if(!user) return sendError(res,'User not found',404);

 const alreadyToken  = await PasswordResetToken.findOne({owner:user._id});
if(alreadyToken) return sendError(res,'Only after one hour you can request for another token!');

}