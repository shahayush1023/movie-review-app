const express = require('express');
const cors = require('cors');
const morgan = require("morgan");
const { errorHandler } = require('./middlewares/error');
const { handleNotFound } = require('./utils/helper');
const userRouter = require('./routes/user');
const actorRouter = require('./routes/actor');
const movieRouter = require('./routes/movie.js');

require('express-async-errors');
require('dotenv').config()
require('./db');

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/api/user",userRouter);
app.use("/api/actor",actorRouter);
app.use("/api/movie",movieRouter);
app.use('/*',handleNotFound)

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