const express=require('express')
const router=express.Router()
const mail=require('../models/mail')

router.get('/',async(req,res)=>{
    try{
      const mail=await mail.find()
      res.json(mail)
    }catch(err){
        res.send('error'+err)
    }
})

router.post('/',async(req,res)=>{
    console.log(req.body.name)
    const Mail=new mail({
        name:req.body.name,
        email:req.body.email,
    })

    try{
     const m1=await Mail.save()
     res.send(m1)
    }catch(err){
        res.send('error')
    }
})

router.get('/delete/:id',async(req,res)=>{
    try{
        mail.find({"_id":req.params.id}, function(err, result) { 
            console.log(result)
        });
    }catch(err){
        res.send('error')
    }
})

router.post('/send/:sender/:receiver',(req,res)=>{
    try{
        mail.findOne({"email":req.params.sender},(err,result)=>{
            if(err)
            res.send(err)
            else
            {
                var r={
                    person:req.params.receiver,
                    sub:req.body.sub,
                    text:req.body.text
                }
                result.outbox.push(r)
                result.save()
            }
        })
        mail.findOne({"email":req.params.receiver},(err,result)=>{
            if(err)
            res.send(err)
            else
            {
                var r={
                    person:req.params.sender,
                    sub:req.body.sub,
                    text:req.body.text,
                }
                result.inbox.push(r)
                result.save()
            }
        })
        res.send("done")
    }catch(err){
        res.send('error')
    }
})

router.get('/reply/:id',(req,res)=>{
    try{
        mail.find({inbox: {$elemMatch: {_id:req.params.id}}},(err,result)=>{
            var r={
                person:result[0].email,
                sub:req.body.sub,
                text:req.body.text
            }
            o=result[0].inbox;
            o.reply.push(r);
            result[0].save();
        })
    }
    catch(err){
      res.send('error')
    }
})

module.exports=router