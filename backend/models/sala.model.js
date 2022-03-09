const mongoose = require('mongoose')

const Schema = mongoose.Schema

const salaSchema = new Schema({

    predio: {type:String, required:true, index:true},
    numeroSala:{type:String, required: true},
    capacidade:{type:Number,required:true}, 
    disponivelManha: {type:Boolean, required:true},
    disponivelTarde: {type:Boolean, required:true},
    disponivelNoite: {type:Boolean, required:true},
    terreo:Boolean, 
    acessivel:Boolean
})

salaSchema.index({predio: 1,numeroSala: 1}, {unique: true})

const Sala = mongoose.model('Sala',salaSchema)

module.exports = Sala