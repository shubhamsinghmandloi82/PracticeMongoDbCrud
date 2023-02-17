const express = require('express');
var app =express()
require('dotenv').config()
const mongoose = require('mongoose');
const databaseConnection=require('./src/database/config')

app.use(express.json())
app.use(express.static('public'))
// test route for checking server is running or not
app.get('/',(req,res)=>{
    res.send("Hello Guy's Welcome To Mongo Curd Application")
})

app.use('/api/v1',require('./src/router/index'))

app.listen(process.env.PORT,()=>{
    console.log("server run on port no = ",process.env.PORT)
})