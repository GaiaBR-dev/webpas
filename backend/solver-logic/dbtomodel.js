let Sala = require('../models/sala.model')
let Turma = require('../models/turma.model')
let Distancia = require('../models/distancia.model')
let Config = require('../models/config.model')

async function dbtomodel(ano,semestre,periodo,diaDaSemana){
    
    let modelo = {
        turmasf1: [],
        turmasf12: [],
        turmasf2: [],
        salas: [],
        distancias: []
    }

    const config = await Config.find({usuario:"Eu"}) // Receber usuário como parametro para buscar config depois

    let horarioInicioF1 = config[0].horarios[periodo]['Ínicio'].slot1
    let horarioFimF1 = config[0].horarios[periodo]['Fim'].slot1
    let horarioInicioF12 = config[0].horarios[periodo]['Ínicio'].slot1
    let horarioFimF12 = config[0].horarios[periodo]['Fim'].slot2
    let horarioInicioF2 = config[0].horarios[periodo]['Ínicio'].slot2
    let horarioFimF2 = config[0].horarios[periodo]['Fim'].slot2

    modelo.turmasf1 = await Turma.find({
        ano:ano,
        semestre:semestre,
        diaDaSemana:diaDaSemana,
        horarioInicio:horarioInicioF1,
        horarioFim:horarioFimF1,
    })
    modelo.turmasf12 = await Turma.find({
        ano:ano,
        semestre:semestre,
        diaDaSemana:diaDaSemana,
        horarioInicio:horarioInicioF12,
        horarioFim:horarioFimF12
    })
    modelo.turmasf2 = await Turma.find({
        ano:ano,
        semestre:semestre,
        diaDaSemana:diaDaSemana,
        horarioInicio:horarioInicioF2,
        horarioFim:horarioFimF2
    })

    const salasDB = await Sala.find()
    salasDB.map(sala=>{
        let dispArray = sala.disponibilidade
        dispArray.map(disp=>{
            if (disp.dia === diaDaSemana && disp.periodo === periodo && disp.disponivel == true){
                modelo.salas.push(sala)
            }
        })
    })

    const distanciasDb = await Distancia.find()
    modelo.distancias= distanciasDb.reduce((acc, cur) => {
        acc[cur.predio] = acc[cur.predio] ? acc[cur.predio] : {}
        acc[cur.predio] = {
            ...acc[cur.predio],
            [cur.departamento]: cur.valorDist
        }
        return acc
    }, {})

    return modelo

}

exports.dbtomodel = dbtomodel