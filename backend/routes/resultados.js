const router = require('express').Router()
let Resultado = require('../models/resultado.model')
const { dbtomodel } = require('../solver-logic/dbtomodel')
const { resolve } = require('../solver-logic/gerasalahorarioglpk')
const { trataresultado } = require('../solver-logic/trataresultado')

router.route('/').get((req,res)=>{
    Resultado.find()
        .then(resultados => res.json(resultados))
        .catch(err => res.status(400).json('Error: '+ err))
})

router.route('/:ano/:semestre').get((req,res)=>{
    Resultado.find({ano:req.params.ano,semestre:req.params.semestre})
        .then(resultados=>res.json(resultados))
        .catch(err => res.status(400).json(err))
})

router.route('/:ano/:semestre/:dia/:periodo').get((req,res)=>{
    Resultado.find({
        ano:req.params.ano,
        semestre:req.params.semestre,
        diaDaSemana:req.params.dia,
        periodo:req.params.periodo
    })
        .then(resultados=>res.json(resultados))
        .catch(err => res.status(400).json(err))
})

router.route('/diaperiodo').post(async (req, res) => {
    const ano = req.body.ano
    const semestre = req.body.semestre
    const periodo = req.body.periodo
    const diaDaSemana = req.body.diaDaSemana
    const delta = req.body.delta

    // checar se periodo está em config, se não retornar erro
    // config = await Config.find({user:user})
    // if (!config.periodos.includes(periodo)){res.status(400).json(err)}

    const modelo = await dbtomodel(ano,semestre,periodo,diaDaSemana)
    const produto = await resolve(modelo,delta)
    const alocacoes = await trataresultado(modelo,produto)
    
    res.json(alocacoes)
    
})

router.route('/calculalista').post(async (req, res) => {
    const ano = req.body.ano
    const semestre = req.body.semestre
    const delta = req.body.delta
    const lista = req.body.lista
    
    let resultObj = {}

    const listaDePromises = lista.map(async (unidade)=>{
        try {
            const modelo = await dbtomodel(ano,semestre,unidade.periodo,unidade.dia)
            const produto = await resolve(modelo,delta)
            const alocacoes = await trataresultado(modelo,produto)

            resultObj[unidade.dia] = resultObj[unidade.dia]? resultObj[unidade.dia]: {}
            if (produto.result.status == 4){
                resultObj[unidade.dia][unidade.periodo] = false;
            }else if (produto.result.status == 5){
                resultObj[unidade.dia][unidade.periodo] = true;
            }

            return Resultado.findOneAndUpdate({
                ano:ano,
                semestre:semestre,
                diaDaSemana:unidade.dia,
                periodo:unidade.periodo},{alocacoes:alocacoes},{upsert:true})

        } catch (error) {
            console.log(error)
            resultObj[unidade.dia] = resultObj[unidade.dia]? resultObj[unidade.dia]: {}
            resultObj[unidade.dia][unidade.periodo] = false;
        }

    })

    await Promise.all(listaDePromises)
    return res.json(resultObj)
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

})

module.exports = router