const express = require('express');
const {userValidator,validate, validatePassword, signInValidator} = require('../middlewares/validator');
const {create, verifyemail,resendEmailverificationtoken, forgetPassword, sendResetPasswordtokenStatus, resetPassword, signIn} = require("../controller/user");
const { isValidPassResetToken } = require('../middlewares/user');

const router = express.Router()

router.post("/create",userValidator,validate,create);
router.post("/signin",signInValidator,validate,signIn);
router.post("/verify-email",verifyemail)
router.post("/resend-email-verification-token",resendEmailverificationtoken)
router.post("/forget-password",forgetPassword);
router.post("/verify-pass-reset-token",isValidPassResetToken,sendResetPasswordtokenStatus);

router.post("/reset-password",validatePassword,validate,isValidPassResetToken,resetPassword );
module.exports = router;  
