import http from "../http-commom";

class TurmasDataService {
    getAll(){
        return http.get('turmas')
    }

    getDepartamentos(){
        return http.get('turmas/d/')
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

    deleteTurmas(turmas){
        return http.post(`turmas/deleteMany`,turmas)
    }

    deleteAnoSemestre(ano,semestre){
        return http.delete(`turmas/delete/${ano}/${semestre}`)
    }
}

export default new TurmasDataService();