const router = require('express').Router()
let User = require('../models/user.model')
const ErrorResponse = require('../utils/errorResponse') 
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto')

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
            next(err)
        })
})

router.route('/login').post((req,res,next)=>{
    const {email,password} = req.body

    if(!email||!password){
        next(new ErrorResponse("Por favor entre com o email e senha",400,1))
    }else{
        User.findOne({email}).select("+password")
        .then(async user=>{
            if(!user){
                next(new ErrorResponse("Email ou senha incorretos",401,1))
            }else{
                const isMatch = await user.matchPassword(password)
                if(!isMatch){
                    next(new ErrorResponse("Email ou senha incorretos",401,1))
                }else{
                    sendToken(user,200,res)
                } 
            }
        }).catch(err=> next(err))
    }
})

router.route('/forgotpassword').post((req,res,next)=>{
    const {email} = req.body

    User.findOne({email})
        .then(user=>{
            if(!user){
                next(new ErrorResponse("Email não pode ser enviado",404,1))
            }

            const resetToken = user.getResetPasswordToken()
            user.save()
                .then(()=>{
                    const resetUrl = `http:localhost:3000/redefinirsenha/${resetToken}`
                    const message = `
                        <h1>Você solicitou uma alteração de senha </h1>
                        <p>Por favor, entre neste link para alterar sua senha</p>
                        <a href=${resetUrl} clicktracking=off>${resetUrl}</a> 
                    `
                    try {
                        sendEmail({
                            to: user.email,
                            subject: "Webpas Redefinir Senha",
                            text:message
                        })
                        res.status(200).json({success:true,message:"Email enviado"})       
                    }catch(error) {
                        user.resetPasswordToken = undefined
                        user.resetPasswordExpire = undefined
                        user.save().then(()=>{
                            next(new ErrorResponse("O Email não pode ser enviado",500,1))
                        }).catch(err=>next(err))
                    }
                }).catch(err=>next(err))
        }).catch(err=>next(err))

})

router.route('/resetpassword/:resetToken').put((req,res,next)=>{
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.resetToken).digest("hex")
    User.findOne({resetPasswordToken,
        resetPasswordExpire: {$gt:Date.now()}
    }).then(user=>{
        if(!user){
            return next(new ErrorResponse("Token de redefinição de senha inválido",400,1))
        }
        user.password = req.body.password
        user.resetPasswordToken= undefined
        user.resetPasswordExpire = undefined
        user.save().then(()=>{
            res.status(200).json({success:true,message:"Senha redenifida com sucesso!"})
        }).catch(err=>next(err))
    }).catch(err=>next(err))

})

const sendToken = (user,statusCode,res)=>{
    const token = user.getSignedToken()
    res.status(statusCode).json({success:true,token})
}

module.exports = router