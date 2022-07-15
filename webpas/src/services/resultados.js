import http from "../http-commom";

class ResultadosDataService {
    getAll(){
        return http.get('resultados')
    }

    getByAnoSemestre(ano,semestre){
        return http.get(`resultados/${ano}/${semestre}`)
    }

    getByAnoSemestreDia(ano,semestre,dia){
        return http.get(`resultados/${ano}/${semestre}/${dia}`)
    }

    getByAnoSemestreDiaPeriodo(ano,semestre,dia,periodo){
        return http.get(`resultados/${ano}/${semestre}/${dia}/${periodo}`)
    }

    calculaLista(data){
        return http.post('resultados/calculalista',data)
    }


}

export default new ResultadosDataService();