import React, {Component, useState, useEffect} from "react";
import { Link } from "react-router-dom";
import PageHeader from "../page-header.component";
import CalculateIcon from '@mui/icons-material/Calculate';
import { Paper, Typography, Grid, Box } from "@mui/material";
import Select from "../forms/select.component";
import DistanciasDataService from '../../services/distancias'
import { Alert } from "@mui/material";
import { IconButton } from "@mui/material";
import HelpIcon from '@mui/icons-material/Help';
import DoneIcon from '@mui/icons-material/Done';
import { Checkbox } from "@mui/material";
import { CircularProgress } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import ResultadosDataService from "../../services/resultados"
import { Button, Divider, FormControl, FormLabel, FormControlLabel, TextField} from "@mui/material";

const thisYear =  2019//new Date().getFullYear()

const configTemp={
    horarios:[800,1000,1200,1400,1600,1800,1900,2100,2300],
    dias:['Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
    creditos:[10,6,5,4,3,2,1,0],
    anos:[2019,2020,2021,2022,2023],
    semestres:[1,2],
    periodos:['Manhã','Tarde','Noite']
}

const Solver = props =>{
    const [ano,setAno] = useState(thisYear);
    const [semestre,setSemestre] = useState(1);
    const [temTodos,setTemTodos] = useState(true);
    const [selectAll,setSelectAll] = useState(false);
    const [delta,setDelta] = useState(0);
    const [erroDelta,setErroDelta] = useState('')
    const [working,setWorking] = useState(false);
    const [executado,setExecutado] = useState(false);
    const [resultObj,setResultObj] = useState({});
    const [dispCheckBoxList,setDispCheckBoxList] = useState(() =>{
        let result = {}
        configTemp.dias.map(dia=>{
            result[dia] = {}
            configTemp.periodos.map(periodo=>{
                result[dia][periodo] = false
            })
        })
        return result
    })

    useEffect(()=>{
        retornaTemTodos()
    }, [])

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
        setSelectAll(false)
        setExecutado(false)
    }

    const handleSelectAll = e =>{
        let result = {}
        configTemp.dias.map(dia=>{
            result[dia] = {}
            configTemp.periodos.map(periodo=>{
                result[dia][periodo] = !selectAll
            })
        })
        setDispCheckBoxList(result)
        setSelectAll(!selectAll)
        setExecutado(false)
    }

    const criarLista = config =>{
        let lista = []
        config.dias.map(dia=>{
            config.periodos.map(periodo=>{
                if (dispCheckBoxList[dia][periodo]){
                    let unidade = {
                        dia: dia,
                        periodo: periodo
                    }
                    lista.push(unidade)
                }
            })
        })
        return lista
    }
 
    const handleAnoSelect = e =>{
        setAno(e.target.value)
        setExecutado(false)
    }

    const handleDeltaChange = e =>{
        setDelta(e.target.value)
        setExecutado(false)
    }

    const handleSemestreSelect = e =>{
        setSemestre(e.target.value)
        setExecutado(false)
    }

    const retornaTemTodos = () =>{
        DistanciasDataService.temTodos()
            .then(res => {
                setTemTodos(res.data.isComplete)
            }).catch(err => console.log(err))
    }

    const handleExecute = () =>{
        setExecutado(false)
        if(isNaN(delta)){
            setErroDelta("Este campo deve conter um número")
        }else{
            if (!temTodos){

            }else{
                setErroDelta('')
                setWorking(true)
                const lista = criarLista(configTemp)
                let data = {
                    ano: ano,
                    semestre:semestre,
                    delta:delta,
                    lista:lista
                }
                ResultadosDataService.calculaLista(data)
                    .then(res=>{
                        setWorking(false)
                        setExecutado(true)
                        setResultObj(res.data)
                        console.log(resultObj)
                    })
                    .catch(err=>console.log(err))
            }
        }
    }

    return (
        <>
        <PageHeader
            title="Resolver"
            subtitle="Execução do modelo de otimização"
            icon={<CalculateIcon/>}
        />
        <Paper>
            <Box padding={'30px'}>
            {temTodos ?(
                <></>
            ):(
                <Alert severity="error" sx={{marginY:'10px'}}>Existem distâncias entre prédios e departamentos 
                não informadas. A otimização só podera ser executada com todas as distâncias cadastradas.</Alert>
            )}
            <Grid container
                alignItems="center"
                columns={20}
                spacing={2}
            >
                <Grid item xs={20}>
                    <Typography fontSize={'1.1rem'} fontWeight={'405'}> Escolher Ano e Semestre</Typography>
                </Grid>
                <Grid item xs={3}>
                    <Select
                        label="Ano"
                        value={ano}
                        onChange={handleAnoSelect}
                        options ={configTemp.anos}
                    />  
                </Grid>
                <Grid item xs={3} >
                    <Select 
                        label="Semestre"
                        value={semestre}
                        onChange={handleSemestreSelect}
                        options ={configTemp.semestres}
                    />
                </Grid>
                <Grid item xs={13}></Grid>
                <Grid item xs={1}>
                    <IconButton
                            color="inherit"
                            edge="start"
                        >
                            <HelpIcon />
                        </IconButton>
                </Grid>
                <Grid item xs={20}></Grid>
                <Grid item xs={20}></Grid>

                <Grid item xs={20}>
                    <Typography fontSize={'1.1rem'} fontWeight={'405'}> Escolher dias e períodos</Typography>
                </Grid>
                <Grid item xs={20}></Grid>
                

                
                <Grid item xs ={4}></Grid>
                
                {
                    configTemp.periodos.map((periodo,index)=>{
                        return(
                            <Grid item xs={4} key={index}><Typography fontWeight={450}>{periodo}</Typography></Grid>
                        )
                    })
                }

                {
                    configTemp.dias.map((dia,index)=>{
                        return(
                            <Grid item xs ={20} key={index}>
                                <FormControl  sx={{width:'100%'}}>
                                <Grid container columnSpacing={3} alignItems="center"  justifyContent="flex-start">
                                    <Grid item xs={4}><FormLabel fontWeight={450}>{dia}</FormLabel></Grid>
                                    {configTemp.periodos.map((periodo,indexp)=>{
                                        return(
                                            <>
                                                <Grid item xs={1} key={indexp} alignContent="center"> 
                                                    <Checkbox 
                                                        name={`${dia}-${periodo}`}
                                                        onChange={handleCheckBox}
                                                        checked={dispCheckBoxList[dia][periodo]} /> 
                                                        
                                                </Grid>
                                                <Grid item xs={1}>
                                                    {working && dispCheckBoxList[dia][periodo] ?(
                                                        <CircularProgress size={16}/>
                                                    ):(
                                                        executado && dispCheckBoxList[dia][periodo] ?(
                                                            resultObj[dia]?(
                                                                resultObj[dia][periodo]?(
                                                                    <DoneIcon color="success"/>
                                                                ):(
                                                                    <CloseIcon color="error" />
                                                                )
                                                            ):(<></>)
                                                       ):(
                                                            <></>
                                                       )
                                                    )}
                                                    
                                                    
                                                </Grid>
                                                <Grid item xs={2}></Grid>
                                            </>
                                        )
                                    })}
                                </Grid>
                                </FormControl>
                            </Grid>
                        )
                    })
                }

                <Grid item xs={20}>
                    <FormControlLabel control={<Checkbox checked={selectAll} onChange={handleSelectAll}/>} label="Selecionar Todos" />
                </Grid>

                <Grid item xs={20}></Grid>

                <Grid item xs={20}>
                    <Typography fontSize={'1.1rem'} fontWeight={'405'}> Escolher delta</Typography>
                </Grid>
                <Grid item xs={20}></Grid>
                <Grid item xs={20}>
                    <TextField
                        variant="outlined"
                        label="Delta*"
                        name = "delta"
                        onChange={handleDeltaChange}
                        value ={delta}
                        {...(erroDelta != null && erroDelta != "" && {
                            error:true,
                            helperText:erroDelta
                        })}
                    />
                </Grid>
                <Grid item xs={20}></Grid>
                <Grid item xs={20}></Grid>
                <Grid item xs={20}>
                        <Button variant="contained" onClick={handleExecute}> Executar</Button>

                </Grid>
                
            </Grid>
            </Box>
        </Paper>
        </>
    )
}

export default Solver