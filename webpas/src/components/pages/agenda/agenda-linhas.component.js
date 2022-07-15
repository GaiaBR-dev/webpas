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


const AgendaLinhas = props =>{
    const {ano,semestre,dia,config,horariosInicio,state,filterFn,formatoAgenda} = props

    const [resultados,setResultados] = useState([]);
    const [alocacoes,setAlocacoes] = useState([]);
    const [tableObj,setTableObj] = useState([]);

    useEffect(()=>{
        retornaResultados(ano,semestre,dia)
    },[ano,semestre,dia,formatoAgenda])

    useEffect(()=>{
        retornaAlocacoes()
    },[resultados])

    useEffect(()=>{
        retornaTableObjs()
    },[alocacoes])

    const retornaResultados = (ano,semestre,dia) =>{
        ResultadosDataService.getByAnoSemestreDia(ano,semestre,dia)
            .then(res=>{
                console.log(res.data)
                setResultados(res.data)
            }).catch(err=>console.log(err))
    }

    const sortAlocacoes = array =>{
        let sortedArray = array.sort((a,b)=>{
            if (a.predio < b.predio){
                return -1
            } 
            if (a.predio > b.predio){
                return 1
            }
            return 0
        })
        return sortedArray
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
        }
    }

    const retornaTableObjs = () =>{
        const unique = alocacoes.reduce((acc, cur) => {

            const search = acc.find(obj => obj.sala === cur.sala.numeroSala && obj.predio === cur.sala.predio)
            
            if (!search) {
            acc.push({ sala: cur.sala.numeroSala, predio: cur.sala.predio})
            }
            
            return acc
        }, [])
        
        const tableObjs = unique.map(obj=>{
            let result = {...obj}
            horariosInicio.map(horario=>{
                let alocacao = alocacoes.find(aloc=>(
                    aloc.sala.numeroSala == obj.sala &&
                    aloc.sala.predio == obj.predio &&
                    aloc.horario == horario
                ))
                if (alocacao){
                    result[horario] = alocacao.turma
                    result[horario].capacidade = alocacao.sala.capacidade
                }
            })
            return result
        })
        setTableObj(sortAlocacoes(tableObjs))
    }

    return (
        <>
        <Box>
            <Grid container spacing={1.5} justifyContent='space-around' alignItems="center" columns={22} padding={'20px 30px 0px 20px'}>
                <Grid item xs={2}><Typography sx={tableHeadCss} >Prédio</Typography></Grid>
                <Grid item xs={2}><Typography sx={tableHeadCss} >Sala</Typography></Grid>
                {
                    horariosInicio.map(horario=>{
                        return(
                            <>
                                <Grid item xs={3}><Typography sx={tableHeadCss} >{horario}</Typography></Grid>
                            </>
                        )
                    })
                } 
                 <Grid item xs={26}><Divider></Divider></Grid>
            </Grid>
        </Box>
        <TableContainer component={Paper} sx={{boxShadow:"0"}}>
            <Grid container  maxHeight={'550px'} justifyContent='space-around' spacing={1.5} alignItems="center" columns={22} padding={'10px 20px 10px 20px'}> 
               {
                    tableObj.map(obj=>{
                        return(
                            <>
                                <Grid item xs={2}><Typography sx={tableRowCss} >{obj.predio}</Typography></Grid>
                                <Grid item xs={2}><Typography sx={tableRowCss} >{obj.sala}</Typography></Grid>
                                {
                                    horariosInicio.map(horario=>{
                                        return(
                                            <>
                                                <Grid item xs={3}>
                                                    {
                                                        state.capacidade && obj[horario] ?(
                                                            <>
                                                                <Typography sx={tableRowCss}>
                                                                    {obj[horario].capacidade}
                                                                </Typography>
                                                            </>
                                                        ):(<></>)
                                                    }
                                                    {
                                                        state.nomeDisciplina && obj[horario] ?(
                                                            <>
                                                                <Typography sx={tableRowCss}>
                                                                    {obj[horario].nomeDisciplina}
                                                                </Typography>
                                                            </>
                                                        ):(<></>)
                                                    }
                                                    {
                                                        state.turma && obj[horario] ?(
                                                            <>
                                                                <Typography sx={tableRowCss}>
                                                                    {obj[horario].turma}
                                                                </Typography>
                                                            </>
                                                        ):(<></>)
                                                    }
                                                    {
                                                        state.idTurma && obj[horario] ?(
                                                            <>
                                                                <Typography sx={tableRowCss}>
                                                                    {obj[horario].idTurma}
                                                                </Typography>
                                                            </>
                                                        ):(<></>)
                                                    }
                                                    {
                                                        state.docentes && obj[horario] ?(
                                                            <>
                                                                <Typography sx={tableRowCss}>
                                                                    {obj[horario].docentes}
                                                                </Typography>
                                                            </>
                                                        ):(<></>)
                                                    }

                                                    
                                                </Grid>
                                            </>
                                        )
                                    })
                                }
                                <Grid item xs={22}><Divider></Divider></Grid>
                            </>
                        )
                    })
               }
            </Grid>
        </TableContainer>
        
        </>
    )


}

export default AgendaLinhas