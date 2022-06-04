import React, { useEffect, useState } from "react";
import useForm from "./useForm";
import { Button, Divider, TextField } from "@mui/material";
import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import { IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import Select from "./select.component";

const inicialValues ={
    _id: '',
    predio: '',
    departamento: '',
    valorDist: '',
    status: '',
}

const formCssClass ={
    '& .MuiGrid-item':{
        '& .MuiTextField-root':{
            width:"100%"
        }
    }
}

const DistanciaForm = props =>{
    const {closeModalForm, updating,addOrEdit,distanciaEdit,predios,departamentos, tableObjs} = props
    const [formTitle,setFormTitle] = useState('Adicionar distância')
    
    const handleDistSearch = e =>{
        const {name , value} = e.target

        let findDistancia = ""
        if (name == 'predio'){
            findDistancia = tableObjs.find(tableObj=>(
                tableObj.predio == value && 
                tableObj.departamento == values.departamento
            ))
        }else{
            findDistancia = tableObjs.find(tableObj=>(
                tableObj.predio == values.predio && 
                tableObj.departamento == value
            ))
        }
        console.table(findDistancia)
        
        if (findDistancia != ""){
            setValues({
                ...values,
                [name]:value,
                _id:findDistancia?._id? findDistancia._id: "",
                valorDist:findDistancia?.valorDist? findDistancia.valorDist: "" ,
                status:findDistancia?.status? findDistancia.status: "Não Informado"
            })
        }
    }

    const handleFormTitle = updatingD =>{
        updatingD ? setFormTitle('Atualizar distância'):setFormTitle('Adicionar distância')
    }

    useEffect(()=>{
        handleFormTitle(updating)
        if(distanciaEdit != null){
            setValues({
                ...distanciaEdit
            })
        }
    },[distanciaEdit])

    const{
        values,
        setValues,
        handleInputChange,
        erros,
        setErros,
        resetForm,
    }=useForm(inicialValues)

    const validate = () =>{
        let temp ={}
        temp.predio = values.predio ? "" :"O prédio é obrigatório"
        temp.departamento = values.departamento? "" : "O departamento é obrigatório"
        if (values.valorDist != "" ) {
            if(Number.isInteger(Number(values.valorDist)))  {
                temp.valorDist = ""
            }else{
                console.log(values.valorDist)
                temp.valorDist = "Este campo deve conter um número"
            }
        }
        setErros({
            ...temp
        })
        return Object.values(temp).every(errorValues => errorValues == "")
    }

    const handleSubmit = e =>{
        e.preventDefault()
        if (validate()){
            console.table(values)
            let distancia = {
                predio:values.predio,
                departamento:values.departamento,
                valorDist:values.valorDist
            }
            if (values.status === "OK"){
                distancia._id = values._id
                addOrEdit(true,distancia,resetForm)
            }else{
                addOrEdit(false,distancia,resetForm)
            }
        }
    }

    return (
        <>
        <Box component="form"  onSubmit={handleSubmit}>
            <Grid container
                columns={12}
                rowSpacing={2}
                columnSpacing={3}
                sx = {formCssClass} 
                justifyContent="flex-start"
                alignItems="flex-start">
                <Grid item xs={11}>
                    <Typography variant="h5">{formTitle}</Typography>
                    <Typography variant="caption" mb={1}>Campos com * são obrigatórios</Typography>
                </Grid>
                <Grid item xs={1}>
                    <IconButton onClick={closeModalForm}>
                        <CloseIcon />
                    </IconButton>
                </Grid>
                <Grid item xs={12}><Divider/></Grid> 
                <Grid item xs={12} sm={6}>
                    <Select 
                        name="predio"
                        label="Prédio*"
                        value={values.predio}
                        onChange={handleDistSearch}
                        options ={predios}
                        error={erros.predio}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Select 
                        name="departamento"
                        label="Departamento*"
                        value={values.departamento}
                        onChange={handleDistSearch}
                        options ={departamentos}
                        error={erros.departamento}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField 
                        variant="outlined"
                        name = "valorDist"
                        onChange={handleInputChange}
                        label="Distância*"
                        value ={values.valorDist}
                        {...(erros.valorDist!= "" && erros.valorDist != null && {
                            error:true,
                            helperText:erros.valorDist 
                        })}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField 
                        disabled
                        variant="outlined"
                        name = "status"
                        onChange={handleInputChange}
                        label="Status"
                        value ={values.status}
        
                    />
                </Grid>
                <Grid item xs={12}>
                </Grid>
                
                <Grid item xs={6} ></Grid>
                <Grid item xs={12} sx={{marginY:2}}>
                    <Button variant='outlined' size="large" color='primary' onClick={resetForm} sx={{marginRight:2}}>Resetar</Button>
                    <Button variant='contained' type="submit"size="large" color='secondary'>Enviar</Button>
                </Grid>
            </Grid>
        </Box>
        </>
    )
}

export default DistanciaForm