import React, { useEffect, useState } from "react";
import useForm from "./useForm";
import { Button, Divider, TextField } from "@mui/material";
import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import { IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import Select from "./select.component";
import SalasDataService from '../../services/salas';
import ResultadosDataService from '../../services/resultados';
import ConfirmDialog from "../re-usable/confirmDialog.component";

const inicialValues ={
    dia:"Segunda",
    horarioInicio:"",
    predio1:"",
    sala1:"",
    predio2:"",
    sala2:"",
    turma1:"",
    turma2:"",
    horarioFim1:"",
    horarioFim2:"",
    horarioInicio1:"",
    horarioInicio2:"",
    capacidade1:"",
    capacidade2:"",
    alunos1:"",
    alunos2:"",
}

const formCssClass ={
    '& .MuiGrid-item':{
        '& .MuiTextField-root':{
            width:"100%"
        }
    }
}

const TrocaSalaForm = props =>{
    const {ano,semestre,dia,horariosInicio,config,closeModalForm} = props

    const [predios,setPredios] = useState([]);
    const [salasOrigem,setSalasOrigem] = useState([]);
    const [salasDestino,setSalasDestino] = useState([]);
    const [predioOrigem,setPredioOrigem] = useState("");
    const [predioDestino,setPredioDestino] = useState("");
    const [alocacoes,setAlocacoes] = useState([]);
    const [resultados,setResultados] = useState([]);
    const [confirmDialog,setConfirmDialog] = useState({isOpen:false,title:'',subtitle:''});

    useEffect(()=>{
        retornaResultados(ano,semestre)
    },[ano,semestre])

    useEffect(()=>{
        retornaAlocacoes()
    },[resultados])

    useEffect(()=>{
        let teste = alocacoes.find(search=>{
            return search.horario == '1000' &&
                   search.turma.diaDaSemana == 'Segunda' &&
                   search.sala.numeroSala == 'Sala 02' &&
                   search.sala.predio == 'AT01'
        })
        console.log(teste)
    },[alocacoes])

    useEffect(()=>{
        setValues({...values,dia:dia})
    },[dia])

    useEffect(()=>{
        retornaPredios()
    },[])

    useEffect(()=>{
        if(predioOrigem != ""){
            retornaSalasOrigem(predioOrigem)
        }
    },[predioOrigem])

    useEffect(()=>{
        if(predioDestino != ""){
            retornaSalasDestino(predioDestino)
        }
    },[predioDestino])

    const{
        values,
        setValues,
        handleInputChange,
        erros,
        setErros,
        resetForm,
    }=useForm(inicialValues)

    const retornaResultados = (ano,semestre) =>{
        ResultadosDataService.getByAnoSemestre(ano,semestre)
            .then(res=>{
                setResultados(res.data)
            }).catch(err=>console.log(err))
    }

    const retornaPredios = () =>{
        SalasDataService.getPredios()
            .then(response =>{
                setPredios(response.data)
            }).catch(err =>{
                console.log(err)
            })
    }

    const retornaSalasOrigem = predio =>{
        SalasDataService.getSalas(predio)
            .then(response =>{
                let salasObj = response.data.map(sala=>{
                    return sala.numeroSala
                })
                setSalasOrigem(salasObj)
            }).catch(err =>{
                console.log(err)
            })
    }

    const retornaSalasDestino = predio =>{
        SalasDataService.getSalas(predio)
            .then(response =>{
                let salasObj = response.data.map(sala=>{
                    return sala.numeroSala
                })
                setSalasDestino(salasObj)
            }).catch(err =>{
                console.log(err)
            })
    }

    const getHorarioByPeriodo = (periodo,slot) =>{
        let periodoNum= 0
        if (periodo === 'Manhã'){
            periodoNum = 0
        } else if ( periodo === 'Tarde'){
            periodoNum = 1
        } else if ( periodo === 'Noite'){
            periodoNum = 2
        }
        return horariosInicio[periodoNum*2+slot - 1]
    }

    const retornaAlocacoes = () =>{
        if(resultados.length > 0){
            let alocacoesTemp = []
            resultados.map(resultado=>{
                resultado.alocacoes.map(alocacao=>{
                    let alocacaoTemp = {
                        horario: alocacao?.horarioSlot == 1 ? 
                            getHorarioByPeriodo(resultado.periodo,1) : 
                            getHorarioByPeriodo(resultado.periodo,2),
                        turma : alocacao?.turma,
                        sala: alocacao?.sala 
                    }
                    alocacoesTemp.push(alocacaoTemp)
                })
            })
            setAlocacoes(alocacoesTemp)
        }else{
            setAlocacoes([])
        }
    }

    const validate = () =>{
        let temp ={}

        temp.dia = values.dia ? "" : "O dia é obrigatório"
        temp.horarioInicio = values.horarioInicio ? "" : "O horário é obrigatório"
        temp.predio1 = values.predio1 ? "" : "O predio é obrigatório"
        temp.predio2 = values.predio2 ? "" : "O predio é obrigatório"
        temp.sala1 = values.sala1 ? "" : "A sala é obrigatória"
        temp.sala2 = values.sala2 ? "" : "A sala é obrigatória"

        temp.erroSala = ""
        let buscaSalaTemp = {turma:""}
        if (values.horarioFim1 == values.horarioFim2 && values.horarioFim1 == ""){
            temp.erroSala = "Ambas as salas estão vazias no horário escolhido"
        }else{
            if (values.horarioFim1 == values.horarioFim2){
                if (values.horarioInicio1 != values.horarioInicio2){
                    if (parseInt(values.horarioInicio1) > parseInt(values.horarioInicio2)){
                        buscaSalaTemp = turmaSearch(dia,values.horarioInicio2,values.predio1,values.sala1)
                        if (buscaSalaTemp.turma != "Sala Vazia"){
                            temp.erroSala = `A ${values.sala1} do prédio ${values.predio1} está ocupada com a turma ${buscaSalaTemp.turma} no horário das ${values.horarioInicio2}`
                            setConfirmDialog({
                                isOpen:true,
                                title:'Trocar Salas',
                                subtitle: `A ${values.sala1} do prédio ${values.predio1} está ocupada com a turma ${buscaSalaTemp.turma} no horário das ${values.horarioInicio2}.
                                           Deseja trocar ambas as turmas ?`,
                                onConfirm: () =>{temp.erroSala= ""}
                            })
                        }
                    }else{
                        buscaSalaTemp = turmaSearch(dia,values.horarioInicio1,values.predio2,values.sala2)
                        if (buscaSalaTemp.turma != "Sala Vazia"){
                            temp.erroSala = `A ${values.sala2} do prédio ${values.predio2} está ocupada com a turma ${buscaSalaTemp.turma} no horário das ${values.horarioInicio1}`
                            setConfirmDialog({
                                isOpen:true,
                                title:'Trocar Salas',
                                subtitle: `A ${values.sala2} do prédio ${values.predio2} está ocupada com a turma ${buscaSalaTemp.turma} no horário das ${values.horarioInicio1}.
                                           Deseja trocar ambas as turmas ?`,
                                onConfirm: () =>{temp.erroSala= ""}
                            })
                        }
                    }
                }
            }else{
                if (values.horarioInicio1 == values.horarioInicio2){
                    if (parseInt(values.horarioFim1) < parseInt(values.horarioFim2)){
                        buscaSalaTemp = turmaSearch(dia,values.horarioFim1,values.predio1,values.sala1)
                        if (buscaSalaTemp.turma != "Sala Vazia"){
                            temp.erroSala = `A ${values.sala1} do prédio ${values.predio1} está ocupada com a turma ${buscaSalaTemp.turma} no horário das ${values.horarioFim1}`
                            setConfirmDialog({
                                isOpen:true,
                                title:'Trocar Salas',
                                subtitle: `A ${values.sala1} do prédio ${values.predio1} está ocupada com a turma ${buscaSalaTemp.turma} no horário das ${values.horarioFim1}.
                                           Deseja trocar ambas as turmas ?`,
                                onConfirm: () =>{temp.erroSala= ""}
                            })
                        }
                    }else{
                        buscaSalaTemp = turmaSearch(dia,values.horarioFim2,values.predio2,values.sala2)
                        if (buscaSalaTemp.turma != "Sala Vazia"){
                            temp.erroSala = `A ${values.sala2} do prédio ${values.predio2} está ocupada com a turma ${buscaSalaTemp.turma} no horário das ${values.horarioFim2}`
                            setConfirmDialog({
                                isOpen:true,
                                title:'Trocar Salas',
                                subtitle: `A ${values.sala2} do prédio ${values.predio2} está ocupada com a turma ${buscaSalaTemp.turma} no horário das ${values.horarioFim2}.
                                           Deseja trocar ambas as turmas ?`,
                                onConfirm: () =>{temp.erroSala= ""}
                            })
                        }
                    }
                }
            }
        }

        console.log(temp)
        

        setErros({
            ...temp
        })
        return Object.values(temp).every(errorValues => errorValues == "")
    }

    const turmaSearch = (dia,horarioInicio,predio,sala) =>{
        let alocacao  = alocacoes.find(search=>{
            return search.horario == horarioInicio &&
                   search.turma.diaDaSemana == dia &&
                   search.sala.numeroSala == sala &&
                   search.sala.predio == predio
        })
        let result = {
            turma: alocacao?.turma? alocacao.turma.idTurma + " - " + alocacao.turma.nomeDisciplina + " - " + alocacao.turma.turma : "Sala Vazia",
            horarioInicio: alocacao?.turma?.horarioInicio? alocacao.turma.horarioInicio : "",
            horarioFim: alocacao?.turma?.horarioFim? alocacao.turma.horarioFim : "",
            capacidade: alocacao?.sala?.capacidade? alocacao.sala.capacidade : "",
            alunos: alocacao?.turma?.totalTurma? alocacao.turma.totalTurma : ""
        }
        return result
    }

    const retornaTurma = e =>{
        const {name , value} = e.target

        let case1 = false
        let case2 = false

        let findTurma = new Array(2)
        if (name == 'predio1'){
            findTurma[0] = turmaSearch(values.dia,values.horarioInicio,value,values.sala1)
            setPredioOrigem(value)
            case1 = true
        }else if (name == 'predio2'){
            findTurma[1] = turmaSearch(values.dia,values.horarioInicio,value,values.sala2)
            setPredioDestino(value)
            case2 = true
        }else if (name == 'sala1'){
            findTurma[0] = turmaSearch(values.dia,values.horarioInicio,values.predio1,value)
            case1 = true
        }else if (name == 'sala2'){
            findTurma[1] = turmaSearch(values.dia,values.horarioInicio,values.predio2,value)
            case2 = true
        }else if (name=='dia'){
            findTurma[0] = turmaSearch(value,values.horarioInicio,values.predio1,values.sala1) 
            findTurma[1] = turmaSearch(value,values.horarioInicio,values.predio2,values.sala2)
        }else{
            findTurma[0] = turmaSearch(values.dia,value,values.predio1,values.sala1) 
            findTurma[1] = turmaSearch(values.dia,value,values.predio2,values.sala2)
        }
        
        if (case1){
            setValues({
                ...values,
                [name]:value,
                turma1: findTurma[0]?.turma? findTurma[0].turma : "",
                horarioFim1: findTurma[0]?.horarioFim? findTurma[0].horarioFim : "",
                horarioInicio1: findTurma[0]?.horarioInicio? findTurma[0].horarioInicio : "",
                capacidade1: findTurma[0]?.capacidade? findTurma[0].capacidade : "",
                alunos1: findTurma[0]?.alunos? findTurma[0].alunos : ""
            })
        }else if (case2){
            setValues({
                ...values,
                [name]:value,
                turma2: findTurma[1]?.turma? findTurma[1].turma : "",
                horarioFim2: findTurma[1]?.horarioFim? findTurma[1].horarioFim : "",
                horarioInicio2: findTurma[1]?.horarioInicio? findTurma[1].horarioInicio : "",
                capacidade2: findTurma[1]?.capacidade? findTurma[1].capacidade : "",
                alunos2: findTurma[1]?.alunos? findTurma[1].alunos : ""
            })
        }else{
            setValues({
                ...values,
                [name]:value,
                turma1: findTurma[0]?.turma? findTurma[0].turma : "",
                horarioFim1: findTurma[0]?.horarioFim? findTurma[0].horarioFim : "",
                horarioInicio1: findTurma[0]?.horarioInicio? findTurma[0].horarioInicio : "",
                capacidade1: findTurma[0]?.capacidade? findTurma[0].capacidade : "",
                alunos1: findTurma[0]?.alunos? findTurma[0].alunos : "",
                turma2: findTurma[1]?.turma? findTurma[1].turma : "",
                horarioFim2: findTurma[1]?.horarioFim? findTurma[1].horarioFim : "",
                horarioInicio2: findTurma[1]?.horarioInicio? findTurma[1].horarioInicio : "",
                capacidade2: findTurma[1]?.capacidade? findTurma[1].capacidade : "",
                alunos2: findTurma[1]?.alunos? findTurma[1].alunos : ""
            })
        }
    }


    const handleSubmit = e =>{
        e.preventDefault()
        if (validate()){

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
                    <Typography variant="h5">Trocar Salas</Typography>
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
                        name="dia"
                        label="Dia*"
                        value={values.dia}
                        onChange={retornaTurma}
                        options ={config.dias}
                        error={erros.dia}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Select 
                        name="horarioInicio"
                        label="Horário*"
                        value={values.horarioInicio}
                        onChange={retornaTurma}
                        options ={horariosInicio}
                        error={erros.horarioInicio}
                    />
                </Grid>
                <Grid item xs={12}>
                </Grid>
                <Grid item xs={12}>
                    <Typography>Sala 1</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Select 
                        name="predio1"
                        label="Prédio*"
                        value={values.predio1}
                        onChange={retornaTurma}
                        options ={predios}
                        error={erros.predio1}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Select 
                        name="sala1"
                        label="Sala*"
                        value={values.sala1}
                        onChange={retornaTurma}
                        options ={salasOrigem}
                        error={erros.sala1}
                    />
                </Grid>
                <Grid item xs={12} sm={9}>
                    <TextField 
                        disabled
                        variant="outlined"
                        name = "turma1"
                        onChange={handleInputChange}
                        label="Turma"
                        value ={values.turma1}
                        {...(erros.erroSala != "" && erros.erroSala!= null && {
                            error:true,
                            helperText:erros.erroSala 
                        })}
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <TextField 
                        disabled
                        variant="outlined"
                        name = "horarioFim1"
                        onChange={handleInputChange}
                        label="Horário de Término"
                        value ={values.horarioFim1}
                        
                    />
                </Grid>
                <Grid item xs={12}>
                </Grid>
                <Grid item xs={12}>
                    <Typography>Sala 2</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Select 
                        name="predio2"
                        label="Prédio*"
                        value={values.predio2}
                        onChange={retornaTurma}
                        options ={predios}
                        error={erros.predio2}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Select 
                        name="sala2"
                        label="Sala*"
                        value={values.sala2}
                        onChange={retornaTurma}
                        options ={salasDestino}
                        error={erros.sala2}
                    />
                </Grid>
                <Grid item xs={12} sm={9}>
                    <TextField 
                        disabled
                        variant="outlined"
                        name = "turma2"
                        onChange={handleInputChange}
                        label="Turma"
                        value ={values.turma2}
                        {...(erros.erroSala != "" && erros.erroSala!= null && {
                            error:true,
                            helperText:erros.erroSala 
                        })}
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <TextField 
                        disabled
                        variant="outlined"
                        name = "horarioFim2"
                        onChange={handleInputChange}
                        label="Horário de Término"
                        value ={values.horarioFim2}
                    />
                </Grid>
                <Grid item xs={12}>
                </Grid>
                
                <Grid item xs={12} sx={{marginY:2}}>
                    <Button variant='outlined' size="large" color='primary' onClick={resetForm} sx={{marginRight:2}}>Resetar</Button>
                    <Button variant='contained' type="submit"size="large" color='secondary'>Trocar</Button>
                </Grid>
            </Grid>

            <ConfirmDialog
                confirmDialog={confirmDialog}
                setConfirmDialog={setConfirmDialog}
            />
        </Box>
        </>
    )
}

export default TrocaSalaForm