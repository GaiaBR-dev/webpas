import React, { useEffect, useState } from "react";
import useForm from "./useForm";
import { Button, Divider, FormControl, FormControlLabel, FormLabel, RadioGroup, TextField } from "@mui/material";
import { Radio } from "@mui/material";
import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import { IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';


const inicialValues ={
    predio: '',
    nSalas: '',
    capacidade: '',
    disponivelManha: true,
    disponivelTarde: true,
    disponivelNoite: true,
}

const formCssClass ={
    '& .MuiGrid-item':{
        '& .MuiTextField-root':{
            width:"100%"
        }
    }
}

const PredioForm = props =>{
    const {closeModalForm, add} = props

    useEffect(()=>{
    },[])

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
        temp.predio = values.predio ? "" :"O nome do prédio é obrigatório"
        temp.capacidade = "A capacidade das salas é obrigatória"
        if (values.capacidade != "") {
            if(Number.isInteger(Number(values.capacidade)))  {
                temp.capacidade = ""
            }else{
                console.log(values.capacidade)
                temp.capacidade = "Este campo deve conter um número"
            }
        }
        temp.nSalas = "O número de salas é obrigatório"
        if (values.nSalas != "" ) {
            if(Number.isInteger(Number(values.nSalas)))  {
                temp.nSalas = ""
            }else{
                console.log(values.nSalas)
                temp.nSalas = "Este campo deve conter um número"
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
            add(values,resetForm)
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
                    <Typography variant="h5">Adicionar prédio</Typography>
                    <Typography variant="caption" mb={1}>Campos com * são obrigatórios</Typography>
                </Grid>
                <Grid item xs={1}>
                    <IconButton >
                        <CloseIcon onClick={closeModalForm}/>
                    </IconButton>
                </Grid>
                <Grid item xs={12}><Divider/></Grid> 
                <Grid item xs={12} sm={6}>
                    <TextField 
                        variant="outlined"
                        label="Nome*"
                        name = "predio"
                        onChange={handleInputChange}
                        value ={values.predio}
                        {...(erros.predio != null && erros.predio != "" && {
                            error:true,
                            helperText:erros.predio
                        })}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField 
                        variant="outlined"
                        label="Número de Salas*"
                        name = "nSalas"
                        onChange={handleInputChange}
                        value ={values.nSalas}
                        {...(erros.nSalas != null && erros.nSalas != "" && {
                            error:true,
                            helperText:erros.nSalas
                        })}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        variant="outlined"
                        label="Capacidade*"
                        name = "capacidade"
                        onChange={handleInputChange}
                        value ={values.capacidade}
                        {...(erros.capacidade != null && erros.capacidade != "" && {
                            error:true,
                            helperText:erros.capacidade 
                        })}
                    />
                </Grid>
                <Grid item xs={12} >
                    <FormControl>
                        <FormLabel>Disponível de Manhã</FormLabel>
                        <RadioGroup row
                        name="disponivelManha"
                        value={values.disponivelManha}
                        onChange={handleInputChange}>
                            <FormControlLabel value={true} control={<Radio />} label="Sim" />
                            <FormControlLabel value={false} control={<Radio />} label="Não" />
                        </RadioGroup>
                    </FormControl>
                </Grid>
                <Grid item xs={12} >
                    <FormControl>
                        <FormLabel>Disponível de Tarde</FormLabel>
                        <RadioGroup row
                        name="disponivelTarde"
                        value={values.disponivelTarde}
                        onChange={handleInputChange}>
                            <FormControlLabel value={true} control={<Radio />} label="Sim" />
                            <FormControlLabel value={false} control={<Radio />} label="Não" />
                        </RadioGroup>
                    </FormControl>
                </Grid>
                <Grid item xs={12} >
                    <FormControl>
                        <FormLabel>Disponível de Noite</FormLabel>
                        <RadioGroup row
                        name="disponivelNoite"
                        value={values.disponivelNoite}
                        onChange={handleInputChange}>
                            <FormControlLabel value={true} control={<Radio />} label="Sim" />
                            <FormControlLabel value={false} control={<Radio />} label="Não" />
                        </RadioGroup>
                    </FormControl>
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

export default PredioForm