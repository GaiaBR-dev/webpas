const mongoose = require('mongoose')

const Schema = mongoose.Schema

const configSchema = new Schema({
    horarios: [{type:Number, required:true}],
    diasDaSemana:[{type:String, required:true }],
    creditos:[{type:Number,required:true}]
})

const Config = mongoose.model('Config',configSchema)

module.exports = Config