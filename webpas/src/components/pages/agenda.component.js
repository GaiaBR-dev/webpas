import React, {Component, useState, useEffect} from "react";
import { Link } from "react-router-dom";
import PageHeader from "../page-header.component";
import DateRangeIcon from '@mui/icons-material/DateRange';
import {Grid,Toolbar,Button, TextField, Paper, Box} from "@mui/material";
import Select from "../forms/select.component";
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import HelpIcon from '@mui/icons-material/Help';
import { IconButton } from "@mui/material";
import { Tab,Tabs, Typography } from "@mui/material";
import PropTypes from 'prop-types';

const thisYear =  2019//new Date().getFullYear()

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 2 }}>
            {children}
          </Box>
        )}
      </div>
    );
  }
  
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };
  
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
}

const configTemp={
    horarios:[800,1000,1200,1400,1600,1800,1900,2100,2300],
    horariosInicio:[800,1000,1400,1600,1900,2100],
    dias:['Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
    creditos:[10,6,5,4,3,2,1,0],
    anos:[2019,2020,2021,2022,2023],
    semestres:[1,2],
    periodos:['Manhã','Tarde','Noite']
}

const Agenda = props =>{
    const [ano,setAno] = useState(thisYear);
    const [semestre,setSemestre] = useState(1);
    const [dia,setDia] = useState(configTemp.dias[0]);
    const [horario,setHorario] = useState(configTemp.horariosInicio[0]);
    const [tabValue, setTabValue] = useState(0);
    const [resultados, setResultados] = useState([]);
    const [tabValueX, setTabValueX] = useState(0);
    const [tabHorarioValue, setTabHorarioValue] = useState(0);

    useEffect(()=>{
        console.log('dia : ' + dia)
        console.log('horario : ' + horario)
    }, [ano,semestre])

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        setDia(configTemp.dias[newValue])
    };

    const handleTabXChange = (event, newValue) => {
        setTabValueX(newValue);
    };

    const handleTabHorarioChange = (event, newValue) => {
        setTabHorarioValue(newValue);
        setHorario(configTemp.horariosInicio[newValue])
    };

    const handleAnoSelect = e =>{
        setAno(e.target.value)
    }

    const handleSemestreSelect = e =>{
        setSemestre(e.target.value)
    }

    return(
        <>
            <PageHeader 
                title="Agenda"
                subtitle="Visualização dos resultados"
                icon={<DateRangeIcon />}
            />
            <Paper>
                <Toolbar>
                    <Grid container 
                        spacing={2} 
                        sx={{paddingY:'12px'}} 
                        alignItems="center" 
                        justifyContent="space-between"
                        columns={20}
                    > 
                        <Grid item xs ={5} sx={{fontSize:'14px',fontWeight:'500',color:"#666"}}>Adicionar</Grid>
                        <Grid item xs ={9} sx={{fontSize:'14px',fontWeight:'500',color:"#666"}}>Buscar</Grid>
                        <Grid item xs ={4} sx={{fontSize:'14px',fontWeight:'500',color:"#666"}}>Mostrar</Grid>
                        <Grid item xs ={1} sx={{fontSize:'14px',fontWeight:'500',color:"#666"}}>Ajuda</Grid>
                        <Grid item xs={6} sx={{fontSize:'14px',fontWeight:'500',color:"#666"}} sm={2}>
                            <Button 
                                startIcon={<AddIcon/>} 
                                variant="contained"  
                                sx={{fontSize:'12px',paddingTop:'12px',paddingBottom:'12px'}} >Arquivo
                            </Button>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <Button 
                                startIcon={<AddIcon/>} 
                                variant="contained" 
                                sx={{fontSize:'12px',paddingTop:'12px',paddingBottom:'12px'}}>Formulário
                            </Button>
                        </Grid>
                        <Grid item xs ={6} sm={9}>
                            <TextField
                                sx={{width:'100%'}}
                                variant="outlined"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><SearchIcon/></InputAdornment>,
                                }}
                            />
                        </Grid>
                        <Grid item xs={6} sm={2}>
                            <Select
                                label="Ano"
                                value={ano}
                                onChange={handleAnoSelect}
                                options ={configTemp.anos}
                            />  
                        </Grid>
                        <Grid item xs={6} sm={2}>
                            <Select 
                                label="Semestre"
                                value={semestre}
                                onChange={handleSemestreSelect}
                                options ={configTemp.semestres}
                            
                            />
                        </Grid>
                        <Grid item xs={6} sm={1}>
                            <IconButton
                                color="inherit"
                                edge="start"
                            >
                                <HelpIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Toolbar>
            </Paper>
            <br/>
            <Paper>
                <Box padding={'5px'} width={'100%'}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={tabValue} onChange={handleTabChange} aria-label="aba de dias">
                            {
                                configTemp.dias.map((dia,indexD)=>{
                                    return(
                                        <Tab label={dia} {...a11yProps(indexD)} />
                                    )
                                })
                            }
                        </Tabs>
                    </Box>
                    {
                        configTemp.dias.map((dia,indexD)=>{
                            return(
                                <TabPanel value={tabValue} index={indexD}>
                                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                        <Tabs value={tabHorarioValue} onChange={handleTabHorarioChange} aria-label="aba de dias">
                                            {configTemp.horariosInicio.map((horario,indexH)=>{
                                                return(
                                                    <Tab label={horario} {...a11yProps(indexD+"_"+indexH)} />
                                                )
                                            })}
                                        </Tabs>



                                    </Box>
                                </TabPanel>
                            )
                        })
                    }
                </Box>
            </Paper>




                    <br/>
                    <br/>
            <Paper>
                <Box padding={'5px'} width={'100%'}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs  
                                value={tabValueX} 
                                variant="scrollable"
                                scrollButtons="auto"
                                onChange={handleTabXChange} 
                                aria-label="aba de dias"
                            >
                                {
                                    configTemp.dias.map((dia,indexD)=>{
                                        return configTemp.horariosInicio.map((horario,indexH)=>{
                                            return(
                                                <Tab label={`${dia} ${horario}`} {...a11yProps("X" + indexD+"_"+indexH)} />
                                            )
                                        })
                                    })
                                }
                            </Tabs>
                    </Box>
                </Box>
            </Paper>
        </>
    )
}

export default Agenda;