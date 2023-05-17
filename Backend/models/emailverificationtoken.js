const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const emailverificationtokenSchema = mongoose.Schema({
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    },
    token:{
        type:String,
        required:true
    },
    createAt:{
        type:Date,
        expires:3600,
        default:Date.now(),
    },
});

emailverificationtokenSchema.pre('save',async function(next){
    if(this.isModified('token')){
    this.token = await bcrypt.hash(this.token,10); //higher the value less risk more time to crack
    }
    next();
})

emailverificationtokenSchema.methods.comparetoken = async function(token){
    const result = await bcrypt.compare(token,this.token);
    return result;
}

module.exports = mongoose.model("Emailverificationtoken",emailverificationtokenSchema);



// verificationToken:{
//     owner:_id,
//     token:otp,
//     expiryDate:1hr

// }