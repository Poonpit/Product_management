const { Router } = require('express')
const express = require('express')
const router = express.Router()
// use model
const Product = require('../models/products')
//upload file
const multer = require('multer')

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./public/images/products') // file storage location
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+".jpg")  // Prevent duplicate file names
    }
})

// start upload
const upload = multer({
    storage:storage
})


router.get('/',(req,res)=>{
    Product.find().exec((err,doc)=>{
        res.render('index',{products:doc})
    })
})

router.get('/add-product',(req,res)=>{
    //cookie
    // if(req.cookies.login){
    //     res.render('form')
    // }else{
    //     res.render('admin')
    // }
    //session
    if(req.session.login){
        res.render('form')
    }else{
        res.render('admin')
    }
})

router.get('/manage',(req,res)=>{
    //cookie
    // if(req.cookies.login){
    //     Product.find().exec((err,doc)=>{
    //         res.render('manage',{products:doc})
    //     })
    // }else{
    //     res.render('admin')
    // }
    //session
    //show information session
    if(req.session.login){
        Product.find().exec((err,doc)=>{
            res.render('manage',{products:doc})
        })
    }else{
        res.render('admin')
    }
    console.log("session ID = ",req.sessionID)
    console.log("session information = ",req.session)
})

router.get('/logout',(req,res)=>{
    // cookie
    // res.clearCookie('username')
    // res.clearCookie('password')
    // res.clearCookie('login')
    // res.redirect('/manage')
    //sesion
    req.session.destroy((err)=>{
        res.redirect('/manage')
    })

})

router.get('/delete/:id',(req,res)=>{
    Product.findByIdAndDelete(req.params.id,{useFindAndModify:false}).exec(err=>{
        if(err) console.log(err);
        res.redirect('/manage')
    })
})


router.get('/:id',(req,res)=>{
    const product_id = req.params.id
    Product.findOne({_id:product_id}).exec((err,doc)=>{
        console.log(doc);
        res.render('product',{product:doc})
    })
})


router.post('/insert',upload.single("image"),(req,res)=>{
    let data = new Product({
        name:req.body.name,
        price:req.body.price,
        image:req.file.filename,
        description:req.body.description
    })
    console.log(data);
    Product.saveProduct(data,(err)=>{
        if(err) console.log(err)
        res.redirect('/')
    })
})

router.post('/edit',(req,res)=>{
    const edit_id = req.body.edit_id
    Product.findOne({_id:edit_id}).exec((err,doc)=>{
        //Bring the original data that needs to be corrected. to be displayed in the form
        res.render('edit',{product:doc})
    })
})

router.post('/update',(req,res)=>{
    //new data frow edit
    const update_id = req.body.update_id
    let data ={
        name:req.body.name,
        price:req.body.price,
        description:req.body.description
    }
    //update data
    Product.findByIdAndUpdate(update_id,data,{useFindAndModify:false}).exec(err=>{
        if(err) console.log(err);
        res.redirect('/manage')
    })
})

router.post('/login',(req,res)=>{
    const username = req.body.username
    const password = req.body.password
    const timeExpire = 30000  // 1000 = 1 s anyway 20000 = 20 s
    if(username == "admin" && password ==="1234"){
        //cookie
        //build cookie
        // res.cookie('username',username,{maxAge:timeExpire})
        // res.cookie('password',password,{maxAge:timeExpire})
        // res.cookie('login',true,{maxAge:timeExpire})  //  true => admin login 
        // res.redirect('/manage')
        //session
        //buile session
        req.session.username = username
        req.session.password = password
        req.session.login = true
        req.session.cookie.maxAge = timeExpire
        res.redirect('/manage')
    }else{
        res.render('404')
    }
})


module.exports = router