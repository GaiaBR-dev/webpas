import React, {Component, useState, useEffect} from "react";
import PageHeader from "../../re-usable/page-header.component";
import DateRangeIcon from '@mui/icons-material/DateRange';
import {Grid,Toolbar,Button, TextField, Paper, Box, TableContainer} from "@mui/material";
import Select from "../../forms/select.component";
import CachedTwoToneIcon from '@mui/icons-material/CachedTwoTone';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import HelpIcon from '@mui/icons-material/Help';
import { IconButton } from "@mui/material";
import { Tab,Tabs, Typography } from "@mui/material";
import PropTypes from 'prop-types';
import AgendaColunas from './agenda-colunas.component';
import FileDownloadTwoToneIcon from '@mui/icons-material/FileDownloadTwoTone';
import PlaylistAddTwoToneIcon from '@mui/icons-material/PlaylistAddTwoTone';

const inputCss = {
    width:'100%',
    '& input':{
        paddingTop: '12px',
        paddingBottom: '12px',
        paddingRight: '12px',
    }
}

const selectCss = {
    '& .MuiSelect-select':{
        paddingTop:'12px',
        paddingBottom:'12px'
    }

}

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

const thisYear = new Date().getFullYear()

const Agenda = props =>{
    const {user,logout,config} = props

    const [ano,setAno] = useState(thisYear);
    const [anos,setAnos] = useState([]);
    const [horariosInicio,setHorariosInicio] = useState([]);
    const [periodo,setPeriodo]= useState('');
    const [semestre,setSemestre] = useState(1);
    const [dia,setDia] = useState('Segunda');
    const [horario,setHorario] = useState(0);
    const [tabValue, setTabValue] = useState(0);
    const [resultados, setResultados] = useState([]);
    const [tabValueX, setTabValueX] = useState(0);
    const [tabHorarioValue, setTabHorarioValue] = useState(0);

    useEffect(()=>{
        retornaAnos()
    }, [])

    useEffect(()=>{
        retornaHorariosInicio()
    },[config])

    useEffect(()=>{
        setHorario(horariosInicio[0])
    },[horariosInicio])

    useEffect(()=>{
        getPeriodoByHorario(horario)
    },[horario])

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        setDia(config.dias[newValue])
    };

    const getPeriodoByHorario = horario =>{
        let periodo = ''
        if(config.horarios){
            if(horario == config.horarios['Manhã']['Ínicio'].slot1 ||
                horario == config.horarios['Manhã']['Ínicio'].slot2
            ){
                periodo = 'Manhã'
            }else if(horario == config.horarios['Tarde']['Ínicio'].slot1 ||
            horario == config.horarios['Tarde']['Ínicio'].slot2
            ){
                periodo = 'Tarde'
            }else if(horario == config.horarios['Noite']['Ínicio'].slot1 ||
            horario == config.horarios['Noite']['Ínicio'].slot2
            ){
                periodo = 'Noite'
            }
            setPeriodo(periodo)
        }
    }

    const retornaAnos = () =>{
        const anoAtual = new Date().getFullYear()
        const firstYear = anoAtual - 4
        let anos = []
        for(let i=0;i<6;i++){
            let anoA = firstYear + i
            anos.push(anoA)
        }
        setAnos(anos)
    }

    const retornaHorariosInicio = () =>{
        let periodos = config.periodos ? config.periodos : []
        if(config.horarios){
            let horariosI = []
            periodos.map((periodo)=>{
                horariosI.push(config.horarios[periodo]['Ínicio'].slot1)
                horariosI.push(config.horarios[periodo]['Ínicio'].slot2)
            })
            setHorariosInicio(horariosI)
        }
    }

    const handleTabXChange = (event, newValue) => {
        setTabValueX(newValue);
    };

    const handleTabHorarioChange = (event, newValue) => {
        setTabHorarioValue(newValue);
        setHorario(horariosInicio[newValue])
        
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
                <Toolbar sx={{paddingY:'8px'}}>
                    <Grid container 
                        rowSpacing={1.5}
                        columnSpacing={2} 
                        sx={{paddingY:'12px'}} 
                        alignItems="center" 
                        justifyContent="space-between"
                        columns={24}
                    > 
                        <Grid item xs ={3} sx={{fontSize:'14px',fontWeight:'500',color:"#666"}}>Editar</Grid>
                        <Grid item xs ={3} sx={{fontSize:'14px',fontWeight:'500',color:"#666"}}>Exportar</Grid>
                        <Grid item xs ={10} sx={{fontSize:'14px',fontWeight:'500',color:"#666"}}>Buscar</Grid>
                        <Grid item xs ={7} sx={{fontSize:'14px',fontWeight:'500',color:"#666"}}>Mostrar</Grid>
                        <Grid item xs ={1} sx={{fontSize:'14px',fontWeight:'500',color:"#666"}}>Ajuda</Grid>
                        {/* Rotulos acima devem somar 24 */}
                        <Grid item xs={6} sx={{fontSize:'14px',fontWeight:'500',color:"#666"}} sm={3}>
                            <Button 
                                startIcon={<CachedTwoToneIcon/>} 
                                variant="contained"  
                                sx={{fontSize:'12px',paddingTop:'13px',paddingBottom:'12px'}} >Trocar Salas
                            </Button>
                        </Grid>
                        <Grid item xs={6} sx={{fontSize:'14px',fontWeight:'500',color:"#666"}} sm={3}>
                            <Button 
                                startIcon={<FileDownloadTwoToneIcon/>} 
                                variant="contained"  
                                sx={{fontSize:'12px',paddingTop:'13px',paddingBottom:'12px'}} >Exportar
                            </Button>
                        </Grid>
                        <Grid item xs ={6} sm={10}>
                            <TextField
                                sx={inputCss}
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
                                options ={anos}
                                style={selectCss}
                            />  
                        </Grid>
                        <Grid item xs={6} sm={2}>
                            <Select 
                                label="Semestre"
                                value={semestre}
                                onChange={handleSemestreSelect}
                                options ={[1,2]}
                                style={selectCss}
                            />
                        </Grid>
                        <Grid item xs={6} sx={{fontSize:'14px',fontWeight:'500',color:"#666"}} sm={3}>
                            <Button 
                                startIcon={<PlaylistAddTwoToneIcon/>} 
                                variant="contained"  
                                sx={{fontSize:'12px',paddingTop:'13px',paddingBottom:'12px'}} >Colunas
                            </Button>
                        </Grid>
                        <Grid item xs={6} sm={1}>
                            <IconButton
                                sx={{marginLeft:'4px'}}
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
                <Box padding={'5px'}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={tabValue} onChange={handleTabChange} aria-label="aba de dias">
                            {
                                config.dias.map((dia,indexD)=>{
                                    return(
                                        <Tab label={dia} {...a11yProps(indexD)} />
                                    )
                                })
                            }
                        </Tabs>
                    </Box>
                    {
                        config.dias.map((dia,indexD)=>{
                            return(
                                <TabPanel value={tabValue} index={indexD}>
                                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                        <Tabs value={tabHorarioValue} onChange={handleTabHorarioChange} aria-label="aba de dias">
                                            {horariosInicio.map((horario,indexH)=>{
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
            <TableContainer sx={{top:'-20px',position:"relative"}} component={Paper}>
                <Box width="1440px">
                    <AgendaColunas
                        ano={ano}
                        semestre={semestre}
                        periodo={periodo}
                        dia={dia}
                        horario={horario}
                    />
                </Box>
            </TableContainer>



        
        </>
    )
}

export default Agenda;