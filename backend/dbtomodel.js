let Sala = require('./models/sala.model')
let Turma = require('./models/turma.model')
let Distancia = require('./models/distancia.model')

const configTemp={
    horarios:{
        'Manhã':{
            'Ínicio':['800','1000'],
            'Fim':['1000','1200']
        
        },
        'Tarde':{
            'Ínicio':['1400','1600'],
            'Fim':['1600','1800']
        },
        'Noite':{
            'Ínicio':['1900','2100'],
            'Fim':['2100','2300']
        }
    },
    dias:['Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
    creditos:[10,6,5,4,3,2,1,0],
    anos:[2019,2020,2021,2022,2023],
    semestres:[1,2],
    periodos:['Manhã','Tarde','Noite']
}

async function dbtomodel(ano,semestre,periodo,diaDaSemana){
    
    let modelo = {
        turmasf1: [],
        turmasf12: [],
        turmasf2: [],
        salas: [],
        distancias: []
    }

    let horarioInicioF1 = configTemp.horarios[periodo]['Ínicio'][0]
    let horarioFimF1 = configTemp.horarios[periodo]['Fim'][0]
    let horarioInicioF12 = configTemp.horarios[periodo]['Ínicio'][0]
    let horarioFimF12 = configTemp.horarios[periodo]['Fim'][1]
    let horarioInicioF2 = configTemp.horarios[periodo]['Ínicio'][1]
    let horarioFimF2 = configTemp.horarios[periodo]['Fim'][1]

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