const DEPARA_SIGA = {
    "BCI":"DCI",
    "Biotec":"DB",
    "CB":"DB",
    "CBL":"DB",
    "CC":"DC",
    "CSo":"DCSo",
    "EC":"DC",
    "ECiv":"DECiv",
    "EE":"DEE",
    "EEspL":"DPsi",
    "EF":"DEFMH",
    "EFi":"DF",
    "EFL":"DEFMH",
    "EMa":"DEMa",
    "EMec":"DEMec",
    "Enf":"DEnf",
    "EP":"DEP",
    "EQ":"DEQ",
    "Es":"Des",
    "F":"DF",
    "Fil":"DFIL",
    "Fisio":"DFisio",
    "FLN":"DF",
    "GAAm":"DCAm",
    "Gero":"DGero",
    "IS":"DAC",
    "Ling":"DL",
    "LLE":"DL",
    "LLI":"DL",
    "M":"DM",
    "Med":"DMed",
    "MN":"DM",
    "MusL":"DAC",
    "PedL":"DEd",
    "PedLN":"DEd",
    "Psi":"DPsi",
    "Q":"DQ",
    "QL":"DQ",
    "TILSP":"DPsi",
    "TO":"DTO", 
}

class ExcelValidator{
    
    firstValidateTurmas(rowsTurmas,configProps,horariosInicio,horariosFim){
        let res ={
            status:200,
            erro: false,
            response:{
                data:{
                    code: 0,
                    msg:'Tabela dentro dos padrões'
                }
            },
            listaErros:[]
        }
        rowsTurmas.map(row =>{
            let erro = {}
            row.erro = false
            if (row['Nome da Disciplina'] == null) {
                row.erro = true
                erro.turma  = row
                erro.tipo = "O nome da disciplina é um campo obrigátorio e deve ser preenchido"
                res.listaErros.push(erro)
            }
            if (row['Turma'] == null) {
                row.erro = true
                erro.turma  = row
                erro.tipo = "A turma é um campo obrigátorio e deve ser preenchido"
                res.listaErros.push(erro)
            }
            if (row['Departamento de Oferta'] == null)  {
                row.erro = true
                erro.turma  = row
                erro.tipo = "O departamento de oferta é um campo obrigátorio e deve ser preenchido"
                res.listaErros.push(erro)
            }
            if (row['Total de Alunos'] == null)  {
                row.erro = true
                erro.turma  = row
                erro.tipo = "O total de alunos é um campo obrigátorio e deve ser preenchido"
                res.listaErros.push(erro)
            }
            if (isNaN(row['Total de Alunos']))  {
                row.erro = true
                erro.turma  = row
                erro.tipo = "O total de alunos deve ser preenchido com um número"
                res.listaErros.push(erro) 
            }
            if (row['Dia'] == null)  {
                row.erro = true
                erro.turma  = row
                erro.tipo = "O dia em que a turma é ministrada é um campo obrigátorio e deve ser preenchido"
                res.listaErros.push(erro)
            }
            if (row['Horário de Início'] == null)  {
                row.erro = true
                erro.turma  = row
                erro.tipo = "O horário de início da disciplina é um campo obrigátorio e deve ser preenchido"
                res.listaErros.push(erro)
            
            }
            if (row['Horário de Término'] == null)  {
                row.erro = true
                erro.turma  = row
                erro.tipo = "O horário de término da disciplina é um campo obrigátorio e deve ser preenchido"
                res.listaErros.push(erro)
            }
            if (!horariosInicio.includes(row['Horário de Início'].toString())) {
                row.erro = true
                erro.turma  = row
                erro.tipo = "O horário de início fornecido está fora dos padrões da universidade"
                res.listaErros.push(erro)
            }
            row['Horário de Término'] = row['Horário de Término'] ? row['Horário de Término'] : ""
            if (!horariosFim.includes(row['Horário de Término'].toString())) {
                row.erro = true
                erro.turma  = row
                erro.tipo = "O horário de término fornecido está fora dos padrões da universidade"
                res.listaErros.push(erro)
            }
            let str = row['Dia'] ? row['Dia'] : ""
            let dia = str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
            
            if (!configProps.dias.includes(dia)) {
                row.erro = true
                erro.turma  = row
                erro.tipo = "O dia fornecido está fora dos padrões da universidade"
                res.listaErros.push(erro)
            }

            let contadorDup = 0
            rowsTurmas.map(innerRow =>{
                if (row['Dia'] === innerRow['Dia'] &&
                    row['Horário de Início'] === innerRow['Horário de Início'] &&
                    row['Turma'] === innerRow['Turma'] &&
                    row['Nome da Disciplina'] === innerRow['Nome da Disciplina']
                ){
                    contadorDup++
                }
            })
            if (contadorDup>1){
                row.erro = true
                erro.turma  = row
                erro.tipo = "A turma está duplicada na tabela"
                res.listaErros.push(erro)
            }
        
        })
        if (res.listaErros.length > 0){
            res.status = 400
            res.erro = true 
            res.response.data = {code:3,msg:'A tabela inserida possui linhas com erros que não serão inseridas ao Banco de Dados. As demais linhas serão adicionadas normalmente'}
        }
        return res
    }

    tratarDadosTurmasSIGA(rowsTurmas){
        rowsTurmas.map(row=>{
            // Padroniza os horários
            row['hora_inicio'] = row['hora_inicio'] ? row['hora_inicio'] : "" 
            if (row['hora_inicio'].toString() != ""){
                if (parseInt(row['hora_inicio']) >= 700 && parseInt(row['hora_inicio']) <= 900){
                    row['hora_inicio'] = "800"
                }else if (parseInt(row['hora_inicio']) >= 1000 && parseInt(row['hora_inicio']) < 1200){
                    row['hora_inicio'] = "1000"
                }else if (parseInt(row['hora_inicio']) > 1300 && parseInt(row['hora_inicio']) < 1500){
                    row['hora_inicio'] = "1400"
                }else if (parseInt(row['hora_inicio']) >= 1600 && parseInt(row['hora_inicio']) < 1800){
                    row['hora_inicio'] = "1600"
                }else if (parseInt(row['hora_inicio']) >= 1800 && parseInt(row['hora_inicio']) < 2100){
                    row['hora_inicio'] = "1900"
                }else if (parseInt(row['hora_inicio']) >= 2100 && parseInt(row['hora_inicio']) < 2300){
                    row['hora_inicio'] = "2100"
                }else{
                    row.considerar = false
                }   
            }
            //Determina o departamento recomendado baseado no curso indicado
            row['cursos_indicados'] = row['cursos_indicados'] ? row['cursos_indicados'] : "" 
            if(row['cursos_indicados'].toString() != ""){
                let depString = row['cursos_indicados'].toString().trim()
                let depIndicado = depString.slice(0,depString.indexOf("-")-1)
                if (depIndicado.includes("/")){
                    depIndicado = depIndicado.slice(0,depIndicado.indexOf("/"))
                }
                row.departamentoTurma = DEPARA_SIGA[depIndicado]
            }

            row['juncao_id'] = row['juncao_id'] ? row['juncao_id'] : ""
            rowsTurmas.map(innerRow=>{

                //Verifica se as turmas precisam ser unificadas baseadas na coluna juncao_id
                if (row['cod_discip'] == innerRow['cod_discip'] && 
                    row['juncao_id'] == innerRow['juncao_id'] && 
                    row['juncao_id'] != "" && 
                    row['horario_id'] != innerRow['horario_id'] &&
                    !row.hasOwnProperty('considerar')                          
                    ){
                        row['solicitacoes_deferidas'] = row['solicitacoes_deferidas'] + innerRow['solicitacoes_deferidas']
                        innerRow.considerar = false 
                }
                //Verifica se as turmas precisam ser unificadas baseadas no horário em sequencia
                if (row['cod_discip'] == innerRow['cod_discip'] &&
                    parseInt(row['cred_aula']) + parseInt(row['cred_pratico']) > 2 && //talvez não precise
                    row['hora_fim'] == innerRow['hora_inicio']  &&
                    row['ministrantes'] == innerRow['ministrantes']&&
                    row['dia'] == innerRow['dia'] &&
                    row['turma'] == innerRow['turma']
                    ){
                        row['hora_fim'] = innerRow['hora_fim']
                        innerRow.considerar = false
                }   
            })
            row['alocado_chefia'] = row['alocado_chefia'] ? row['alocado_chefia'] : "" 
            if (row['alocado_chefia'].toString() == "t") {row.considerar=false}
        })
        return true
    }

    mapKeysTurmasSIGA(rowTurmas){
        let dadosTratados = []
        rowTurmas.map(row=>{
            if(!row.hasOwnProperty('considerar')){
                let turma = {
                    'idTurma':row['horario_id'],
                    'Campus':row['campus'],
                    'Departamento Recomendado':row.departamentoTurma,
                    'Código da Disciplina': row['cod_discip'],
                    'Turma':row['turma'],
                    'Nome da Disciplina':row['nome'],
                    'Total de Alunos':row['solicitacoes_deferidas'],
                    'Departamento de Oferta':row['departamento'],
                    "Dia":row['dia'],
                    'Horário de Início':row['hora_inicio'],
                    'Horário de Término':row['hora_fim'],
                    'Créditos': parseInt(row['cred_aula']) + parseInt(row['cred_pratico']),
                    'Docentes': row['ministrantes'],

                }
                dadosTratados.push(turma)
            }
        })
        return dadosTratados
    }

    mapColumnKeysTurmas(rowsTurmas,ano,semestre,user){
        let turmas = new Array()
        rowsTurmas.map(row =>{
            let str = row['Dia']
            let dia = str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()

            let turma = {
                idTurma: row['idTurma'],
                campus:row['Campus'],
                departamentoTurma:row['Departamento Recomendado'] !== '' ?  row['Departamento Recomendado'] : row['Departamento de Oferta'],
                codDisciplina:row['Código da Disciplina'],
                turma:row['Turma'],
                nomeDisciplina:row['Nome da Disciplina'],
                totalTurma:row['Total de Alunos'],
                departamentoOferta:row['Departamento de Oferta'],
                diaDaSemana:dia,
                horarioInicio:row['Horário de Início'],
                horarioFim:row['Horário de Término'],
                alocadoChefia: false,
                creditosAula:row['Créditos'],
                docentes:row['Docentes'],
                ano,
                semestre,
                user,
            }
            turmas.push(turma)
        })
        return turmas
    }

    firstValidateSalas(rowsSalas,config){
        let erroPreenchido = false
        let erroDuplicatas = false
        let erroPeriodos = false
        let erroTipo = false
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
                }else if(!(row['Disponivel de Manhã'] == 1 || row['Disponivel de Manhã'] == 0 )){
                    erroTipo = true
                }
            }
            if (config.periodos.includes('Tarde')){
                if(row['Disponivel de Tarde'] == null){
                    erroPreenchido = true
                }else if(!(row['Disponivel de Tarde'] == 1 || row['Disponivel de Tarde'] == 0 )){
                    erroTipo = true
                }
            }
            if (config.periodos.includes('Noite')){
                if(row['Disponivel de Noite'] == null){
                    erroPreenchido = true
                }else if(!(row['Disponivel de Noite'] == 1 || row['Disponivel de Noite'] == 0 )){
                    erroTipo = true
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
        }else if (erroTipo){
            res.status = 400
            res.erro = true
            res.response.data = {code:3,msg:`A disponibilidade deve ser preenchida com 1 para disponível e 0 para indísponível no período`}
        }
        
        return res
    }

    mapColumnKeysSalas(rowsSalas,config,user){
        const salas = rowsSalas.map(row =>{

            let sala = {
                predio: row['Predio'],
                numeroSala: row['Sala'],
                capacidade: row['Capacidade'],
                user:user._id
            }
            let disponibilidade = []
            config.dias.map(dia=>{
                if (config.periodos.includes('Manhã')){
                    let dispUnitM = {
                        dia: dia,
                        periodo: 'Manhã',
                        disponivel: row['Disponivel de Manhã'] == 1 
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

    firstValidateDistancias(rowsDistancias){
        let erroPreenchido = false
        let erroDuplicatas = false
        let erroTipo = false
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
        let predioDup =''
        let departamentoDup =''
        let predioErroTipo = ''
        let departamentoErroTipo = ''

        rowsDistancias.map(row =>{

            if (row['Prédio'] == null) {erroPreenchido = true}
            if (row['Departamento'] == null)  {erroPreenchido = true}
            if (row['Distância'] == null)  {erroPreenchido = true}

            if(isNaN(row['Distância'])){
                predioErroTipo = row['Prédio']
                departamentoErroTipo = row['Departamento']
                erroTipo = true
            }

            let contadorDup = 0
            rowsDistancias.map(innerRow =>{
                if (row['Prédio'] === innerRow['Prédio'] &&
                    row['Departamento'] === innerRow['Departamento'] 
                ){
                    contadorDup++
                }
            })
            if (contadorDup>1){
                erroDuplicatas = true
                departamentoDup = row['Departamento']
                predioDup = row['Prédio']
            }
        
        })

        if (erroPreenchido){
            res.status = 400
            res.erro = true 
            res.response.data = {code:3,msg:'A Tabela possui uma ou mais linhas com campos obrigatórios não preenchidos'}
        }else if (erroDuplicatas){
            res.status = 400
            res.erro = true
            res.response.data = {code:3,msg:`A distância do prédio "${predioDup}" para o departamento "${departamentoDup}" está duplicada na tabela`}
        }else if (erroTipo){
            res.status = 400
            res.erro = true
            res.response.data = {code:3,msg:`A distância do prédio "${predioErroTipo}" para o departamento "${departamentoErroTipo}" não está em formato númerico`}
        }
        return res
    }

    mapColumnKeysDistancias(rowsDistancias){
        const distancias = rowsDistancias.map(row =>{
            let distancia = {
                predio: row['Prédio'],
                departamento: row['Departamento'],
                valorDist: row['Distância']
            }
            return distancia
        })
        return distancias
    }
}

export default new ExcelValidator();