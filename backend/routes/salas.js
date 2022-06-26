const router = require('express').Router()
const { xlstojson } = require('../xlstojson')
let Sala = require('../models/sala.model')
const {protect} = require('../middleware/auth')

diasTemp = ['Segunda','Terça','Quarta','Quinta','Sexta','Sábado']

router.route('/').get((req,res)=>{
    const user = req.user
    Sala.find({user:user._id})
        .then(salas => res.json(salas))
        .catch(err => res.status(400).json(err))
})

router.route('/p/').get((req,res)=>{
    const user = req.user
    Sala.find({user:user._id}).distinct('predio')
        .then(predios => res.json(predios))
        .catch(err => res.status(400).json(err))
})

router.route('/addPredio').post((req,res)=>{
    const predio = req.body.predio
    const capacidade = req.body.capacidade
    const nSalas = req.body.nSalas
    const disponibilidade = req.body.disponibilidade
    const {user} = req
    
    Sala.find({predio:predio,user:user._id})
        .then(salas =>{
            if (salas.length > 0) {
                let err = {code:1,msg:'Um prédio com o nome '+ predio + ' já existe'}
                res.status(400).json(err)
            } else{
                const novasSalas = new Array(nSalas)
                for (let i = 0; i < nSalas; i++) {  
                    novasSalas[i] = {
                        predio:predio,
                        numeroSala: 'Sala ' + i,
                        capacidade:capacidade,
                        disponibilidade:disponibilidade,
                        user:user._id
                    }
                }
                Sala.insertMany(novasSalas)
                    .then(()=> res.json('Predio adicionado'))
                    .catch(err =>res.status(400).json('Error: '+ err))
            }
        }).catch(err =>res.status(400).json('Error: '+ err))
})

router.route('/:predio').get((req,res)=>{
    const {user} = req
    Sala.find({predio:req.params.predio,user:user._id})
        .then(salas => res.json(salas))
        .catch(err => res.status(400).json('Error: '+ err))
})

router.route('/:predio/update').post((req,res)=>{
    const predioVelho = req.params.predio
    const predioNovo = req.body.predioNovo
    const {user} = req
            
    Sala.find({predio:predioNovo,user:user._id})
        .then(salasN =>{
            if (salasN.length > 0) {
                let err = {code:1,msg:'Um prédio com o nome '+ predioNovo + ' já existe'}
                res.status(400).json(err)
            }else{
                Sala.updateMany({predio:predioVelho,user:user._id},{predio:predioNovo,user:user._id})
                    .then(()=> res.json('Predio Atualizado'))
                    .catch(err =>res.status(400).json('Error: '+ err))
            }
        }).catch(err => res.status(400).json('Error: '+ err))
})

router.route('/:predio/delete').delete((req,res)=>{
    const {user} = req
    Sala.deleteMany({predio:req.params.predio,user:user._id})
        .then(()=> res.json('Predio deletado'))
        .catch(err => res.status(400).json('Error: '+ err))
})

router.route('/:predio/addSala').post((req,res)=>{
    const predio = req.params.predio
    const numeroSala = req.body.numeroSala
    const capacidade = req.body.capacidade
    const disponibilidade = req.body.disponibilidade
    const {user} = req

    Sala.find({predio:predio, numeroSala:numeroSala,user:user._id})
        .then(salas=>{
            if (salas.length > 0){
                let err = {code:1,msg:"Uma sala com o mesmo nome já está cadastrada"}
                res.status(400).json(err)
            }else{
                const novaSala = new Sala({
                    predio:predio,
                    numeroSala:numeroSala,
                    capacidade:capacidade,
                    disponibilidade:disponibilidade,
                    user:user._id
                })
                novaSala.save()
                    .then(()=> res.json('Sala adicionada'))
                    .catch(err =>{res.status(400).json(err)})
            }
        })
})

router.route('/:predio/update/:id').post((req,res)=>{
    const predio = req.params.predio
    const numeroSala = req.body.numeroSala
    const {user} = req
    
    Sala.find({predio:predio, numeroSala:numeroSala,user:user._id})
        .then(salas =>{
            if (salas.length > 1){
                let err = {code:1,msg:"Uma sala com o mesmo nome já está cadastrada"}
                res.status(400).json(err)
            }else if(salas.length == 0 || req.params.id == salas[0]._id){
                Sala.findById(req.params.id)
                    .then(sala=> {
                        sala.numeroSala = req.body.numeroSala
                        sala.capacidade = req.body.capacidade
                        sala.disponibilidade = req.body.disponibilidade
                        
                        sala.save()
                            .then(()=> res.json('Sala atualizada'))
                            .catch(err =>res.status(400).json(err))
                    })
                    .catch(err => res.status(400).json(err))
            }else{
                let err = {code:1,msg:"Uma sala com o mesmo nome já está cadastrada"}
                res.status(400).json(err)
            }
        })
    
})

router.route('/:id').delete((req,res)=>{
    Sala.findByIdAndDelete(req.params.id)
        .then(()=> res.json('Sala deletada'))
        .catch(err => res.status(400).json(err))
})

router.route('/deleteMany').post((req,res)=>{
    const salasIds = req.body.salasID
    Sala.deleteMany({_id:{$in:salasIds}})
        .then(()=> res.json('Salas deletadas'))
        .catch(err => res.status(400).json(err))
})

router.route('/arquivosala').post((req, res) => { 
    novasSalas = req.body.novasSalas
    Sala.insertMany(novasSalas,{ordered:false})
        .then(()=> res.json('Salas adicionadas'))
        .catch(err =>{
            console.log(err)
            res.status(400).json(err)
        })
})

router.route('/inseresalas321').post((req, res) => { // Hard Coded -> deletar depois
    const result = xlstojson()
    novasSalas = result.Salas

    const novasSalasTratado = novasSalas.map(sala=>{
        let ns = {
            predio: sala.predio,
            numeroSala: sala.numeroSala,
            capacidade: sala.capacidade
        }
        let disponibilidade = []
        diasTemp.map(dia=>{
            let dispUnitM = {
                dia: dia,
                periodo: 'Manhã',
                disponivel: sala.disponivelManha == 1 
            }
            disponibilidade.push(dispUnitM)
            let dispUnitT = {
                dia: dia,
                periodo: 'Tarde',
                disponivel: sala.disponivelTarde == 1
            }
            disponibilidade.push(dispUnitT)
            let dispUnitN = {
                dia: dia,
                periodo: 'Noite',
                disponivel: sala.disponivelNoite == 1
            }
            disponibilidade.push(dispUnitN)
        })
        ns.disponibilidade  = disponibilidade
        return ns
    })

    Sala.insertMany(novasSalasTratado)
        .then(()=> res.json(novasSalasTratado))
        .catch(err =>res.status(400).json('Error: '+ err))
})

module.exports = router