function trataresultado(modelo,resultado){

    const turmasF1 = modelo.turmasf1 
    const turmasF12 = modelo.turmasf12
    const turmasF2 =  modelo.turmasf2
    const turmas = new Array().concat(turmasF1, turmasF12, turmasF2)
    const alocacoes = resultado.result.vars
    let alocacoesTratadas = new Array()

    Object.keys(alocacoes).map((alocacao)=>{
        let turma = parseInt(alocacao.slice(1,alocacao.indexOf("s"))) - 1
        let sala = parseInt(alocacao.slice(alocacao.indexOf("s")+1,alocacao.indexOf("h"))) - 1
        let horario = parseInt(alocacao.slice(alocacao.indexOf("h")+1)) 

        let alocacaoTratada = {
            turma: turmas[turma],
            sala: modelo.salas[sala],
            horarioSlot: horario,
        }
        alocacoesTratadas.push(alocacaoTratada)
    })

    return alocacoesTratadas

}

exports.trataresultado = trataresultado