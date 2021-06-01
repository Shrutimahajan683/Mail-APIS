const { ObjectId } = require('bson')
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

router.get('/delete/inbox/:email/:id',async(req,res)=>{
    try{
        mail.update({"email":req.params.email},{$pull:{"inbox":{"_id":ObjectId(req.params.id)}}},{multi:true},(err,result)=>{
            if(result)
            {
                res.send("done")
        }
            else
            res.send(err)
        })
    }catch(err){
        res.send('error')
    }
})

router.get('/delete/outbox/:email/:id',async(req,res)=>{
    try{
        mail.update({"email":req.params.email},{$pull:{"outbox":{"_id":ObjectId(req.params.id)}}},{multi:true},(err,result)=>{
            if(result)
            {
                res.send("done")
        }
            else
            res.send(err)
        })
    }catch(err){
        res.send('error')
    }
})

router.post('/send/:sender/:receiver',(req,res)=>{
    try{
        
        mail.findOne({"email":req.params.sender},(err,result)=>{
            if(err)
            {
                res.send(err)
            }
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

router.post('/reply/:email/:id',(req,res)=>{
    try{
        
        mail.find({"inbox._id":req.params.id},(err,result)=>{
            var r=result[0].inbox[0].person;
            var s={
                person:result[0].inbox[0].person,
                sub:req.body.sub,
                text:req.body.text,
            }
            var y={
                person:req.params.id,
                sub:req.body.sub,
                text:req.body.text,
                }
            mail.findOne({"email":r},(err,res)=>{
            if(err)
            res.send(err)
            else
            {
                res.inbox.push(y)
                res.save()
            }
        })
    })
}
    catch(err){
      res.send('error')
    }
})

module.exports=router