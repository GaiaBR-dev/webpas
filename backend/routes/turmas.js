const router = require('express').Router()
const { xlstojson } = require('../xlstojson')
let Turma = require('../models/turma.model')

router.route('/').get((req,res)=>{ // filtros e classificação no cliente ? divisão em paginas ?
    Turma.find()
        .then(turmas => res.json(turmas))
        .catch(err => res.status(400).json('Error: '+ err))
})

router.route('/:ano/:semestre').get((req,res)=>{
    console.log('ano : '+ req.params.ano + '  semestre: ' + req.params.semestre)
    Turma.find({ano:req.params.ano,semestre:req.params.semestre})
        .then(turmas => res.json(turmas))
        .catch(err => res.json(err))
})

router.route('/dep/').get((req,res)=>{ 
    Turma.find().distinct('departamentoOferta')
        .then(turmas => res.json(turmas))
        .catch(err => res.status(400).json('Error: '+ err))
})

router.route('/add').post((req,res) =>{

    const idTurma = req.body.idTurma
    const campus = req.body.campus
    const departamentoTurma = req.body.departamentoTurma
    const codDisciplina = req.body.codDisciplina
    const turma = req.body.turma
    const nomeDisciplina = req.body.nomeDisciplina
    const totalTurma = req.body.totalTurma
    const departamentoOferta = req.body.departamentoOferta
    const diaDaSemana = req.body.diaDaSemana
    const horarioInicio = req.body.horarioInicio
    const horarioFim = req.body.horarioFim
    const creditosAula = req.body.creditosAula
    const creditosPratico = req.body.creditosPratico
    const docente = req.body.docente
    const ano = req.body.ano
    const semestre = req.body.semestre

    const novaTurma = new Turma({
        idTurma,
        campus,
        departamentoTurma,
        codDisciplina,
        turma,
        nomeDisciplina,
        totalTurma,
        departamentoOferta,
        diaDaSemana,
        horarioInicio,
        horarioFim,
        creditosAula,
        creditosPratico,
        docente,
        ano,
        semestre
    })
    novaTurma.save()
        .then(()=> res.json('Turma adicionada'))
        .catch(err =>{
            console.log(err)
            res.status(400).json('Error: '+ err)
        })
})

router.route('/:id').get((req,res)=>{
    Turma.findById(req.params.id)
        .then(turma => res.json(turma))
        .catch(err => res.status(400).json('Error: '+ err))
})

router.route('/arquivoturma').post((req,res) =>{ // salvar a partir de arquivo vindo do cliente 
    const novasTurmas = req.body.novasTurmas

    Turma.insertMany(novasTurmas)
        .then(()=> res.json('Turmas adicionadas'))
        .catch(err =>{
            res.json(err)})  
})

router.route('/insereturmas321').post((req, res) => {// Hard Coded - >deletar depois
    const result = xlstojson()
    const ano = req.body.ano
    const semestre = req.body.semestre

    const novasTurmas = result.Info.map(turma =>({...turma,ano:ano,semestre:semestre}))

    Turma.insertMany(novasTurmas)
        .then(()=> res.json('Turmas adicionadas'))
        .catch(err =>res.status(400).json('Error: '+ err))
    
})

router.route('/:id').delete((req,res)=>{
    Turma.findByIdAndDelete(req.params.id)
        .then(()=> res.json('Turma deletada'))
        .catch(err => res.status(400).json('Error: '+ err))
})
//Delete many a partir de filtros

router.route('/update/:id').post((req,res)=>{
    Turma.findById(req.params.id)
        .then(turma=> {
            turma.idTurma = req.body.idTurma
            turma.campus = req.body.campus
            turma.departamentoTurma = req.body.departamentoTurma
            turma.codDisciplina = req.body.codDisciplina
            turma.turma = req.body.turma
            turma.nomeDisciplina = req.body.nomeDisciplina
            turma.totalTurma = req.body.totalTurma
            turma.departamentoOferta = req.body.departamentoOferta
            turma.diaDaSemana = req.body.diaDaSemana
            turma.horarioInicio = req.body.horarioInicio
            turma.horarioFim = req.body.horarioFim
            turma.creditoAula = req.body.creditoAula
            turma.creditoPratico = req.body.creditoPratico
            turma.docentes = req.body.docentes
            turma.ano = req.body.ano
            turma.semestre = req.body.semestre

            turma.save()
                .then(()=> res.json('Turma atualizada'))
                .catch(err =>{
                    console.log(err)
                    res.status(400).json('Error: '+ err)
                })
        })
        .catch(err =>{
            console.log(err)
            res.status(400).json('Error: '+ err)
        })
})

module.exports = router