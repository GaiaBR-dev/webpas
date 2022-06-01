const mongoose = require('mongoose')

const Schema = mongoose.Schema

const configSchema = new Schema({
    horarios:{
        "Manhã":{
            type:{
                "Ínicio":{
                    slot1:{type:String,required:true},
                    slot2:{type:String,required:true},
                },
                "Fim":{
                    slot1:{type:String,required:true},
                    slot2:{type:String,required:true},
                }
            },
            required:false
        },"Tarde":{
            type:{
                "Ínicio":{
                    slot1:{type:String,required:true},
                    slot2:{type:String,required:true},
                },
                "Fim":{
                    slot1:{type:String,required:true},
                    slot2:{type:String,required:true},
                }
            },
            required:false
        },"Noite":{
            type:{
                "Ínicio":{
                    slot1:{type:String,required:true},
                    slot2:{type:String,required:true},
                },
                "Fim":{
                    slot1:{type:String,required:true},
                    slot2:{type:String,required:true},
                }
            },
            required:false
        }
    },
    dias:[String],
    periodos:[String],
    usuario:{
        type:String,
        required:true,
        index:true,
        unique:true
    }

})

const Config = mongoose.model('Config',configSchema)

module.exports = Config