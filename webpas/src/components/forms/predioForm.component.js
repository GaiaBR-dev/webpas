import React, { useEffect, useState } from "react";
import useForm from "./useForm";
import { Button, Checkbox, Divider, FormControl, FormControlLabel, FormLabel, RadioGroup, TextField } from "@mui/material";
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
}

const formCssClass ={
    '& .MuiGrid-item':{
        '& .MuiTextField-root':{
            width:"100%"
        }
    }
}

const PredioForm = props =>{
    const {closeModalForm, add, config} = props
    const [dispCheckBoxList,setDispCheckBoxList] = useState(() =>{
        let result = {}
        config.dias.map(dia=>{
            result[dia] = {}
            config.periodos.map(periodo=>{
                result[dia][periodo] = false
            })
        })
        return result
    })

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

    const handleCheckBox = e =>{
        const {name} = e.target
        let dia = name.slice(0,name.search("-"))
        let periodo = name.slice(name.search("-")+1)
        let changeCB = !dispCheckBoxList[dia][periodo]
        setDispCheckBoxList({
            ...dispCheckBoxList,
            [dia]:{
                ...dispCheckBoxList[dia],
                [periodo]:changeCB
            }
        })
    }

    const createDispArray = () =>{
        let dispArray = []
        config.dias.map((dia,indexd)=>{
            config.periodos.map((periodo,indexp)=>{
                let dispUnit = {
                    dia:dia,
                    periodo:periodo,
                    disponivel:dispCheckBoxList[dia][periodo]
                }
                dispArray.push(dispUnit)
            })
        })
        return dispArray
    }

    const handleSubmit = e =>{
        e.preventDefault()
        let disponibilidade = createDispArray()
        if (validate()){
            add(values,disponibilidade,resetForm)
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
                    <IconButton onClick={closeModalForm}>
                        <CloseIcon />
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
                <Grid item xs={12}>
                </Grid>
                <Grid item xs={5}><Typography fontWeight={420}>Disponibilidade</Typography></Grid>
                {
                    config.periodos.map((periodo,index)=>{
                        return(
                            <Grid item xs={2} key={index}><Typography fontWeight={450}>{periodo}</Typography></Grid>
                        )
                    })
                }

                {
                    config.dias.map((dia,index)=>{
                        return(
                            <Grid item xs ={12}>
                                <FormControl key={index} sx={{width:'100%'}}>
                                <Grid container alignItems="center"  justifyContent="space-around">
                                    <Grid item xs={5}><FormLabel>{dia}</FormLabel></Grid>
                                    {config.periodos.map((periodo,indexp)=>{
                                        return(
                                            <Grid item xs={2} key={indexp}> 
                                                <Checkbox 
                                                    name={`${dia}-${periodo}`}
                                                    onChange={handleCheckBox}
                                                    checked={dispCheckBoxList[dia][periodo]} /> 
                                            </Grid>
                                        )
                                    })}
                                </Grid>
                                </FormControl>
                            </Grid>
                        )
                    })
                }

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