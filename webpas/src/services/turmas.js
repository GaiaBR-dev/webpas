import http from "../http-commom";

class TurmasDataService {
    getAll(){
        return http.get('turmas')
    }

    getByAnoSemestre(ano,semestre){
        return http.get(`turmas/${ano}/${semestre}`)
    }

    addTurma(turma){
        return http.post('turmas/add',turma)
    }

    addManyTurmas(novasTurmas){
        return http.post('turmas/arquivoturma',novasTurmas)
    }

    updateTurma(turmaId,turma){
        return http.post(`turmas/update/${turmaId}`,turma)
    }

    deleteTurma(turmaId){
        return http.delete(`turmas/${turmaId}`)
    }
}

export default new TurmasDataService();