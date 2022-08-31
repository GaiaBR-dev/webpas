let Sala = require('../models/sala.model')
let Turma = require('../models/turma.model')
let Distancia = require('../models/distancia.model')
let Config = require('../models/config.model')

async function dbtomodel(ano,semestre,periodo,diaDaSemana,user,predioAux,minAlunos){
    
    let modelo = {
        turmasf1: [],
        turmasf12: [],
        turmasf2: [],
        salas: [],
        distancias: []
    }

    const config = await Config.find({user:user._id}) 

    let horarioInicioF1 = config[0].horarios[periodo]['Início'].slot1
    let horarioFimF1 = config[0].horarios[periodo]['Fim'].slot1
    let horarioInicioF12 = config[0].horarios[periodo]['Início'].slot1
    let horarioFimF12 = config[0].horarios[periodo]['Fim'].slot2
    let horarioInicioF2 = config[0].horarios[periodo]['Início'].slot2
    let horarioFimF2 = config[0].horarios[periodo]['Fim'].slot2

    modelo.turmasf1 = await Turma.find({
        ano:ano,
        semestre:semestre,
        diaDaSemana:diaDaSemana,
        horarioInicio:horarioInicioF1,
        horarioFim:horarioFimF1,
        user:user._id,
        totalTurma: {$gte:minAlunos}
    })
    modelo.turmasf12 = await Turma.find({
        ano:ano,
        semestre:semestre,
        diaDaSemana:diaDaSemana,
        horarioInicio:horarioInicioF12,
        horarioFim:horarioFimF12,
        user:user._id,
        totalTurma: {$gte:minAlunos}
    })
    modelo.turmasf2 = await Turma.find({
        ano:ano,
        semestre:semestre,
        diaDaSemana:diaDaSemana,
        horarioInicio:horarioInicioF2,
        horarioFim:horarioFimF2,
        user:user._id,
        totalTurma: {$gte:minAlunos}
    })

    const salasDB = await Sala.find({user:user._id})
    salasDB.map(sala=>{
        let dispArray = sala.disponibilidade
        dispArray.map(disp=>{
            if (disp.dia === diaDaSemana && disp.periodo === periodo && disp.disponivel == true){
                modelo.salas.push(sala)
            }
        })
    })

    if (predioAux){
        for (let i = 0;i < config[0].numSalasAux ;i++){
            let salaAux = new Sala({
                predio:"predioAux",
                numeroSala: "Sala A" + i.toString(),
                capacidade: config[0].capSalasAux,
                user:user._id
            })
            modelo.salas.push(salaAux)
        }
    }

    const distanciasDb = await Distancia.find({user:user._id})
    modelo.distancias= distanciasDb.reduce((acc, cur) => {
        acc[cur.predio] = acc[cur.predio] ? acc[cur.predio] : {}
        acc[cur.predio] = {
            ...acc[cur.predio],
            [cur.departamento]: cur.valorDist
        }
        return acc
    }, {})

    if(predioAux) modelo.distancias = {...modelo.distancias,"predioAux":{}}

    return modelo

}

exports.dbtomodel = dbtomodel