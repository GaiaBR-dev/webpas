const mongoose = require('mongoose')

const Schema = mongoose.Schema

const configSchema = new Schema({
    horariosInicio: [{type:Number, required:true}],
    horariosFim: [{type:Number, required:true}],
    diasDaSemana:[{type:String, required:true }],
    creditos:[{type:Number,required:true}],
    manha:{type:Boolean,required:true},
    tarde:{type:Boolean,required:true},
    noite:{type:Boolean,required:true},
})

const Config = mongoose.model('Config',configSchema)

module.exports = Config