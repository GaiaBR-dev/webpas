import React from "react";
import { Typography, Grid, Box,Divider } from "@mui/material";



const AjudaTurma = props =>{
    return (
        <>
            <Typography variant="h6">
                Ajuda
            </Typography>
            <Divider/>
            <br/>
            <Typography variant="h6" fontSize="18px">
                Barra de Ferramentas
            </Typography>
            <br/>
            <Typography fontWeight={450} component="p" display="inline">
                Botão Arquivo: &nbsp;
            </Typography>
            <Typography component="p" display="inline">
                Abre o formulário de importação de Turmas por arquivo. O arquivo deve estar no formato de uma planilha do Microsoft Excel (xlsx). 
                Deve-se escolher para qual ano e semestre está se cadastrando as turmas através dos controles no formulário.
                É necessário que os dados estejam em uma aba denominada "Turmas" para que sejam lidos.
                Caso hajam turmas com erros no arquivo, estes serão mostrados na aba Erros na barra de ferramenta.
                Logo abaixo há uma caixa de seleção que deve ser marcada caso se deseje importar dados no formato do SIGA. 
                Caso essa opção não seja marcada os dados deverão estar em um formato padronizado. 
                A diferença entre os dois formatos está no rótulo dado a cada informação, que será lido da primeira linha da planilha no Excel, que devem corresponder exatamente aos nomes abaixo:
            </Typography>
            <br/>
            <br/>
            <Typography component="p" display="block">
                Formato padrão: idTurma, Nome da Disciplina, Turma, Campus, Departamento de Oferta, 
                Departamento Recomendado, Código da Disciplina, Total de Alunos, Dia, Horário de Início, Horário de Término, Créditos, Docentes
            </Typography>
            <br/>
            <Typography component="p" display="block">
                Formato SIGA: horario_id, campus, departamento, cod_discip, turma, nome, semestre, numero_vagas, solicitacoes_deferidas, horario_livre, dia, hora_inicio, hora_fim, alocado_chefia, cred_aula, cred_pratico, cred_estagio, ministrantes, juncao_id, cursos_indicados
            </Typography>
            <br/>
            <Typography fontWeight={450} component="p" display="inline">
                Botão Formulário: &nbsp;
            </Typography>
            <Typography component="p" display="inline">
                Abre o formulário de cadastro de Turmas, onde informações referentes a turma devem ser inseridas. 
                Os campos idTurma e Código da Disciplina não serão usados pelo sistema para otimização porém são cadastros importantes para que o sistema converse com outros sistemas do usuário.
            </Typography>
            <br/>
            <br/>
            <Typography fontWeight={450} component="p" display="inline">
                Barra de Buscas: &nbsp;
            </Typography>
            <Typography component="p" display="inline">
                Pode-se buscar turmas pelo nome da disciplina, dia da semana, departamento, dia da semana ou idTurma. 
            </Typography>
            <br/>
            <br/>
            <Typography fontWeight={450} component="p" display="inline">
                Controles de Ano e Semestre: &nbsp;
            </Typography>
            <Typography component="p" display="inline">
                Determinam de qual ano e semestre se deseja mostrar turmas. 
            </Typography>
            <br/>
            <br/>
            <Typography fontWeight={450} component="p" display="inline">
                Botão Erros: &nbsp;
            </Typography>
            <Typography component="p" display="inline">
                Abre a aba com o log dos erros de importação. Caso alguma turma do arquivo que foi importado apresente alguma informação faltante ou fora dos padrões da universidade, ou mesmo caso alguma turma esteja duplicada na tabela, a aba de erros apontará qual o erro e em qual turma o erro ocorreu. 
            </Typography>
            <br/>
            <br/>
            <Divider/>
            <br/>
            <Typography variant="h6" fontSize="18px">
                Lista de Turmas
            </Typography>
            <br/>
            <Typography fontWeight={450} component="p" display="inline">
                Cabeçalho da tabela: &nbsp;
            </Typography>
            <Typography component="p" display="inline">
                Contém os  títulos dos dados das turmas. Caso se clique em algum deles a tabela será ordenada pelo título escolhido. Há uma caixa de seleção para selecionar todas as turmas da página.
                Ao selecionar uma ou mais turmas aparecerá um ícone no canto superior direito para deletar as turmas selecionadas.
            </Typography>
            <br/>
            <br/>
            <Typography fontWeight={450} component="p" display="inline">
                Botão Editar: &nbsp;
            </Typography>
            <Typography component="p" display="inline">
                Em cada linha da tabela há um ícone de lápis para edição da turma, que abre o formulário de cadastro com as informações da turma para edição.
            </Typography>
            <br/>
            <br/>
            <Typography fontWeight={450} component="p" display="inline">
                Paginação: &nbsp;
            </Typography>
            <Typography component="p" display="inline">
                Ao final da tabela estão opções de páginação, onde se pode escolher quantas turmas por página são mostradas e em qual página se está.
            </Typography>

        </>
    )


}

export default AjudaTurma 