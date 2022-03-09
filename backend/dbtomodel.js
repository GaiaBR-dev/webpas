let Sala = require('./models/sala.model')
let Turma = require('./models/turma.model')
let Distancia = require('./models/distancia.model')

async function dbtomodel(periodo,diaSemana){
    let horario1
    let horario2
    let horario3
    let salas
    if (periodo == "manha"){
        horario1 = 800
        horario2 = 1000
        horario3 = 1200
        salas = await Sala.find({"disponivelManha":true}).exec()
    }else if (periodo == "tarde"){
        horario1 = 1400
        horario2 = 1600
        horario3 = 1800
        salas = await Sala.find({"disponivelTarde":true}).exec()
    }else{
        horario1 = 1900
        horario2 = 2100
        horario3 = 2300
        salas = await Sala.find({"disponivelNoite":true}).exec()
    }
    
    const turmasf1 = await Turma.find({
        diaDaSemana:diaSemana,
        horarioInicio:horario1,
        horarioFim:horario2,
        creditoAula: 2, //           tratar dados, arrumar creditos nos dados de entrada
        alocadoChefia: 'f'
        }).exec()
    
    const turmasf12 = await Turma.find({
        diaDaSemana:diaSemana,
        horarioInicio:horario1,
        horarioFim:horario3,
        creditoAula: 4,
        alocadoChefia: 'f'
        }).exec()

    const turmasf2 = await Turma.find({
        diaDaSemana:diaSemana,
        horarioInicio:horario2,
        horarioFim:horario3,
        creditoAula: 2,
        alocadoChefia: 'f'
        }).exec()
    
    const distancias = await Distancia.find().exec()
         

    let result = {
        turmasf1: turmasf1,
        turmasf12: turmasf12,
        turmasf2: turmasf2,
        salas: salas,
        distancias: distancias
    }

    return result
}

exports.dbtomodel = dbtomodel