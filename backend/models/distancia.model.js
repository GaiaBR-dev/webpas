const mongoose = require('mongoose')

const Schema = mongoose.Schema

const distanciaSchema = new Schema({
    predio: {type:String, required:true, trim:true},
    departamento: {type:String, required:true, trim:true, },
    valorDist: {type:Number, required:true}
})

distanciaSchema.index({predio: 1,departamento: 1}, {unique: true})

const Distancia = mongoose.model('Distancia',distanciaSchema)

module.exports = Distancia