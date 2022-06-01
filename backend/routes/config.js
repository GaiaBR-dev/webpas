const router = require('express').Router()
let Config = require('../models/config.model')

router.route('/').get((req,res)=>{// procurar por usuario
    Config.find()
        .then(config => res.json(config))
        .catch(err => res.status(400).json(err) )        
})

router.route('/newConfig').post((req,res)=>{ //Procurar config por usuário, se existir impedir novas configs
    const horarios = req.body.horarios
    const dias = req.body.dias
    const periodos = req.body.periodos
    const usuario = req.body.usuario

    Config.find({usuario:usuario})
        .then(configs=>{
            if(configs.length>0){
                res.status(400).json('Usuario ja existe')
            }else{
                novaConfig = new Config({
                    horarios,
                    dias,
                    periodos,
                    usuario
                })

                novaConfig.save()
                    .then(res=>res.json('Configuração Adicionada'))
                    .catch(err=>{
                        console.log(err)
                        res.status(400).json(err)})
            }
        })
})

router.route('/update/:id').post((req,res)=>{
    Config.findById(req.params.id)
        .then(config=>{

        }).catch(err=>res.status(400).json(err))
})

module.exports = router