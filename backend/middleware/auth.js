const jwt = require('jsonwebtoken')
const User = require('../models/user.model')

exports.protect = async (req,res,next) =>{
    let token

    if(req.cookies){
        token = req.cookies.authToken
    }

    if(!token){
        return res.status(400).json({success:false,error:"Não autorizado"})
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        const user = await User.findById(decoded.id)
        if(!user){
            return res.status(400).json({success:false,error:"Nenhum usuario encontrado com este id"})
        }

        req.user = user
        console.log(user)
        next()
    }
    catch(error){
        return res.status(400).json({success:false,error:"Não autorizado"})
    }
}