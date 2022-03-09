import http from "../http-commom";

class SalasDataService {
    getAll(){
        return http.get('salas')
    }

    getPredios(){
        return http.get('salas/p/')
    }

    getSalas(predio){
        return http.get('salas/' + predio)
    }

}

export default new SalasDataService();