const mongoose = require('mongoose')

const Schema = mongoose.Schema

const salaSchema = new Schema({

    predio: {type:String, required:true, index:true},
    numeroSala:{type:String, required: true},
    capacidade:{type:Number,required:true}, 
    disponibilidade:[{
        dia:{type:String,required:true},
        periodo:{type:String,required:true},
        disponivel:{type:Boolean,required:true}
    }],
    terreo:Boolean, 
    acessivel:Boolean,
    //user:{type:mongoose.Types.ObjectId,ref:'User',required:true}
})

salaSchema.index({predio: 1,numeroSala: 1}, {unique: true})

const Sala = mongoose.model('Sala',salaSchema)

module.exports = Sala