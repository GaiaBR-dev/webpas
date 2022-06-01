import http from "../http-commom";

class ConfigsDataService {
    addConfig(data){
        return http.post('configs/newConfig',data)
    }
}

export default new ConfigsDataService();