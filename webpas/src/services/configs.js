import http from "../http-commom";

class ConfigsDataService {
    newUserConfig(userId){
        return http.post(`configs/createStandartConfig/${userId}`)
    }

    updateConfig(data,id){
        return http.post(`configs/updateConfig/${id}`,data)
    }

    getConfigById(userId){
        return http.get(`configs/user/${userId}`)
    }
}

export default new ConfigsDataService();