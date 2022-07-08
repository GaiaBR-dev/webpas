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
    }],
    user:{type:mongoose.Types.ObjectId,ref:'User',required:true}
})

resultadoSchema.index({ano:1,semestre:1,diaDaSemana:1,periodo:1,user:1},{unique:true})

const Resultado = mongoose.model('Resultado',resultadoSchema)

Resultado.on('index', function(err) {
    if (err) {
        console.error('Resultados: User index error: %s', err);
    } else {
        console.info('Resultados: User indexing complete');
    }
});

module.exports = Resultado