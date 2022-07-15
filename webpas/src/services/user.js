import http from "../http-commom";

class UserDataService {
    cadastrar(data){
        return http.post('auth/register',data)
    }

    login(data){
        return http.post('auth/login',data)
    }

    logout(){
        return http.post('auth/logout')
    }

    forgotPassword(data){
        return http.post('auth/forgotpassword',data)
    }

    resetPassword(data,token){
        return http.put(`auth/resetpassword/${token}`,data)
    }

    getPrivate(){
        return http.get('auth/getAuthorized')
    }

}

export default new UserDataService();