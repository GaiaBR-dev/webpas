const router = require('express').Router()
let Config = require('../models/config.model')
const {protect} = require("../middleware/auth")

const StandartConfig = {
    horarios:{
        "Manhã":{
            "Início":{
                slot1:"800",
                slot2:"1000"
            },
            "Fim":{
                slot1:"1000",
                slot2:"1200"
            }
        },
        "Tarde":{
            "Início":{
                slot1:"1400",
                slot2:"1600"
            },
            "Fim":{
                slot1:"1600",
                slot2:"1800"
            }
        },
        "Noite":{
            "Início":{
                slot1:"1900",
                slot2:"2100"
            },
            "Fim":{
                slot1:"2100",
                slot2:"2300"
            }
        },
    },
    dias:["Segunda","Terça","Quarta","Quinta","Sexta"],
    periodos:["Manhã","Tarde","Noite"],
    numSalasAux:20,
    capSalasAux:200
}

router.route('/').get(protect,(req,res)=>{
    Config.find()
        .then(config => res.json(config))
        .catch(err => res.status(400).json(err) )        
})

router.route('/user/:id').get(protect,(req,res)=>{
    Config.findOne({user:req.params.id})
        .then(config => res.json(config))
        .catch(err => res.status(400).json(err) )        
})

router.route('/createStandartConfig/:id').post((req,res)=>{
    const novaConfig = new Config(StandartConfig)
    novaConfig.user = req.params.id
    novaConfig.save()
        .then(()=>{
            res.status(200).json({success:true, message:"Config Criada"})
        }).catch(err=>res.status(400).json(err))
})

router.route('/updateConfig/:id').post(protect,(req,res)=>{ //Procurar config por usuário, se existir impedir novas configs
    const { horarios,dias,periodos} = req.body
    const id = req.params.id

    Config.findByIdAndUpdate(id,{horarios,dias,periodos})
        .then(()=>res.status(200).json("Configuração atualizada"))
        .catch(err=>{
            console.log(err)
            res.status(400).json({msg:"Configuração inválida",code:1})})

})

module.exports = router