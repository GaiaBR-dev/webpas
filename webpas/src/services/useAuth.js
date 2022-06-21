import React from "react"
import { useNavigate } from "react-router-dom"
import UserDataService from '../services/user'

export default function useAuth(redirect=true) {
    let navigate = useNavigate();
    function getUserFromCookie() {
        if (typeof document !== 'undefined' && document.cookie) {
            const user = document.cookie
                .split('; ')
                .find(row => row.startsWith('user'))
                
            return user ? user.split('=')[1] : false
        }
        return false
    }
    const [user, setUser] = React.useState(null)

    React.useEffect(() => {
        setUser(getUserFromCookie())
    }, [])

    React.useEffect(() => {
        console.log('user: ',user)
        if (user === false && redirect) {
            navigate('/login?callbackUrl=' + window.location.href);
        }
    }, [user])

    const logout = () => {
        document.cookie = `user=;expires=Thu, 01 Jan 1970 00:00:00 GMT;`
        UserDataService.logout()
            .then(()=>{
                setUser(null)
                navigate('/login?callbackUrl=' + window.location.href);
            }).catch(err=>console.log(err))

    }

    return {
        user: user? JSON.parse(user) : null,
        logout,
    }
}