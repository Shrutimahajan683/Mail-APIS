const express=require('express')
const bodyParser=require('body-parser')
const app=express()
const mongoose=require('mongoose')


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())
const sgMail = require('@sendgrid/mail');


const url='mongodb://localhost/mail'



mongoose.connect(url,{useNewUrlParser:true,useCreateIndex:true,useUnifiedTopology:true,useFindAndModify:true})
const con=mongoose.connection
con.on('open',function(){
    console.log('connected')
})

const mailRouter=require('./routes/mail')
app.use('/mail',mailRouter)


app.listen(3000,function(){
    console.log('connected')
})