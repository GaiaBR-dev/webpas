import http from "../http-commom";

class SalasDataService {
    getAll(){
        return http.get('salas')
    }

    getPredios(){
        return http.get('salas/p/')
    }

    addPredio(predio){
        return http.post('salas/addPredio',predio)
    }

    editPredio(data,predioEdit){
        return http.post(`salas/${predioEdit}/update`,data)
    }

    deletePredio(predio){
        return http.delete(`salas/${predio}/delete`)
    }

    addManySalas(salas){
        return http.post(`salas/arquivosala`,salas)
    }

    getSalas(predio){
        return http.get('salas/' + predio)
    }

    updateSala(predio,salaId,sala){
        return http.post(`salas/${predio}/update/${salaId}`,sala)
    }

    addSala(predio,sala){
        return http.post('salas/'+predio+'/addSala',sala)
    }

    deleteSalas(salas){
        return http.post('salas/deleteMany',salas)
    }

}

export default new SalasDataService();