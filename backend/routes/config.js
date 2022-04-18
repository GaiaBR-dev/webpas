const router = require('express').Router()
let Config = require('../models/config.model')

router.route('/').get((req,res)=>{// procurar por usuario
    Config.find()
        .then(config => res.json(config))
        .catch(err => res.status(400).json(err) )        
})

router.route('/newConfig').post((req,res)=>{ //Procurar config por usuário, se existir impedir novas configs
    const horariosInicio = req.body.horariosInicio
    const horariosFim = req.body.horariosFim
    const diasDaSemana = req.body.diasDaSemana
    const creditos = req.body.creditos
    const manha  = req.body.manha
    const tarde = req.body.tarde
    const noite = req.body.noite

    const novaConfig = new Config({
        horariosInicio,
        horariosFim,
        diasDaSemana,
        creditos,
        manha,
        tarde,
        noite
    })

    novaConfig.save()
        .then(()=> res.json('Configuração criada'))
        .catch(err => res.status(400).json(err))
})

router.route('/update/:id').post((req,res)=>{
    Config.findById(req.params.id)
        .then(config=>{
            config.horarioInicio = req.body.horarioInicio
            config.horarioFim = req.body.horarioFim
            config.diasDaSemana = req.body.diasDaSemana
            config.creditos = req.body.creditos
            config.manha  = req.body.manha
            config.tarde = req.body.tarde
            config.noite = req.body.noite
        }).catch(err=>res.status(400).json(err))
})

module.exports = router