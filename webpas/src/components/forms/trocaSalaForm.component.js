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
    const {ano,semestre,dia,horariosInicio,horariosFim,config,closeModalForm,resultados} = props

    const [predios,setPredios] = useState([]);
    const [salas,setSalas] = useState([]);
    const [salasOrigem,setSalasOrigem] = useState([]);
    const [salasDestino,setSalasDestino] = useState([]);
    const [salaOrigem,setSalaOrigem] = useState({});
    const [salaDestino,setSalaDestino] = useState({});
    const [predioOrigem,setPredioOrigem] = useState("");
    const [predioDestino,setPredioDestino] = useState("");
    const [alocacoes,setAlocacoes] = useState([]);
    const [confirmDialog,setConfirmDialog] = useState({isOpen:false,title:'',subtitle:''});

    useEffect(()=>{
        setValues({...values,dia:dia})
    },[dia])

    useEffect(()=>{
        retornaSalas()
    },[ano,semestre])

    useEffect(()=>{
        retornaAlocacoes()
    },[resultados])

    useEffect(()=>{
        retornaPredios()
    },[salas])

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

    const retornaSalas = () =>{
        SalasDataService.getAll()
            .then(res=>{
                setSalas(res.data)
            }).catch(err=>console.log(err))
    }

    const retornaPredios = () =>{
        const unique = [...new Set(salas.map(item => item.predio))].sort()
        const listaPredios = unique.concat(["predioAux"])
        setPredios(listaPredios)
    }

    const getResultadoId =(ano,semestre,dia,horario) =>{
        let result = resultados.find(resultado =>{
            return resultado.ano == ano &&
                   resultado.semestre == semestre &&
                   resultado.diaDaSemana == dia &&
                   resultado.periodo == getPeriodoByHorario(horario)
        })
        return result?._id? result._id : "xxx"
    }

    const getPeriodoByHorario = horario =>{
        let periodo = ''
        if(config.horarios){
            if(horario == config.horarios['Manhã']['Início'].slot1 ||
                horario == config.horarios['Manhã']['Início'].slot2
            ){
                periodo = 'Manhã'
            }else if(horario == config.horarios['Tarde']['Início'].slot1 ||
            horario == config.horarios['Tarde']['Início'].slot2
            ){
                periodo = 'Tarde'
            }else if(horario == config.horarios['Noite']['Início'].slot1 ||
            horario == config.horarios['Noite']['Início'].slot2
            ){
                periodo = 'Noite'
            }
        }
        return periodo
    }

    const retornaSalasOrigem = predio =>{
        let salasOrigem = salas.filter(sala=>{
            return sala.predio == predio
        })
        const unique = [...new Set(salasOrigem.map(item => item.numeroSala))].sort()

        if (predio === "predioAux"){
            let result = []
            for (let i =0; i< config.numSalasAux;i++){
                result.push("Sala A"+i.toString())
            }
            setSalasOrigem(result)
        }else{
            setSalasOrigem(unique)
        }
        
    }

    const retornaSalasDestino = predio =>{
        let salasDestino = salas.filter(sala=>{
            return sala.predio == predio
        })
        const unique = [...new Set(salasDestino.map(item => item.numeroSala))].sort()
        
        if (predio === "predioAux"){
            let result = []
            for (let i =0; i< config.numSalasAux;i++){
                result.push("Sala A"+i.toString())
            }
            setSalasDestino(result)
        }else{
            setSalasDestino(unique)
        }
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
        let usaAux = false
        let predioAux = ""
        let salaAux = ""
        let horarioAux = ""
        let capacidadeAux = 0

        if ( values.alunos1 > values.capacidade2){
            temp.capacidade2 = `A sala não tem capacidade suficiente para a troca`
        }else if (values.alunos2 > values.capacidade1){
            temp.capacidade1 = `A sala não tem capacidade suficiente para a troca`
        }else if (values.horarioFim1 == values.horarioFim2 && values.horarioFim1 == ""){
            temp.erroSala = "Ambas as salas estão vazias no horário escolhido"
        }else{
            if (values.horarioFim1 == values.horarioFim2){
                if (values.horarioInicio1 != values.horarioInicio2){
                    if (parseInt(values.horarioInicio1) > parseInt(values.horarioInicio2)){
                        predioAux = values.predio1
                        salaAux = values.sala1
                        horarioAux = values.horarioInicio2
                        capacidadeAux = values.capacidade2
                        usaAux = true
                    }else{
                        predioAux = values.predio2
                        salaAux = values.sala2
                        horarioAux = values.horarioInicio1
                        capacidadeAux = values.capacidade1
                        usaAux = true
                    }
                }
            }else{
                if (values.horarioInicio1 == values.horarioInicio2){
                    if (parseInt(values.horarioFim1) < parseInt(values.horarioFim2)){
                        predioAux = values.predio1
                        salaAux = values.sala1
                        horarioAux = values.horarioFim1
                        capacidadeAux = values.capacidade2
                        usaAux = true
                    }else{
                        predioAux = values.predio2
                        salaAux = values.sala2
                        horarioAux = values.horarioFim2
                        capacidadeAux = values.capacidade1
                        usaAux = true
                    }
                }else if (values.horarioInicio1 == "" && horariosInicio.indexOf(values.horarioInicio2) != horariosFim.indexOf(values.horarioFim2)){
                    if (horariosInicio.indexOf(values.horarioInicio) % 2 == 0){
                        predioAux = values.predio1
                        salaAux = values.sala1
                        capacidadeAux = values.capacidade2
                        horarioAux = horariosInicio[horariosInicio.indexOf(values.horarioInicio) + 1]
                        usaAux = true
                    }else{
                        predioAux = values.predio1
                        salaAux = values.sala1
                        capacidadeAux = values.capacidade2
                        horarioAux = horariosInicio[horariosInicio.indexOf(values.horarioInicio) - 1]
                        usaAux = true
                    } 
                }else if (values.horarioInicio2 == "" && horariosInicio.indexOf(values.horarioInicio1) != horariosFim.indexOf(values.horarioFim1)) {
                    if (horariosInicio.indexOf(values.horarioInicio) % 2 == 0){
                        predioAux = values.predio2
                        salaAux = values.sala2
                        capacidadeAux = values.capacidade1
                        horarioAux = horariosInicio[horariosInicio.indexOf(values.horarioInicio) + 1]
                        usaAux = true
                    }else{
                        predioAux = values.predio2
                        salaAux = values.sala2
                        capacidadeAux = values.capacidade1
                        horarioAux = horariosInicio[horariosInicio.indexOf(values.horarioInicio) - 1]
                        usaAux = true
                    } 
                }
            }
        }

        if (usaAux){
            buscaSalaTemp = turmaSearch(values.dia,horarioAux,predioAux,salaAux)
            let alocacaoTemp = alocacaoSearch(values.dia,horarioAux,predioAux,salaAux)
            if (buscaSalaTemp.turma != "Sala Vazia"){
                temp.erroSala = `A ${salaAux} do prédio ${predioAux} está ocupada com a turma ${buscaSalaTemp.turma} no horário das ${horarioAux}`
                setConfirmDialog({
                    isOpen:true,
                    title:'Trocar Salas',
                    subtitle: `A ${salaAux} do prédio ${predioAux} está ocupada com a turma ${buscaSalaTemp.turma} no horário das ${horarioAux}.
                                Deseja trocar ambas as turmas ?`,
                    onConfirm: () =>{
                        if(buscaSalaTemp.alunos > capacidadeAux ){
                            temp.capacidade2 = `Não há capacidade suficiente para a turma do horário das ${buscaSalaTemp.horarioInicio}`
                        }else{
                            temp.erroSala= ""
                            if (Object.values(temp).every(errorValues => errorValues == "")){
                                trueSubmit(alocacaoTemp)
                            }
                        }
                    }
                })
            }
        }

        setErros({
            ...temp
        })
        return Object.values(temp).every(errorValues => errorValues == "")
    }

    const alocacaoSearch = (dia,horarioInicio,predio,sala) =>{
        let alocacao  = alocacoes.find(search=>{
            return search.horario == horarioInicio &&
                   search.turma.diaDaSemana == dia &&
                   search.sala.numeroSala == sala &&
                   search.sala.predio == predio
        })
        return alocacao
    }

    const turmaSearch = (dia,horarioInicio,predio,sala) =>{
        let alocacao  = alocacaoSearch(dia,horarioInicio,predio,sala)
        let salaTemp = salas.find(search => search.numeroSala == sala && search.predio == predio)
        let capacidadeSala = salaTemp?.capacidade? salaTemp.capacidade : ""
        let result = {
            turma: alocacao?.turma? alocacao.turma.idTurma + " - " + alocacao.turma.nomeDisciplina + " - " + alocacao.turma.turma : "Sala Vazia",
            horarioInicio: alocacao?.turma?.horarioInicio? alocacao.turma.horarioInicio : "",
            horarioFim: alocacao?.turma?.horarioFim? alocacao.turma.horarioFim : "",
            capacidade: alocacao?.sala?.capacidade? alocacao.sala.capacidade : capacidadeSala,
            alunos: alocacao?.turma?.totalTurma? alocacao.turma.totalTurma : ""
        }
        return result
    }

    const salaSearch = (sala,predio) =>{
        return salas.find(search=>{
            return search.numeroSala == sala && search.predio == predio
        })
    }

    const retornaTurma = e =>{
        const {name , value} = e.target

        let case1 = false
        let case2 = false

        let findTurma = new Array(2)
        if (name == 'predio1'){
            findTurma[0] = turmaSearch(values.dia,values.horarioInicio,value,values.sala1)
            setPredioOrigem(value)
            setSalaOrigem(salaSearch(values.sala1,value))
            case1 = true
        }else if (name == 'predio2'){
            findTurma[1] = turmaSearch(values.dia,values.horarioInicio,value,values.sala2)
            setPredioDestino(value)
            setSalaDestino(salaSearch(values.sala2,value))
            case2 = true
        }else if (name == 'sala1'){
            findTurma[0] = turmaSearch(values.dia,values.horarioInicio,values.predio1,value)
            case1 = true
            setSalaOrigem(salaSearch(value,values.predio1))         
        }else if (name == 'sala2'){
            findTurma[1] = turmaSearch(values.dia,values.horarioInicio,values.predio2,value)
            case2 = true
            setSalaDestino(salaSearch(value,values.predio2))
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

    const trueSubmit = (auxParams = {}) =>{
        setConfirmDialog({...confirmDialog,isOpen:false})
        let updateId = getResultadoId(ano,semestre,values.dia,values.horarioInicio)
        let data = {
            salaOrigem,
            salaDestino,
            alocacaoOrigem: alocacaoSearch(values.dia,values.horarioInicio,values.predio1,values.sala1),
            alocacaoDestino: alocacaoSearch(values.dia,values.horarioInicio,values.predio2,values.sala2),
            alocacaoAux: auxParams? auxParams : {}
        }
        console.log(data)
        ResultadosDataService.trocaSala(data,updateId)
            .then(res=>{
                console.log(res.data)
            })
            .catch(err=>{console.log(err)})
        setErros({})
        closeModalForm()
    }


    const handleSubmit = e =>{
        e.preventDefault()
        if (validate()){
            trueSubmit()
        }else{
            console.log("não validou")
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
                <Grid item xs={12} sm={12}>
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
                        name = "horarioInicio1"
                        onChange={handleInputChange}
                        label="Horário de Início"
                        value ={values.horarioInicio1}    
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
                <Grid item xs={12} sm={3}>
                    <TextField 
                        disabled
                        variant="outlined"
                        name = "capacidade1"
                        onChange={handleInputChange}
                        label="Capacidade da Sala"
                        value ={values.capacidade1} 
                        {...(erros.capacidade1 != "" && erros.capacidade1!= null && {
                            error:true,
                            helperText:erros.capacidade1 
                        })}  
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <TextField 
                        disabled
                        variant="outlined"
                        name = "alunos1"
                        onChange={handleInputChange}
                        label="Número de Alunos"
                        value ={values.alunos1}    
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
                <Grid item xs={12} sm={12}>
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
                        name = "horarioInicio2"
                        onChange={handleInputChange}
                        label="Horário de Início"
                        value ={values.horarioInicio2}    
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
                <Grid item xs={12} sm={3}>
                    <TextField 
                        disabled
                        variant="outlined"
                        name = "capacidade2"
                        onChange={handleInputChange}
                        label="Capacidade da Sala"
                        value ={values.capacidade2}
                        {...(erros.capacidade2 != "" && erros.capacidade2!= null && {
                            error:true,
                            helperText:erros.capacidade2
                        })}   
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <TextField 
                        disabled
                        variant="outlined"
                        name = "alunos2"
                        onChange={handleInputChange}
                        label="Número de Alunos"
                        value ={values.alunos2}    
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