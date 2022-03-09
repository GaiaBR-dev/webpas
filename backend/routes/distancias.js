const router = require('express').Router()
const { xlstojson } = require('../xlstojson')
let Distancia = require('../models/distancia.model')

router.route('/').get((req,res)=>{
    Distancia.find()
        .then(distancias => res.json(distancias))
        .catch(err => res.status(400).json('Error: '+ err))
})

router.route('/id/:id').get((req,res)=>{
    Distancia.findById(req.params.id)
        .then(distancia => res.json(distancia))
        .catch(err => res.status(400).json('Error: '+ err))
})

router.route('/add').post((req,res) =>{
    const departamento = req.body.departamento
    const predio = req.body.predio
    const valorDist = req.body.valorDist

    const novaDistancia = new Distancia({
        departamento,
        predio,
        valorDist
    })

    novaDistancia.save()
        .then(()=> res.json('Distancia adicionada'))
        .catch(err =>res.status(400).json('Error: '+ err))
})

router.route('/addmany').post((req,res) =>{//salvar a partir de arquivo vindo do cliente
    novasDistancias = req.body.novasDistancias
    Distancia.insertMany(novasTurmas,(err,docs)=>{
        
    })
        .then(()=> res.json('Distancias adicionadas'))
        .catch(err =>res.status(400).json('Error: '+ err))
})

router.route('/inseredistancias321').post((req, res) => { // Hard coded -> deletar depois
    const result = xlstojson()
    novasDistancias = result.Distancia

    Distancia.insertMany(novasDistancias)
        .then(()=> res.json('Distancias adicionadas'))
        .catch(err =>res.status(400).json('Error: '+ err))  
})

router.route('/todasdistancias').get((req,res)=>{ // verifica se para todos os predios e departamentos existe uma distancia
    const predios = req.body.predios
    const departamentos = req.body.departamentos
    let todos = true

    Distancia.find()
        .then(distancias=>{
                predios.forEach((predio)=>{ 
                    departamentos.forEach((departamento)=>{
                        let existe = distancias.find(dist =>{
                            return dist.predio === predio && dist.departamento === departamento
                        })
                        if(typeof(existe) == "undefined"){
                            todos = false
                        }
                    })
                })
           res.json(todos)
        }).catch(err => res.status(400).json('Error: '+ err))
})

router.route('/:id').delete((req,res)=>{
    Distancia.findByIdAndDelete(req.params.id)
        .then(()=> res.json('Distancia deletada'))
        .catch(err => res.status(400).json('Error: '+ err))
})

router.route('/update/:id').post((req,res)=>{
    Distancia.findById(req.params.id)
        .then(distancia=> {
            distancia.departamento = req.body.departamento
            distancia.predio = req.body.predio
            distancia.valorDist = req.body.valorDist

            distancia.save()
                .then(()=> res.json('Distancia atualizada'))
                .catch(err =>res.status(400).json('Error: '+err))
        })
        .catch(err => res.status(400).json('Error: '+ err))
})

module.exports = router
