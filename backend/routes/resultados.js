const router = require('express').Router()
let Resultado = require('../models/resultado.model')
const { dbtomodel } = require('../solver-logic/dbtomodel')
const { resolve } = require('../solver-logic/gerasalahorarioglpk')
const { trataresultado } = require('../solver-logic/trataresultado')

const alocationRemove = (arr,removeArray) => { 
    let arrayTemp = []
    
    arr.map(element=>{
        let remove = false
        removeArray.map(removeObj=>{
            if (removeObj.sala == element.sala && removeObj.turma == element.turma){
                remove = true
            }
        })
        if (!remove){
            arrayTemp.push(element)
        }
    })
    return arrayTemp
}

const alocationInsert = (arr,insertArray)=>{
    let arrayTemp = arr
    insertArray.map(element=>{
        arr.push(element)
    })
    return arrayTemp
}

const alocationSort = (a,b) =>{
    if (a.horarioSlot < b.horarioSlot){
        return -1
    }
    if (a.horarioSlot > b.horarioSlot){
        return 1
    }
    return 0
}

router.route('/').get((req,res)=>{
    const {user} = req
    Resultado.find({user:user._id})
        .then(resultados => res.json(resultados))
        .catch(err => res.status(400).json('Error: '+ err))
})

router.route('/:ano/:semestre').get((req,res)=>{
    const {user} = req
    Resultado.find({ano:req.params.ano,semestre:req.params.semestre,user:user._id})
        .then(resultados=>res.json(resultados))
        .catch(err => res.status(400).json(err))
})

router.route('/:ano/:semestre/:dia/:periodo').get((req,res)=>{
    const {user} = req
    Resultado.find({
        ano:req.params.ano,
        semestre:req.params.semestre,
        diaDaSemana:req.params.dia,
        periodo:req.params.periodo,
        user:user._id
    })
        .then(resultados=>res.json(resultados))
        .catch(err => res.status(400).json(err))
})

router.route('/:ano/:semestre/:dia').get((req,res)=>{
    const {user} = req
    Resultado.find({
        ano:req.params.ano,
        semestre:req.params.semestre,
        diaDaSemana:req.params.dia,
        user:user._id
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
    const {user} = req

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
    const delta = parseInt(req.body.delta)
    const lista = req.body.lista
    const predioAux = req.body.predioAux
    const minAlunos = req.body.minAlunos
    const mipGap = req.body.mipGap
    const tmLim = req.body.tmLim
    const {user} = req
    
    let resultObj = {}

    const listaDePromises = lista.map(async (unidade)=>{
        try {
            const modelo = await dbtomodel(ano,semestre,unidade.periodo,unidade.dia,user,predioAux,minAlunos)
            const produto = await resolve(modelo,delta,mipGap,tmLim)
            const alocacoes = await trataresultado(modelo,produto)

            resultObj[unidade.dia] = resultObj[unidade.dia]? resultObj[unidade.dia]: {}
            if (produto.result.status == 4 ){
                resultObj[unidade.dia][unidade.periodo] = false;
            }else if (produto.result.status == 5){
                resultObj[unidade.dia][unidade.periodo] = true;
            }

            return Resultado.findOneAndUpdate({
                user:user._id,
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
    console.log ("Otimização concluida")
    return res.json(resultObj)
})



router.route('/id/:id').get((req,res)=>{
    Resultado.findById(req.params.id)
        .then(resultado => res.json(resultado))
        .catch(err => res.status(400).json('Error: '+ err))
})


router.route('/:id').delete((req,res)=>{
    Resultado.findByIdAndDelete(req.params.id)
        .then(()=> res.json('Resultado deletado'))
        .catch(err => res.status(400).json('Error: '+ err))
})

router.route('/update/:id').post((req,res)=>{
    const {alocacaoOrigem,alocacaoDestino,alocacaoAux,salaOrigem,salaDestino} = req.body

    Resultado.findById(req.params.id)
        .then(resultado=>{
            let aux = {}
            let origem = []
            let destino = []
            
            if (alocacaoOrigem != undefined){
                origem = resultado.alocacoes.filter(alocacao=>{
                    return alocacao.sala._id == alocacaoOrigem.sala._id &&
                           alocacao.turma._id == alocacaoOrigem.turma._id
                }).sort(alocationSort)
            }
            
            if (alocacaoDestino != undefined){
                destino = resultado.alocacoes.filter(alocacao=>{
                    return alocacao.sala._id == alocacaoDestino.sala._id &&
                           alocacao.turma._id == alocacaoDestino.turma._id
                }).sort(alocationSort)
            }
            
            let removeArray = origem.concat(destino)
            
            if (alocacaoAux.sala){
                aux = resultado.alocacoes.find(alocacao=>{
                    return alocacao.sala._id == alocacaoAux.sala._id &&
                           alocacao.turma._id == alocacaoAux.turma._id
                })
                removeArray.push(aux)
            }
            let newAlocation = alocationRemove(resultado.alocacoes,removeArray)

            origem.map(aloc=>{
                aloc.sala = salaDestino
            })

            destino.map(aloc=>{
                aloc.sala = salaOrigem
            })
            let insertArray = origem.concat(destino)

            if (alocacaoAux.sala && origem.length > destino.length){
                aux.sala = salaOrigem
                insertArray.push(aux)
            }else if (alocacaoAux.sala && origem.length < destino.length){
                aux.sala = salaDestino
                insertArray.push(aux)
            }
            newAlocation = alocationInsert(newAlocation,insertArray)
            resultado.alocacoes = newAlocation

            resultado.save()
               .then(()=>{
                  res.json("Troca Realizada")
               }).catch(err=>{
                  console.log(err)
                    res.status(400).json(err)})
        })
        .catch(err=>{
            console.log(err)
            res.status(400).json(err)})
})

module.exports = router