import React, {Component, useEffect, useState} from "react";
import ResultadosDataService from '../../../services/resultados'
import { Grid, Box, TableContainer, Paper, Divider } from "@mui/material";
import { Typography } from "@mui/material";

const tableHeadCss = {
    fontWeight:'450',
    fontSize:'0.9rem',
    textAlign:"center"
}

const tableRowCss = {
    fontWeight:'400',
    fontSize:'0.8rem',
    textAlign:"center"

}


const AgendaColunas = props =>{
    const {ano,semestre,dia,config,horariosInicio,state,filterFn} = props

    const [resultados,setResultados] = useState([]);
    const [alocacoes,setAlocacoes] = useState([]);
    const [numCampos,setNumCampos] = useState(0);
    

    useEffect(()=>{
        retornaResultados(ano,semestre,dia)
    },[ano,semestre,dia])

    useEffect(()=>{
        retornaAlocacoes()
    },[resultados])

    useEffect(()=>{
        retornaNumCampos()
    },[state])

    const retornaNumCampos = () =>{
        let nCampos = 0
        Object.keys(state).map(campo=>{
            if (state[campo]){
                nCampos++
            }
        })
        setNumCampos(nCampos)
    }

    const retornaResultados = (ano,semestre,dia) =>{
        ResultadosDataService.getByAnoSemestreDia(ano,semestre,dia)
            .then(res=>{
                console.log(res.data)
                setResultados(res.data)
            }).catch(err=>console.log(err))
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

    const sortAlocacoes = array =>{
        let sortedArray = array.sort((a,b)=>{
            if (a.horario < b.horario){
                return -1
            } 
            if (a.horario > b.horario){
                return 1
            }
            return 0
        })
        return sortedArray
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
            let sortedAlocacoes = sortAlocacoes(alocacoesTemp)
            setAlocacoes(sortedAlocacoes)
        }
    }

    return (
        <>
        <Box>
            <Grid container spacing={1.5} alignItems="center" columns={26} padding={'20px 30px 0px 20px'}>
                <Grid item xs={2}><Typography sx={tableHeadCss} >Prédio</Typography></Grid>
                <Grid item xs={2}><Typography sx={tableHeadCss} >Sala</Typography></Grid>
                <Grid item xs={2}><Typography sx={tableHeadCss} >Horário</Typography></Grid>
                {state.capacidade?(
                    <Grid item xs={2}><Typography sx={tableHeadCss}>Capacidade</Typography></Grid>
                ):(<></>)}
                {state.idTurma?(
                    <Grid item xs={2}><Typography sx={tableHeadCss}>id da Turma</Typography></Grid>
                ):(<></>)}
                {state.nomeDisciplina?(
                    <Grid item xs={22 - numCampos*2}><Typography sx={tableHeadCss}>Nome da Disciplina</Typography></Grid>
                ):(<></>)}
                {state.codDisciplina?(
                    <Grid item xs={2}><Typography sx={tableHeadCss}>Cod. da Disciplina</Typography></Grid>
                ):(<></>)}
                {state.turma?(
                    <Grid item xs={2}><Typography sx={tableHeadCss}>Turma</Typography></Grid>
                ):(<></>)}
                {state.departamentoOferta?(
                    <Grid item xs={2}><Typography sx={tableHeadCss}>Departamento de Oferta</Typography></Grid>
                ):(<></>)}
                {state.departamentoTurma?(
                    <Grid item xs={2}><Typography sx={tableHeadCss}>Departamento Recomendado</Typography></Grid>
                ):(<></>)}
                {state.totalTurma?(
                    <Grid item xs={2}><Typography sx={tableHeadCss}>Número de Alunos</Typography></Grid>
                ):(<></>)}
                {state.docentes?(
                    <Grid item xs={2}><Typography sx={tableHeadCss}>Docentes</Typography></Grid>
                ):(<></>)}
                {state.creditosAula?(
                    <Grid item xs={2}><Typography sx={tableHeadCss}>Créditos</Typography></Grid>
                ):(<></>)}
                {
                    state.nomeDisciplina ? (
                        <></>
                    ):(
                        <Grid item xs={20 - numCampos*2}></Grid>
                    )
                }
                 <Grid item xs={26}><Divider></Divider></Grid>
            </Grid>
        </Box>
        <TableContainer component={Paper} sx={{boxShadow:"0"}}>
            <Grid container  maxHeight={'550px'} spacing={1.5} alignItems="center" columns={26} padding={'10px 20px 10px 20px'}> 
                {
                    filterFn.fn(alocacoes).map((alocacao,index)=>{
                        return(
                        <React.Fragment key={index}>
                            <Grid item xs={2}><Typography sx={tableRowCss} >{alocacao.sala.predio}</Typography></Grid>
                            <Grid item xs={2}><Typography sx={tableRowCss} >{alocacao.sala.numeroSala}</Typography></Grid>
                            <Grid item xs={2}><Typography sx={tableRowCss} >{alocacao.horario}</Typography></Grid>
                            {state.capacidade?(
                                <Grid item xs={2}><Typography sx={tableRowCss}>{alocacao.sala.capacidade}</Typography></Grid>
                            ):(<></>)}
                            {state.idTurma?(
                                <Grid item xs={2}><Typography sx={tableRowCss}>{alocacao.turma.idTurma}</Typography></Grid>
                            ):(<></>)}
                            {state.nomeDisciplina?(
                                <Grid item xs={22 - numCampos*2}><Typography sx={tableRowCss}>{alocacao.turma.nomeDisciplina}</Typography></Grid>
                            ):(<></>)}
                            {state.codDisciplina?(
                                <Grid item xs={2}><Typography sx={tableRowCss}>{alocacao.turma.codDisciplina}</Typography></Grid>
                            ):(<></>)}
                            {state.turma?(
                                <Grid item xs={2}><Typography sx={tableRowCss}>{alocacao.turma.turma}</Typography></Grid>
                            ):(<></>)}
                            {state.departamentoOferta?(
                                <Grid item xs={2}><Typography sx={tableRowCss}>{alocacao.turma.departamentoOferta}</Typography></Grid>
                            ):(<></>)}
                            {state.departamentoTurma?(
                                <Grid item xs={2}><Typography sx={tableRowCss}>{alocacao.turma.departamentoTurma}</Typography></Grid>
                            ):(<></>)}
                            {state.totalTurma?(
                                <Grid item xs={2}><Typography sx={tableRowCss}>{alocacao.turma.totalTurma}</Typography></Grid>
                            ):(<></>)}
                            {state.docentes?(
                                <Grid item xs={2}><Typography sx={tableRowCss}>{alocacao.turma.docentes}</Typography></Grid>
                            ):(<></>)}
                            {state.creditosAula?(
                                <Grid item xs={2}><Typography sx={tableRowCss}>{alocacao.turma.creditosAula}</Typography></Grid>
                            ):(<></>)}
                            {
                                state.nomeDisciplina ? (
                                    <></>
                                ):(
                                    <Grid item xs={20 - numCampos*2}></Grid>
                                )
                            }
                           
                        </React.Fragment>
                        )   
                    })
                }
            </Grid>
        </TableContainer>
        
        </>
    )


}

export default AgendaColunas