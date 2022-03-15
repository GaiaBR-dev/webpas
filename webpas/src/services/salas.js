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

    getSalas(predio){
        return http.get('salas/' + predio)
    }

    updateSala(salaId,sala){
        return http.post('salas/update/'+salaId,sala)
    }

    addSala(predio,sala){
        return http.post('salas/'+predio+'/addSala',sala)
    }

    deleteSala(salaId){
        return http.delete('salas/'+salaId)
    }

}

export default new SalasDataService();