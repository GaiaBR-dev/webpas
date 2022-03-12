import React, { useEffect, useState } from "react";
import useForm from "./useForm";
import { Button, Divider, FormControl, FormControlLabel, FormLabel, RadioGroup, TextField } from "@mui/material";
import { Radio } from "@mui/material";
import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import { IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import Select from "./select.component";

const inicialValues ={
    idTurma: '',
    nomeDisciplina: '',
    turma : '',
    campus :'',
    departamentoOferta: '',
    departamentoTurma : '',
    codDisciplina : '',
    totalTurma : '',
    diaDaSemana : '',
    horarioInicio: '',
    horarioFim : '',
    creditosAula: '',
    docentes: '',
    ano: new Date().getFullYear(),
    semestre: 1
}

const formCssClass ={
    '& .MuiGrid-item':{
        '& .MuiTextField-root':{
            width:"100%"
        }
    }
}

const TurmaForm = props =>{
    const {dias,horarios,anos, creditos , closeModalForm, updating,addOrEdit,turmaEdit} = props
    const [formTitle,setFormTitle] = useState('Adicionar turma')

    const handleFormTitle = updatingT =>{
        updatingT ? setFormTitle('Atualizar turmas'):setFormTitle('Adicionar Turmas')
    }

    useEffect(()=>{
        handleFormTitle(updating)
        if(turmaEdit != null){
            setValues({
                ...turmaEdit
            })
        }else{

        }
    },[turmaEdit])

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
        temp.nomeDisciplina = values.nomeDisciplina ? "" :"O nome da disciplina é obrigatório"
        temp.turma = values.turma ? "" : "O identificador da turma é obrigatório"
        //temp.departamentoOferta = values.departamentoOferta ? "" : "O departamento de oferta é obrigatório"
        temp.diaDaSemana = values.diaDaSemana ? "" : "O dia em que a turma é ministrada é obrigatório"
        temp.horarioInicio = values.horarioInicio? "" : "O horário de ínicio da turma é obrigatório"
        temp.horarioFim = values.horarioFim? "" : "O horário de término da turma é obrigatório"
        temp.creditosAula = values.creditosAula? "" : "O número de créditos da turma é obrigatório"
        temp.ano = values.ano? "" : "O ano da turma é obrigatório"
        temp.semestre = values.semestre? "" : "O semestre da turma é obrigatório"
        temp.totalTurma = "O numero de alunos total é obrigatório"
        if (values.totalTurma != "" ) {
            if(Number.isInteger(Number(values.totalTurma)))  {
                temp.totalTurma = ""
            }else{
                console.log(values.totalTurma)
                temp.totalTurma = "Este campo deve conter um número"
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
            addOrEdit(updating,values,resetForm)
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
                    <Typography variant="h5">{formTitle}</Typography>
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
                        label="idTurma"
                        name = "idTurma"
                        onChange={handleInputChange}
                        value ={values.idTurma}></TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        variant="outlined"
                        label="Nome da Disciplina*"
                        name = "nomeDisciplina"
                        onChange={handleInputChange}
                        value ={values.nomeDisciplina}
                        {...(erros.nomeDisciplina != null && erros.nomeDisciplina != "" && {
                            error:true,
                            helperText:erros.nomeDisciplina 
                        })}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField 
                        variant="outlined"
                        label="Turma*"
                        name = "turma"
                        onChange={handleInputChange}
                        value ={values.turma}
                        {...(erros.turma != "" && erros.turma != null && {
                            error:true,
                            helperText:erros.turma
                        })}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField 
                        variant="outlined"
                        label="Campus"
                        name = "campus"
                        onChange={handleInputChange}
                        value ={values.campus}></TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField 
                        variant="outlined"
                        name = "departamentoOferta"
                        onChange={handleInputChange}
                        label="Departamento de Oferta*"
                        value ={values.departamentoOferta}
                        {...(erros.departamentoOferta != "" && erros.departamentoOferta!= null && {
                            error:true,
                            helperText:erros.departamentoOferta 
                        })}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField 
                        variant="outlined"
                        name = "departamentoTurma"
                        onChange={handleInputChange}
                        label="Departamento Recomendado"
                        value ={values.departamentoTurma}></TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField 
                        variant="outlined"
                        name = "idDisciplina"
                        onChange={handleInputChange}
                        label="Código da Disciplinas"
                        value ={values.codDisciplina}></TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField 
                        variant="outlined"
                        name = "totalTurma"
                        onChange={handleInputChange}
                        label="Número de Alunos*"
                        value ={values.totalTurma}
                        {...(erros.totalTurma!= "" && erros.totalTurma != null && {
                            error:true,
                            helperText:erros.totalTurma 
                        })}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Select 
                        name="diaDaSemana"
                        label="Dia*"
                        value={values.diaDaSemana}
                        onChange={handleInputChange}
                        options ={dias}
                        error={erros.diaDaSemana}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Select 
                        name="horarioInicio"
                        label="Horário de Ínicio*"
                        value={values.horarioInicio}
                        onChange={handleInputChange}
                        options ={horarios}
                        error={erros.horarioInicio}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Select 
                        name="horarioFim"
                        label="Horário de Término*"
                        value={values.horarioFim}
                        onChange={handleInputChange}
                        options ={horarios}
                        error={erros.horarioFim}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Select 
                        name="creditosAula"
                        label="Creditos*"
                        value={values.creditosAula}
                        onChange={handleInputChange}
                        options ={creditos}
                        error={erros.creditosAula}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField 
                        variant="outlined"
                        name = "docentes"
                        onChange={handleInputChange}
                        label="Docentes"
                        value ={values.docentes}></TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Select 
                        name="ano"
                        label="Ano*"
                        value={values.ano}
                        onChange={handleInputChange}
                        options ={anos}
                        error={erros.ano}
                    />
                </Grid>
                <Grid item xs={12} >
                    <FormControl>
                        <FormLabel>Semestre*</FormLabel>
                        <RadioGroup row
                        name="semestre"
                        value={values.semestre}
                        onChange={handleInputChange}>
                            <FormControlLabel value={1} control={<Radio />} label="1º Semestre" />
                            <FormControlLabel value={2} control={<Radio />} label="2º Semestre" />
                        
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

export default TurmaForm