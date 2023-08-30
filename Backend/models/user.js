const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required :true,
        trim:true
    },
    email:{
        type:String,
        required :true,
        unique:true
    },
    password:{
        type:String,
        required :true
    },
    isVerified:{
        type:Boolean,
        required:true,
        default:false
    },
    role:{
        type:String,
        required:true,
        default:'user',
        enum:['admin','user']
    }
});

userSchema.pre('save',async function(next){
    if(this.isModified('password')){
    this.password = await bcrypt.hash(this.password,10); //higher the value less risk more time to crack
    }
    next();
})

userSchema.methods.comparePassword = async function(password){
    const result = await bcrypt.compare(password,this.password);
    return result;
}

module.exports = mongoose.model("User",userSchema);