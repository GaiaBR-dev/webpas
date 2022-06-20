import {Navigate, Route} from 'react-router-dom';

const PrivateRoute = ({element:Element, ...rest}) =>{
    if(localStorage.getItem("authToken")){
        return(
            <Route
                {...rest}
                element={<Element/>}
            />
        )
    }else{
        return(
            <Route
                {...rest}
                render={() => <Navigate to="/login" />}
        />
        )
    }
}

export default PrivateRoute