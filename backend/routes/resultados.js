const router = require('express').Router()
let Resultado = require('../models/resultado.model')
const { dbtomodel } = require('../dbtomodel')
const { resolve } = require('../gerasalahorarioglpk')
const { trataresultado } = require('../trataresultado')


router.route('/').get((req,res)=>{
    Resultado.find()
        .then(resultados => res.json(resultados))
        .catch(err => res.status(400).json('Error: '+ err))
})

router.route('/diaperiodo').post(async (req, res) => {
    const ano = req.body.ano
    const semestre = req.body.semestre
    const periodo = req.body.periodo
    const diaDaSemana = req.body.diaDaSemana
    const delta = req.body.delta

    const modelo = await dbtomodel(periodo,diaDaSemana)
    const produto = await resolve(modelo,delta)
    const alocacoes = trataresultado(modelo,produto)
    
    novoResultado = new Resultado({
        ano,
        semestre,
        diaDaSemana,
        periodo,
        alocacoes
    })

    novoResultado.save()
        .then(()=> res.json(novoResultado))
        .catch(err =>res.status(400).json('Error: '+ err)) 
})

router.route('/calculatudo').post(async (req, res) => {
    const ano = req.body.ano
    const semestre = req.body.semestre
    const delta = req.body.delta
    const periodos = ["manha","tarde","noite"]
    const dias = ["Segunda","Terça","Quarta","Quinta","Sexta"]

    dias.forEach(async (dia) =>{
        periodos.forEach(async (periodo)=>{
            console.log('dia: '+ dia)
            console.log('periodo '+ periodo)
            const modelo = await dbtomodel(periodo,dia)
            const produto = await resolve(modelo,delta)
            const alocacoes = trataresultado(modelo,produto)
            
            novoResultado = new Resultado({
                ano,
                semestre,
                diaDaSemana,
                periodo,
                alocacoes
            })

            novoResultado.save()
        })
    })
})



router.route('/id/:id').get((req,res)=>{
    Resultado.findById(req.params.id)
        .then(resultado => res.json(resultado))
        .catch(err => res.status(400).json('Error: '+ err))
})


router.route('/:id').delete((req,res)=>{
    Distancia.findByIdAndDelete(req.params.id)
        .then(()=> res.json('Resultado deletado'))
        .catch(err => res.status(400).json('Error: '+ err))
})

router.route('/update/:id').post((req,res)=>{
    Resultado.findById(req.params.id)
        .then(resultado=> {

            resultado.ano = req.body.ano
            resultado.semestre = req.body.semestre
            resultado.diaDaSemana = req.body.diaDaSemana
            resultado.periodo = req.body.periodo
            resultado.alocacoes = [{
                turma: req.body.alocacoes.turma,
                predio:{
                    nome: req.body.alocacoes.predio.nome,
                    sala:{
                        numero:req.body.alocacoes.predio.sala.numero
                    }
                },
                horarioInicio: req.body.alocacoes.horarioInicio,
                horarioFim: req.body.alocacoes.horarioFim
            }]

            resultado.save()
                .then(()=> res.json('Resultado atualizado'))
                .catch(err =>res.status(400).json('Error: '+err))
        })
        .catch(err => res.status(400).json('Error: '+ err))
})

module.exports = router