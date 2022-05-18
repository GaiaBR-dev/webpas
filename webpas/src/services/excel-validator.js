class ExcelValidator{
    firstValidateTurmas(rowsTurmas,configProps){
        let erroPreenchido = false
        let erroHorarioI = false
        let erroHorarioF = false
        let erroDia = false
        let erroCreditos = false
        let erroDuplicatas = false
        let res ={
            status:200,
            erro: false,
            response:{
                data:{
                    code: 0,
                    msg:'Tabela dentro dos padrões'
                }
            } 
        }
        let turmaDup =''
        let disciplinaDup =''
        
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

            let contadorDup = 0
            rowsTurmas.map(innerRow =>{
                if (row['Dia'] === innerRow['Dia'] &&
                    row['Horário de Ínicio'] === innerRow['Horário de Ínicio'] &&
                    row['Turma'] === innerRow['Turma'] &&
                    row['Nome da Disciplina'] === innerRow['Nome da Disciplina']
                ){
                    contadorDup++
                }
            })
            if (contadorDup>1){
                erroDuplicatas = true
                turmaDup = row['Turma']
                disciplinaDup = row['Nome da Disciplina']
            }
        
        })
        if (erroPreenchido){
            res.status = 400
            res.erro = true 
            res.response.data = {code:3,msg:'A Tabela possui uma ou mais linhas com campos obrigatórios não preenchidos'}
        }else if (erroHorarioF || erroHorarioI){
            res.status = 400
            res.erro = true 
            res.response.data = {code:3,msg:'Um ou mais horários estão fora do padrão da universidade'}
        }else if (erroCreditos){
            res.status = 400
            res.erro = true 
            res.response.data = {code:3,msg:'Uma ou mais turmas estão com os créditos fora do padrão da universidade'}
        }else if (erroDia){
            res.status = 400
            res.erro = true 
            res.response.data = {code:3,msg:'Uma ou mais turmas estão com o dia fora do padrão da universidade'}
        }else if (erroDuplicatas){
            res.status = 400
            res.erro = true
            res.response.data = {code:3,msg:`A turma "${turmaDup}" da disciplina "${disciplinaDup}" está duplicada na tabela`}
        }
        return res
    }


    mapColumnKeysTurmas(rowsTurmas,ano,semestre){
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

    firstValidateSalas(rowsSalas,config){
        let erroPreenchido = false
        let erroDuplicatas = false
        let erroPeriodos = false
        let res ={
            status:200,
            erro: false,
            response:{
                data:{
                    code: 0,
                    msg:'Tabela dentro dos padrões'
                }
            } 
        }
        let salaDup =''
        let predioDup =''

        if (config.periodos.includes('Manhã')){
            if(!'Disponivel de Manhã' in rowsSalas[0]){
                erroPeriodos = true
            }
        }
        if (config.periodos.includes('Tarde')){
            if(!'Disponivel de Tarde' in rowsSalas[0]){
                erroPeriodos = true
            }
        }
        if (config.periodos.includes('Noite')){
            if(!'Disponivel de Noite' in rowsSalas[0]){
                erroPeriodos = true
            }
        }
        if (erroPeriodos){
            res.status = 400
            res.erro = true 
            res.response.data = {code:3,msg:'O número de períodos cadastrados no sistema não correspode às colunas da tabela'}
            return res
        }

        rowsSalas.map(row =>{

            if (row['Predio'] == null) {erroPreenchido = true}
            if (row['Sala'] == null)  {erroPreenchido = true}
            if (row['Capacidade'] == null)  {erroPreenchido = true}
            
            if (config.periodos.includes('Manhã')){
                if(row['Disponivel de Manhã'] == null){
                    erroPreenchido = true
                }
            }
            if (config.periodos.includes('Tarde')){
                if(row['Disponivel de Tarde'] == null){
                    erroPreenchido = true
                }
            }
            if (config.periodos.includes('Noite')){
                if(row['Disponivel de Noite'] == null){
                    erroPreenchido = true
                }
            }

            let contadorDup = 0
            rowsSalas.map(innerRow =>{
                if (row['Predio'] === innerRow['Predio'] &&
                    row['Sala'] === innerRow['Sala'] 
                ){
                    contadorDup++
                }
            })
            if (contadorDup>1){
                erroDuplicatas = true
                salaDup = row['Sala']
                predioDup = row['Predio']
            }
        
        })

        if (erroPreenchido){
            res.status = 400
            res.erro = true 
            res.response.data = {code:3,msg:'A Tabela possui uma ou mais linhas com campos obrigatórios não preenchidos'}
        }else if (erroDuplicatas){
            res.status = 400
            res.erro = true
            res.response.data = {code:3,msg:`A sala "${salaDup}" do prédio "${predioDup}" está duplicada na tabela`}
        }
        return res
    }

    mapColumnKeysSalas(rowsSalas,config){
        const salas = rowsSalas.map(row =>{

            let sala = {
                predio: row['Predio'],
                numeroSala: row['Sala'],
                capacidade: row['Capacidade']
            }
            let disponibilidade = []
            config.dias.map(dia=>{
                if (config.periodos.includes('Manhã')){
                    let dispUnitM = {
                        dia: dia,
                        periodo: 'Manhã',
                        disponivel: row['Disponvel de Manhã'] == 1 
                    }
                    disponibilidade.push(dispUnitM)
                }
                if (config.periodos.includes('Tarde')){
                    let dispUnitT = {
                        dia: dia,
                        periodo: 'Tarde',
                        disponivel: row['Disponivel de Tarde'] == 1
                    }
                    disponibilidade.push(dispUnitT)
                }
                if (config.periodos.includes('Noite')){
                    let dispUnitN = {
                        dia: dia,
                        periodo: 'Noite',
                        disponivel: row['Disponivel de Noite'] == 1
                    }
                    disponibilidade.push(dispUnitN)
                }
            })
            sala.disponibilidade  = disponibilidade
            return sala
        })
        return salas
    }
}

export default new ExcelValidator();