const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const actorSchema = mongoose.Schema({
    name:{
        type:String,
        required :true,
        trim:true
    },
    about:{
        type:String,
        required :true,
        trim:true,
    },
    gender:{
        type:String,
        required :true,
        trim:true,
    },
    avatar:{
        type:Object,
        url:String,
        public_id:String
    },
},
    {timestamps:true}
);


module.exports = mongoose.model("Actor",actorSchema);