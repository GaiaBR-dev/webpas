const router = require('express').Router()
let Resultado = require('../models/resultado.model')
const { dbtomodel } = require('../solver-logic/dbtomodel')
const { resolve } = require('../solver-logic/gerasalahorarioglpk')
const { trataresultado } = require('../solver-logic/trataresultado')

const turmasTestesF1 = [
    {
        nome:"Turma teste F1 - 1",
        departamentoOferta:"Dep1",
        departamentoTurma:"Dep2",
        totalTurma: 30,
    },
    {
        nome:"Turma teste F1 - 2",
        departamentoOferta:"Dep2",
        departamentoTurma:"Dep3",
        totalTurma: 40,
    }
]

const turmasTestesF12 = [
    {
        nome:"Turma teste F12 - 1",
        departamentoOferta:"Dep2",
        departamentoTurma:"Dep1",
        totalTurma: 30,
    },
    {
        nome:"Turma teste F12 - 2",
        departamentoOferta:"Dep3",
        departamentoTurma:"Dep2",
        totalTurma: 40,
    }
]

const turmasTestesF2 = [
    {
        nome:"Turma teste F2 - 1",
        departamentoOferta:"Dep2",
        departamentoTurma:"Dep1",
        totalTurma: 30,
    },
    {
        nome:"Turma teste F2 - 2",
        departamentoOferta:"Dep2",
        departamentoTurma:"Dep3",
        totalTurma: 40,
    }
]

const salasTeste = [
    {
        nome:"Sala 1",
        predio: "AT1",
        capacidade: 50
    },
    {
        nome:"Sala 2",
        predio: "AT2",
        capacidade: 50
    },
    {
        nome:"Sala 3",
        predio: "AT3",
        capacidade: 50
    },
    {
        nome:"Sala 4",
        predio: "AT1",
        capacidade: 50
    },
    {
        nome:"Sala 5",
        predio: "AT2",
        capacidade: 50
    },
]

const indiceDistancias = {
    AT1:{
        Dep1: 1,
        Dep2: 10,
        Dep3: 100
    },
    AT2:{
        Dep1: 2,
        Dep2: 4,
        Dep3: 8
    },
    AT3:{
        Dep1: 1000,
        Dep2: 10000,
        Dep3: 100000
    },
}


router.route('/glpk').get(async (req,res)=>{
    let modelo = {
        turmasf1 : turmasTestesF1,
        turmasf2 : turmasTestesF2,
        turmasf12: turmasTestesF12,
        distancias : indiceDistancias,
        salas: salasTeste
    }
    try {
        console.log(modelo)
        const produto = await resolve(modelo,11)
        res.status(200).json(produto)
    } catch (error) {
        res.status(400).json(error)
    }

})

router.route('/sabado').get(async(req,res)=>{
    const ano = 2019
    const semestre = 1
    const periodo = "Manhã"
    const diaDaSemana = "Sábado"
    const delta = 100
    const user = {
        _id: "62b72784c97b219609d36883"
    }

    try {
        const modelo = await dbtomodel(ano,semestre,periodo,diaDaSemana,user)
        const produto = await resolve(modelo,delta)
        const alocacoes = await trataresultado(modelo,produto)
        res.status(200).json(produto)
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
})

module.exports = router