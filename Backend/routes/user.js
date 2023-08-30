const express = require('express');
const {userValidator,validate, validatePassword, signInValidator} = require('../middlewares/validator');
const {create, verifyemail,resendEmailverificationtoken, forgetPassword, sendResetPasswordtokenStatus, resetPassword, signIn} = require("../controller/user");
const { isValidPassResetToken } = require('../middlewares/user');
const { isAuth } = require('../middlewares/auth');

const router = express.Router();


router.post("/create",userValidator,validate,create);
router.post("/signin",signInValidator,validate,signIn);
router.post("/verify-email",verifyemail)
router.post("/resend-email-verification-token",resendEmailverificationtoken)
router.post("/forget-password",forgetPassword);
router.post("/verify-pass-reset-token",isValidPassResetToken,sendResetPasswordtokenStatus);
router.post("/reset-password",validatePassword,validate,isValidPassResetToken,resetPassword );
router.get('/is-auth',isAuth, (req,res)=>{
    const{user} = req;
    res.json({
        user: {
            id:user._id,
            name:user.name,
            email:user.email,
            isVerified:user.isVerified,
            role:user.role
        },
    })
});

module.exports = router;  
