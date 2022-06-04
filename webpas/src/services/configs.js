import http from "../http-commom";

class ConfigsDataService {
    addConfig(data){
        return http.post('configs/newConfig',data)
    }

    getConfigByUser(user){
        return http.get(`configs/user/${user}`)
    }
}

export default new ConfigsDataService();