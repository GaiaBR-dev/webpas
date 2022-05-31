import http from "../http-commom";

class ResultadosDataService {
    getAll(){
        return http.get('resultados')
    }

    calculaLista(data){
        return http.post('resultados/calculalista',data)
    }


}

export default new ResultadosDataService();