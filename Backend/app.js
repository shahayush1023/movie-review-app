const express = require('express');
const app = express();
const userRouter = require('./routes/user');
require('./db');

app.use(express.json());
app.use("/api/user",userRouter);

app.post('/sign-in',(req,res,next)=>{
    const{email,password} = req.body;
    if(!email || !password)
        res.json({error:'email/password missing!'})
    next()
},
    (req,res)=>{
        res.send("<h1>hello backend here</h1>");
    }
);


app.listen(8000,()=>{
    console.log("server listening to 8000");
});