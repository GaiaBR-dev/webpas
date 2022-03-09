import {React, useState } from "react";

export default function useForm(inicialValues){

    const [values,setValues] = useState(inicialValues)
    const [erros, setErros] = useState({})

    const handleInputChange = e =>{
        const {name , value} = e.target
        setValues({
            ...values,
            [name]:value
        })
    }

    const resetForm = () =>{
        setValues(inicialValues)
        setErros({})
    }

    return {
        values,
        setValues,
        erros,
        setErros,
        resetForm,
        handleInputChange
    }
}