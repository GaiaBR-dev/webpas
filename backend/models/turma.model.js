const mongoose = require('mongoose')

const Schema = mongoose.Schema

const turmaSchema = new Schema({
    idTurma: {type:String, trim:true},
    campus: {type:String,trim:true},
    departamentoTurma: {type:String, trim:true},
    codDisciplina: {type:String, trim:true},
    turma: {type:String, required:true, trim:true},
    nomeDisciplina: {type:String, required:true, trim:true},
    totalTurma: {type:Number, required:true, trim:true},
    departamentoOferta: {type:String, required:true, trim:true},
    diaDaSemana: {type:String, required:true, trim:true},
    horarioInicio: {type:Number, required:true, trim:true},
    horarioFim: {type:Number, required:true, trim:true},
    alocadoChefia: {type:String, trim:true}, // tratar dados - trocar para boolean
    creditosAula: {type:Number, required:true, trim:true},
    docentes: {type:String,trim:true},
    ano:{type:Number,required:true},
    semestre:{type:Number, required:true}
})
turmaSchema.index({turma:1,nomeDisciplina:1,diaDaSemana:1,horarioInicio:1,ano:1,semestre:1},{ unique:true})
turmaSchema.index({ano:1,semestre:1})
//turmaSchema.index({docente:1,diaDaSemana:1,horarioInicio:1},{unique:true,sparse:true}) 

const Turma = mongoose.model('Turma',turmaSchema)

module.exports = Turma