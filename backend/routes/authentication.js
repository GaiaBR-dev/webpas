const router = require('express').Router()
let Config = require('../models/config.model')

router.route('/register').post((req,res,next)=>{

})

router.route('/login').post((req,res,next)=>{
    
})

router.route('/forgotpassword').post((req,res,next)=>{
    
})

router.route('/resetpassword/:resetToken').post((req,res,next)=>{
    
})

module.exports = router