class ExcelValidator{
    firstValidateTurmas(rowsTurmas,configProps){
        let erroPreenchido = false
        let erroHorarioI = false
        let erroHorarioF = false
        let erroDia = false
        let erroCreditos = false
        let res ={
            erro: false,
            msg: 'Tabela dentro dos padrões',
        }
        rowsTurmas.map(row =>{

            if (row['Nome da Disciplina'] == null) {erroPreenchido = true}
            if (row['Turma'] == null)  {erroPreenchido = true}
            if (row['Departamento de Oferta'] == null)  {erroPreenchido = true}
            if (row['Total de Alunos'] == null)  {erroPreenchido = true}
            if (row['Dia'] == null)  {erroPreenchido = true}
            if (row['Horário de Ínicio'] == null)  {erroPreenchido = true}
            if (row['Horário de Término'] == null)  {erroPreenchido = true}
            if (row['Créditos'] == null)  {erroPreenchido = true}
            if (!configProps.horarios.includes(row['Horário de Ínicio'])) {
                erroHorarioI = true
            }
            if (!configProps.horarios.includes(row['Horário de Término'])) {
                erroHorarioF = true
            }
            if (!configProps.creditos.includes(row['Créditos'])) {
                erroCreditos = true
            }
            let str = row['Dia']
            let dia = str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
            
            if (!configProps.dias.includes(dia)) {
                erroDia = true
                console.log(dia)
            }

        })
        if (erroPreenchido){
            res.erro = true 
            res.msg = 'A Tabela possui uma ou mais linhas com campos obrigatórios não preenchidos'
        }else if (erroHorarioF || erroHorarioI){
            res.erro = true 
            res.msg = 'Um ou mais horários estão fora do padrão da universidade'
        }else if (erroCreditos){
            res.erro = true 
            res.msg = 'Uma ou mais turmas estão com os créditos fora do padrão da universidade'
        }else if (erroDia){
            res.erro = true 
            res.msg = 'Uma ou mais turmas estão com o dia fora do padrão da universidade'
        }
        return res
    }


    mapColumnKeys(rowsTurmas,ano,semestre){
        let turmas = new Array()
        rowsTurmas.map(row =>{
            let str = row['Dia']
            let dia = str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()

            let turma = {
                idTurma: row['idTurma'],
                campus:row['Campus'],
                departamentoTurma:row['Departamento Recomendado'],
                codDisciplina:row['Código da Disciplina'],
                turma:row['Turma'],
                nomeDisciplina:row['Nome da Disciplina'],
                totalTurma:row['Total de Alunos'],
                departamentoOferta:row['Departamento de Oferta'],
                diaDaSemana:dia,
                horarioInicio:row['Horário de Ínicio'],
                horarioFim:row['Horário de Término'],
                alocadoChefia: false,
                creditosAula:row['Créditos'],
                docentes:row['Docentes'],
                ano:ano,
                semestre:semestre
            }
            turmas.push(turma)
        })
        return turmas
    }
}

export default new ExcelValidator();