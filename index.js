const express= require("express");
const app= express();
const port=process.env.PORT||5000;
const dotenv=require("dotenv")
const con =require("./db/conn")
const cors=require("cors");
app.use(express.json());
app.use(express.urlencoded({extended:true}))
const userRouter = require('./router/user');
app.use('/api/user', userRouter);




app.listen(port,()=>{
    console.log(`server listen port ${port}`);
});