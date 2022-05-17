import React, { useEffect, useState } from "react";
import useForm from "./useForm";
import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import { IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { Divider } from "@mui/material";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";

const inicialValues ={
    predioNovo: '',
}

const formCssClass ={
    '& .MuiGrid-item':{
        '& .MuiTextField-root':{
            width:"100%"
        }
    }
}

const PredioEditForm = props =>{
    const {predioVelho, edit, closeModalForm} = props

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
        temp.predioNovo = values.predioNovo ? "" :"O nome do prédio é obrigatório"

        setErros({
            ...temp
        })

        return Object.values(temp).every(errorValues => errorValues == "")
    }

    const handleSubmit = e =>{
        e.preventDefault()
        if (validate()){
            edit(values,resetForm)
        }
    }

    return (
        <>
            <Box component="form"  onSubmit={handleSubmit}>
            <Grid container
                columns={12}
                spacing={2}
                sx = {formCssClass} 
                justifyContent="space-between"
                alignItems="flex-start">
                <Grid item xs={11}>
                    <Typography variant="h5">Editar prédio - {predioVelho}</Typography>
                    <Typography variant="caption" mb={1}>Campos com * são obrigatórios</Typography>
                </Grid>
                <Grid item xs={1}>
                    <IconButton onClick={closeModalForm}>
                        <CloseIcon />
                    </IconButton>
                </Grid>
                <Grid item xs={12}><Divider/></Grid>
                <Grid item xs={12} >
                    <TextField 
                        variant="outlined"
                        label="Novo Nome*"
                        name = "predioNovo"
                        onChange={handleInputChange}
                        value ={values.predioNovo}
                        {...(erros.predioNovo != null && erros.predioNovo != "" && {
                            error:true,
                            helperText:erros.predioNovo
                        })}
                    />
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

export default PredioEditForm