const router = require('express').Router()
const { xlstojson } = require('../xlstojson')
let Turma = require('../models/turma.model')
const {protect} = require("../middleware/auth")

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

router.route('/').get(protect,(req,res)=>{
    const user = req.user
    Turma.find({user:user._id})
        .then(turmas => res.json(turmas))
        .catch(err => res.status(400).json(err))
})

router.route('/d/').get(protect,(req,res)=>{
    const user = req.user
    Turma.find({user:user._id}).distinct('departamentoOferta')
        .then(departamentosOferta=>{
            Turma.find({user:user._id}).distinct('departamentoTurma')
                .then(departamentosTurma =>{
                    const departamentos = arrayUnique(departamentosOferta.concat(departamentosTurma))
                    res.json(departamentos)
                }).catch(err => res.status(400).json(err))
        }).catch(err => res.status(400).json(err))
})

router.route('/:ano/:semestre').get(protect,(req,res)=>{
    const user = req.user
    Turma.find({ano:req.params.ano,semestre:req.params.semestre,user:user._id})
        .then(turmas => res.json(turmas))
        .catch(err => res.json(err))
})

router.route('/dep/').get(protect,(req,res)=>{
    const user = req.user
    Turma.find({user:user._id}).distinct('departamentoOferta')
        .then(turmas => res.json(turmas))
        .catch(err => res.status(400).json(err))
})

router.route('/add').post(protect,(req,res) =>{

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
    const user = req.user

    Turma.find({turma,nomeDisciplina,diaDaSemana,horarioInicio,ano,semestre,user:user._id})
        .then(turmas =>{
            if (turmas.length > 0){
                let err = {code:1,msg:"Esta turma ja está cadastrada"}
                res.status(400).json(err)
            }else{
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
                    semestre,
                    user:user._id
                })
                novaTurma.save()
                    .then(()=> res.json('Turma adicionada'))
                    .catch(err =>{
                        res.status(400).json(err)
                    })
            }
        }).catch(err =>{
            res.status(400).json(err)
        })
})

router.route('/:id').get(protect,(req,res)=>{
    Turma.findById(req.params.id)
        .then(turma => res.json(turma))
        .catch(err => res.status(400).json(err))
})

router.route('/arquivoturma').post(protect,async (req,res) =>{ 
    const novasTurmas = req.body.novasTurmas
    Turma.insertMany(novasTurmas,{ordered:false})
        .then(()=> res.json('Turmas adicionadas'))
        .catch(err =>{
            res.status(400).json(err)})  
})

router.route('/delete/:id').delete(protect,(req,res)=>{
    Turma.findByIdAndDelete(req.params.id)
        .then(()=> res.json('Turma deletada'))
        .catch(err => res.status(400).json(err))
})

router.route('/deleteMany').post(protect,(req,res)=>{
    const turmasIds = req.body.turmasID
    Turma.deleteMany({_id:{$in:turmasIds}})
        .then(()=> res.json('Turmas deletadas'))
        .catch(err => res.status(400).json(err))
})

router.route('/update/:id').post(protect,(req,res)=>{
    const turma = req.body.turma
    const nomeDisciplina = req.body.nomeDisciplina
    const diaDaSemana = req.body.diaDaSemana
    const horarioInicio = req.body.horarioInicio
    const ano = req.body.ano
    const semestre = req.body.semestre
    const user = req.user

    Turma.find({turma,nomeDisciplina,diaDaSemana,horarioInicio,ano,semestre,user:user._id})
        .then(turmas =>{
            if (turmas.length > 1){
                let err = {code:1,msg:"Esta turma ja está cadastrada"}
                res.status(400).json(err)
            }else if(turmas.length == 0 || req.params.id == turmas[0]._id){
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
                                res.status(400).json(err)
                            })
                    })
                    .catch(err =>{
                        res.status(400).json(err)
                    })
            }else{
                let err = {code:1,msg:"Esta turma ja está cadastrada"}
                res.status(400).json(err)
            }
        }).catch(err =>{
            res.status(400).json(err)
        })
    
    
})

module.exports = router