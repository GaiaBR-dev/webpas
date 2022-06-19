const jwt = require('jsonwebtoken')
const User = require('../models/user.model')

exports.protect = async (req,res,next) =>{
    let token

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1]
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
        next()
    }
    catch(error){
        return res.status(400).json({success:false,error:"Não autorizado"})
    }
}