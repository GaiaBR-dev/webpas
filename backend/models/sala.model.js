const mongoose = require('mongoose')

const Schema = mongoose.Schema

const salaSchema = new Schema({

    predio: {type:String, required:true, index:true},
    numeroSala:{type:String, required: true},
    capacidade:{type:Number,required:true}, 
    disponibilidade:{
        Segunda:{
            manha:{type:Boolean,required:true},
            tarde:{type:Boolean,required:true},
            noite:{type:Boolean,required:true}
        },
        Terca:{
            manha:{type:Boolean,required:true},
            tarde:{type:Boolean,required:true},
            noite:{type:Boolean,required:true}
        },
        Quarta:{
            manha:{type:Boolean,required:true},
            tarde:{type:Boolean,required:true},
            noite:{type:Boolean,required:true}
        },
        Quinta:{
            manha:{type:Boolean,required:true},
            tarde:{type:Boolean,required:true},
            noite:{type:Boolean,required:true}
        },
        Sexta:{
            manha:{type:Boolean,required:true},
            tarde:{type:Boolean,required:true},
            noite:{type:Boolean,required:true}
        },
        Sabado:{
            manha:{type:Boolean,required:true},
            tarde:{type:Boolean,required:true},
            noite:{type:Boolean,required:true}
        },
        Domingo:{
            manha:{type:Boolean,required:true},
            tarde:{type:Boolean,required:true},
            noite:{type:Boolean,required:true}
        }
    },
    terreo:Boolean, 
    acessivel:Boolean
})

salaSchema.index({predio: 1,numeroSala: 1}, {unique: true})

const Sala = mongoose.model('Sala',salaSchema)

module.exports = Sala