const router = require('express').Router()
let User = require('../models/user.model')

router.route('/register').post((req,res,next)=>{
    const {username, email,password} = req.body
    const user = new User({
        username,
        email,
        password
    })
    user.save()
        .then(()=>{
            sendToken(user,200,res)
        }).catch(err=>{
            res.json({
                success:false,
                error: err.message
            })
        })
})

router.route('/login').post((req,res,next)=>{
    const {email,password} = req.body

    if(!email||!password){
        res.status(400).json({success:false,error:"Entre com email e senha"})
    }else{
        User.findOne({email}).select("+password")
        .then(async user=>{
            if(!user){
                res.status(400).json({success:false,error:"Email ou senha incorretos"})
            }else{
                const isMatch = await user.matchPassword(password)
                if(!isMatch){
                    res.status(400).json({success:false,error:"Email ou senha incorretos"})
                }else{
                    sendToken(user,200,res)
                } 
            }
        }).catch(err=>res.status(400).json({success:false,error:err.message}))
    }
})

router.route('/forgotpassword').post((req,res,next)=>{
    const {email} = req.body

    User.findOne({email})
        .then(user=>{
            if(!user){
                return res.status(400).json({success:false,error:"Email não pode ser mandado"})
            }

            const resetToken = user.getResetPasswordToken()
            user.save()
                .then(()=>{
                    const resetUrl = `http:localhost:3000/passwordreset/${resetToken}`
                    const message = `
                        <h1>Você solicitou uma alteração de senha </h1>
                        <p>Por favor, entre neste link para alterar sua senha</p>
                        <a href=${resetUrl} clicktracking=off>${resetUrl}</a> 
                    `

                    
                
                }).catch(err=>res.status(400).json(err))
        }).catch(err=>res.status(400).json(err))

})

router.route('/resetpassword/:resetToken').post((req,res,next)=>{
    
})

const sendToken = (user,statusCode,res)=>{
    const token = user.getSignedToken()
    res.status(statusCode).json({success:true,token})
}

module.exports = router