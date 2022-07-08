import React, {Component, useEffect, useState} from "react";
import ResultadosDataService from '../../../services/resultados'
import { Grid } from "@mui/material";
import { Typography } from "@mui/material";

const tableHeadCss = {
    fontWeight:'450',
    fontSize:'1.1rem'
}


const AgendaColunas = props =>{
    const {ano,semestre,dia,periodo,config,horario} = props

    const [resultados,setResultados] = useState([]);
    const [alocacoes,setAlocacoes] = useState([]);

    useEffect(()=>{
        retornaResultados(ano,semestre,dia,periodo)
    },[ano,semestre,dia,periodo])

    useEffect(()=>{
        console.log(resultados[0])
        retornaAlocacoes()
    },[resultados,horario])

    const retornaResultados = (ano,semestre,dia,periodo) =>{
        ResultadosDataService.getByAnoSemestreDiaPeriodo(ano,semestre,dia,periodo)
            .then(res=>{
                setResultados(res.data)
            }).catch(err=>console.log(err))
    }

    const retornaAlocacoes = () =>{
        let alocacoes = []
        let resultado = resultados[0] ? resultados[0] : {alocacoes:[]}
        resultado.alocacoes.map((tupla,index)=>{
            if(tupla.turma.horarioInicio == horario){
                alocacoes.push(tupla)
            }
        })
        console.log(alocacoes)
        setAlocacoes(alocacoes)
    }
    
    return (
        <>
        <Grid container spacing={1.5} alignItems="center" columns={20} padding={'20px'}> 
            <Grid item xs={2}><Typography sx={tableHeadCss}>Prédio</Typography></Grid>
            <Grid item xs={2}><Typography sx={tableHeadCss}>Sala</Typography></Grid>
            <Grid item xs={5}><Typography sx={tableHeadCss}>Disciplina</Typography></Grid>
            <Grid item xs={2}><Typography sx={tableHeadCss}>Turma</Typography></Grid>

            <Grid item xs={9}></Grid>
            {
                alocacoes.map((alocacao,index)=>{
                    return(
                        <>
                            <Grid item xs={2}>{alocacao.sala.predio}</Grid>
                            <Grid item xs={2}>{alocacao.sala.numeroSala}</Grid>
                            <Grid item xs={5}>{alocacao.turma.nomeDisciplina}</Grid>
                            <Grid item xs={2}>{alocacao.turma.turma}</Grid>
                            <Grid item xs={9}></Grid>

                        
                        </>
                    )
                })
            }
        </Grid>
        </>
    )


}

export default AgendaColunas