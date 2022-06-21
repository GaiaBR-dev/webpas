import React from "react";
import useAuth from '../../services/useAuth'

function HomePage(){
    const {logout,user} = useAuth()

    return(<>
        <div>
            <h1>HomePage</h1>
            <p>{user?.email} Software web para resolução do Problema de Alocação de Salas</p>
        </div>
        <button onClick={logout}>Clica</button>
    </>

    )

}

export default HomePage;