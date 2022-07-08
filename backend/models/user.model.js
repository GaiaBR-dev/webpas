const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto')

const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {type:String, required:[true,"campo usuário é obrigatório"], trim:true},
    email: {
        type:String, 
        required:[true,"Campo email é obrigatório"], 
        unique:true,
        match:[
            /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/,
            "Por favor entre com um email valido"
        ]
    },
    password:{
        type: String,
        required: [true,"Por favor entre com uma senha"],
        minlength: 8,
        select: false
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
    emailVerified:{type:Boolean},
})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

userSchema.methods.matchPassword = async function(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.getSignedToken = function(){
    return jwt.sign({id: this._id},process.env.JWT_SECRET,{expiresIn: process.env.JWT_EXPIRE})
}

userSchema.methods.getResetPasswordToken = function(){
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")
    this.resetPasswordExpire = Date.now() + (10 * 60 * 1000)

    return resetToken
}

const User = mongoose.model('User',userSchema)

module.exports = User