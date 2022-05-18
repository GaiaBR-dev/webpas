const router = require('express').Router()
const { xlstojson } = require('../xlstojson')
let Sala = require('../models/sala.model')

diasTemp = ['Segunda','Terça','Quarta','Quinta','Sexta','Sábado']

router.route('/').get((req,res)=>{
    Sala.find()
        .then(salas => res.json(salas))
        .catch(err => res.status(400).json(err))
})

router.route('/p/').get((req,res)=>{
    Sala.find().distinct('predio')
        .then(predios => res.json(predios))
        .catch(err => res.status(400).json(err))
})

router.route('/addPredio').post((req,res)=>{
    const predio = req.body.predio
    const capacidade = req.body.capacidade
    const nSalas = req.body.nSalas
    const disponibilidade = req.body.disponibilidade

    Sala.find({predio:predio})
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
                        disponibilidade:disponibilidade
                    }
                }
                Sala.insertMany(novasSalas)
                    .then(()=> res.json('Predio adicionado'))
                    .catch(err =>res.status(400).json('Error: '+ err))
            }
        }).catch(err =>res.status(400).json('Error: '+ err))
})

router.route('/:predio').get((req,res)=>{
    Sala.find({predio:req.params.predio})
        .then(salas => res.json(salas))
        .catch(err => res.status(400).json('Error: '+ err))
})

router.route('/:predio/update').post((req,res)=>{
    const predioVelho = req.params.predio
    const predioNovo = req.body.predioNovo
            
    Sala.find({predio:predioNovo})
        .then(salasN =>{
            if (salasN.length > 0) {
                let err = {code:1,msg:'Um prédio com o nome '+ predioNovo + ' já existe'}
                res.status(400).json(err)
            }else{
                Sala.updateMany({predio:predioVelho},{predio:predioNovo})
                    .then(()=> res.json('Predio Atualizado'))
                    .catch(err =>res.status(400).json('Error: '+ err))
            }
        }).catch(err => res.status(400).json('Error: '+ err))
})

router.route('/:predio/delete').delete((req,res)=>{
    Sala.deleteMany({predio:req.params.predio})
        .then(()=> res.json('Predio deletado'))
        .catch(err => res.status(400).json('Error: '+ err))
})

router.route('/:predio/addSala').post((req,res)=>{
    const predio = req.params.predio
    const numeroSala = req.body.numeroSala
    const capacidade = req.body.capacidade
    const disponivelManha = req.body.disponivelManha
    const disponivelTarde = req.body.disponivelTarde
    const disponivelNoite = req.body.disponivelNoite

    const novaSala = new Sala({
        predio:predio,
        numeroSala:numeroSala,
        capacidade:capacidade,
        disponivelManha:disponivelManha,
        disponivelTarde:disponivelTarde,
        disponivelNoite:disponivelNoite
    })
    novaSala.save()
        .then(()=> res.json('Sala adicionada'))
        .catch(err =>{res.status(400).json('Error: '+ err); console.log(err)})
})

router.route('/update/:id').post((req,res)=>{
    Sala.findById(req.params.id)
        .then(sala=> {
            sala.numeroSala = req.body.numeroSala
            sala.capacidade = req.body.capacidade
            sala.disponivelManha = req.body.disponivelManha
            sala.disponivelTarde = req.body.disponivelTarde
            sala.disponivelNoite = req.body.disponivelNoite
            
            sala.save()
                .then(()=> res.json('Sala atualizada'))
                .catch(err =>res.status(400).json('Error: '+err))
        })
        .catch(err => res.status(400).json('Error: '+ err))
})

router.route('/:id').delete((req,res)=>{
    Sala.findByIdAndDelete(req.params.id)
        .then(()=> res.json('Sala deletada'))
        .catch(err => res.status(400).json('Error: '+ err))
})

router.route('/arquivosala').post((req, res) => { // salvar a partir de arquivo vindo do cliente
    novasSalas = req.body.novasSalas// considera que o cliente organizou tudo bunitin

    Sala.insertMany(novasSalas)
        .then(()=> res.json('Salas adicionadas'))
        .catch(err =>{
            // tratar erros
            if(err.code === 11000){
                let msg = 'O arquivo contem uma sala que já está cadastrada no banco de dados'
                res.status(400).json(msg)
            }else{res.status(400).json(err)}
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