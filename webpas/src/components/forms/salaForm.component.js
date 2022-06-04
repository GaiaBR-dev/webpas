import React, { useEffect, useState } from "react";
import useForm from "./useForm";
import { Button, Divider, FormControl, FormLabel, TextField } from "@mui/material";
import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import { IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { Checkbox } from "@mui/material";

const inicialValues ={
    numeroSala: '',
    capacidade: '',
}

const formCssClass ={
    '& .MuiGrid-item':{
        '& .MuiTextField-root':{
            width:"100%"
        }
    }
}

const SalaForm = props =>{
    const {closeModalForm, updating,addOrEdit,salaEdit,predio,config} = props
    const [formTitle,setFormTitle] = useState('Adicionar sala')
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

    const handleFormTitle = updatingS =>{
        updatingS ? setFormTitle('Atualizar sala'):setFormTitle('Adicionar sala')
    }

    useEffect(()=>{
        handleFormTitle(updating)
        if(salaEdit != null){
            setValues({
                ...salaEdit
            })
            let dispCheckBoxObj = {}
            salaEdit.disponibilidade.map(dispUnit=>{
                if (dispCheckBoxObj[dispUnit.dia] == undefined) {dispCheckBoxObj[dispUnit.dia] = {}}
                dispCheckBoxObj[dispUnit.dia][dispUnit.periodo] = dispUnit.disponivel
            })
            setDispCheckBoxList(dispCheckBoxObj) 
        }else{

        }
    },[salaEdit])

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
        temp.numeroSala = values.numeroSala ? "" :"O número da sala é obrigatório"
        temp.capacidade = "A capacidade da sala é obrigatória"
        if (values.capacidade != "" ) {
            if(Number.isInteger(Number(values.capacidade)))  {
                temp.capacidade = ""
            }else{
                console.log(values.capacidade)
                temp.capacidade = "Este campo deve conter um número"
            }
        }
        setErros({
            ...temp
        })

        return Object.values(temp).every(errorValues => errorValues == "")
    }

    const handleSubmit = e =>{
        e.preventDefault()
        let disponibilidade = createDispArray()
        if (validate()){
            addOrEdit(updating,values,predio,disponibilidade,resetForm)
        }
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

    const resetFormandCB = () =>{
        resetForm()
        setDispCheckBoxList(()=>{
            let result = {}
            config.dias.map(dia=>{
                result[dia] = {}
                config.periodos.map(periodo=>{
                    result[dia][periodo] = false
                })
            })
            return result
        })
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
                    <TextField 
                        variant="outlined"
                        label="Número da Sala*"
                        name = "numeroSala"
                        onChange={handleInputChange}
                        value ={values.numeroSala}
                        {...(erros.numeroSala != null && erros.numeroSala != "" && {
                            error:true,
                            helperText:erros.numeroSala 
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
                            <Grid item xs ={12} key={index}>
                                <FormControl  sx={{width:'100%'}}>
                                <Grid container columnSpacing={3} alignItems="center"  justifyContent="flex-start">
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
                    <Button variant='outlined' size="large" color='primary' onClick={resetFormandCB} sx={{marginRight:2}}>Resetar</Button>
                    <Button variant='contained' type="submit"size="large" color='secondary'>Enviar</Button>
                </Grid>
            </Grid>
        </Box>
        </>
    )
}

export default SalaForm