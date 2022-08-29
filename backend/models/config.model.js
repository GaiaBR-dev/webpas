const mongoose = require('mongoose')

const Schema = mongoose.Schema

const configSchema = new Schema({
    horarios:{
        "Manhã":{
            type:{
                "Início":{
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
                "Início":{
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
                "Início":{
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
    user:{type:mongoose.Types.ObjectId,ref:'User',required:true,index:true,unique:true}

})

const Config = mongoose.model('Config',configSchema)

module.exports = Config