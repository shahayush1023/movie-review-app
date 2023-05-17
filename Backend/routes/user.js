const express = require('express');
const {userValidator,validate} = require('../middlewares/validator');
const {create, verifyemail,resendEmailverificationtoken} = require("../controller/user");

const router = express.Router()

router.post("/create",userValidator,validate,create);
router.post("/verify-email",verifyemail)
router.post("/resend-email-verification-token",resendEmailverificationtoken)
module.exports = router;