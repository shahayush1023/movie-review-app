const express = require('express');
const app = express();
const morgan = require("morgan");
const userRouter = require('./routes/user');
const { errorHandler } = require('./middlewares/error');
require('express-async-errors');
require('dotenv').config()
require('./db');

app.use(express.json());
app.use("/api/user",userRouter);
app.use(morgan("dev"));
app.use(errorHandler);
// app.post('/sign-in',(req,res,next)=>{
//     const{email,password} = req.body;
//     if(!email || !password)
//         res.json({error:'email/password missing!'})
//     next()
// },
//     (req,res)=>{
//         res.send("<h1>hello backend here</h1>");
//     }
// );


app.listen(8000,()=>{
    console.log("server listening to 8000");
});