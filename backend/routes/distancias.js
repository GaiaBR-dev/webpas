const router = require('express').Router()
const { xlstojson } = require('../xlstojson')
let Distancia = require('../models/distancia.model')
let Turma = require('../models/turma.model')
let Sala = require('../models/sala.model')
var mongoose = require('mongoose');

const arrayUnique = array => {
    var a = array.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }
    return a;
}

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

    Distancia.find({predio:predio,departamento:departamento})
        .then(distancias =>{
            if (distancias.length > 0){
                let err = {code:1,msg:"Esta distância ja está cadastrada"}
                res.status(400).json(err)
            }else{
                novaDistancia.save()
                .then(()=> res.json('Distancia adicionada'))
                .catch(err =>res.status(400).json(err))
            }
        }).catch(err =>res.status(400).json(err))

})

router.route('/arquivodistancia').post((req,res) =>{//salvar a partir de arquivo vindo do cliente
    novasDistancias = req.body.novasDistancias
    Distancia.insertMany(novasDistancias,{ordered:false})
        .then(()=> res.json('Distancias adicionadas'))
        .catch(err =>res.status(400).json(err))
})

router.route('/inseredistancias321').post((req, res) => { // Hard coded -> deletar depois
    const result = xlstojson()
    novasDistancias = result.Distancia

    Distancia.insertMany(novasDistancias)
        .then(()=> res.json('Distancias adicionadas'))
        .catch(err =>res.status(400).json('Error: '+ err))  
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
                .catch(err =>res.status(400).json(err))
        })
        .catch(err => res.status(400).json(err))
})

router.route('/deleteMany').post((req,res)=>{
    const distanciasIds = req.body.distanciasID
    Distancia.deleteMany({_id:{$in:distanciasIds}})
        .then(()=> res.json('Distâncias deletadas'))
        .catch(err => {
            console.log(err)
            res.status(400).json(err)
        })
})

router.route('/iscomplete').get(async (req,res)=>{
    const predios = await Sala.find().distinct('predio')
    const departamentosOferta = await Turma.find().distinct('departamentoOferta')
    const departamentosTurma = await Turma.find().distinct('departamentoTurma')
    const departamentos = arrayUnique(departamentosOferta.concat(departamentosTurma))

    Distancia.find()
        .then(distancias =>{
            const indiceDistancias = distancias.reduce((acc, cur) => {
                acc[cur.predio] = acc[cur.predio] ? acc[cur.predio] : {}
                acc[cur.predio] = {
                    ...acc[cur.predio],
                    [cur.departamento]: cur.valorDist
                }
                return acc
            }, {})
            let distanciasFaltantes = {
                isComplete: true,
                distancias:[]
            }

            predios.map((predio)=>{
                departamentos.map((departamento)=>{
                    let dist = {}
                    indiceDistancias[predio] = indiceDistancias[predio]? indiceDistancias[predio] : {}
                    if (indiceDistancias[predio][departamento] == undefined){
                        dist.predio = predio
                        dist.departamento = departamento
                        distanciasFaltantes.isComplete = false
                        distanciasFaltantes.distancias.push(dist)
                    }
                })
            })
            res.send(distanciasFaltantes)
        }).catch(err => res.status(400).json(err))

})

module.exports = router
