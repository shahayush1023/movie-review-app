const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://shahayush329:shah2002@cluster0.lj0d1by.mongodb.net/?retryWrites=true&w=majority').
then(()=>{
    console.log('db is connected');
}).catch((ex)=>{
    console.log('error while connecting',ex);
})