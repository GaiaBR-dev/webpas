const mongoose = require('mongoose')

const Schema = mongoose.Schema

const resultadoSchema = new Schema({
    ano: {type: Number, required:true},
    semestre:{type: Number, required:true},
    diaDaSemana:{type:String, required:true},
    periodo:{type:String, required:true},
    alocacoes:[{
        turma:{},
        sala:{},
        horarioSlot:{type:Number, required: true}
    }]
})

const Resultado = mongoose.model('Resultado',resultadoSchema)

module.exports = Resultado