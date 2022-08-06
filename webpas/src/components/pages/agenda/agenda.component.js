import React, {Component, useState, useEffect} from "react";
import PageHeader from "../../re-usable/page-header.component";
import DateRangeIcon from '@mui/icons-material/DateRange';
import {Grid,Toolbar,Button, TextField, Paper, Box, TableContainer, ToggleButtonGroup, ToggleButton} from "@mui/material";
import Select from "../../forms/select.component";
import CachedTwoToneIcon from '@mui/icons-material/CachedTwoTone';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import HelpIcon from '@mui/icons-material/Help';
import { IconButton } from "@mui/material";
import { Tab,Tabs, Typography } from "@mui/material";
import PropTypes from 'prop-types';
import AgendaColunas from './agenda-colunas.component';
import AgendaLinhas from "./agenda-linhas.component";
import FileDownloadTwoToneIcon from '@mui/icons-material/FileDownloadTwoTone';
import PlaylistAddTwoToneIcon from '@mui/icons-material/PlaylistAddTwoTone';
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth';
import CalendarViewWeekIcon from '@mui/icons-material/CalendarViewWeek';
import Popover from '@mui/material/Popover';
import AgendaCampos from "./agenda-campos.component";
import TrocaSalaForm from "../../forms/trocaSalaForm.component";
import {Dialog, DialogContent} from "@mui/material";
import ResultadosDataService from '../../../services/resultados';
import * as XLSX from 'xlsx/xlsx.mjs';

const inputCss = {
    width:'100%',
    '& input':{
        paddingTop: '12px',
        paddingBottom: '12px',
        paddingRight: '12px',
    }
}

const testeArray = [
    {a: "bananas" , b : "2"},
    
    {a: "apples" , b : "3"},
    {a: "demons" , b : "5"},
    {a: "Time paradoxes" , b : "1"},
]

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
    const [resultados,setResultados] = useState([]);
    const [horariosInicio,setHorariosInicio] = useState([]);
    const [horariosFim,setHorariosFim] = useState([]);
    const [periodo,setPeriodo]= useState('');
    const [semestre,setSemestre] = useState(1);
    const [dia,setDia] = useState('Segunda');
    const [horario,setHorario] = useState(0);
    const [openTrocaSalaForm,setOpenTrocaSalaForm] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    const [formatoAgenda,setFormatoAgenda] = useState('colunas');
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [filterFn,setFilterFn] = useState({fn:items=>{return items;},fnAgenda:items=>{return items;}})
    const [state,setState] = React.useState({
        capacidade:false,
        idTurma:false,
        nomeDisciplina:true,
        codDisciplina:false,
        turma: true,
        departamentoOferta:false,
        departamentoTurma:false,
        totalTurma:false,
        docentes:false,
        creditosAula:false,
    })

    const camposOpen = Boolean(anchorEl);
    const idCampos = camposOpen ? 'simple-popover' : undefined;

    useEffect(()=>{
        retornaAnos()
        if(user === false){
            logout()
        }
    }, [])

    useEffect(()=>{
        retornaResultados(ano,semestre,dia)
    },[ano,semestre,dia])

    useEffect(()=>{
        retornaHorariosInicio()
    },[config])

    useEffect(()=>{
        setHorario(horariosInicio[0])
    },[horariosInicio])

    useEffect(()=>{
        getPeriodoByHorario(horario)
    },[horario])

    const retornaResultados = (ano,semestre,dia) =>{
        ResultadosDataService.getByAnoSemestreDia(ano,semestre,dia)
            .then(res=>{
                console.log(res.data)
                setResultados(res.data)
            }).catch(err=>console.log(err))
    }

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        setDia(config.dias[newValue])
    };

    const handleFormato = (event, novoFormato) => {
        setFormatoAgenda(novoFormato);
    };

    const handleCloseTrocaSala = () =>{
        setOpenTrocaSalaForm(false)
    }

    const handleOpenTrocaSala = () =>{
        setOpenTrocaSalaForm(true)
    }

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
            let horariosF = []
            periodos.map((periodo)=>{
                horariosI.push(config.horarios[periodo]['Ínicio'].slot1)
                horariosI.push(config.horarios[periodo]['Ínicio'].slot2)
                horariosF.push(config.horarios[periodo]['Fim'].slot1)
                horariosF.push(config.horarios[periodo]['Fim'].slot2)
            })
            setHorariosInicio(horariosI)
            setHorariosFim(horariosF) 
        }
    }

    const handleSearch = e =>{
        let target = e.target
        setFilterFn({
            fn: items =>{
                if(target.value == ""){
                    return items
                }else{
                    return items.filter(alocacao => {
                        return (
                            alocacao.horario
                                .toLowerCase()
                                .includes(target.value.toLowerCase())
                            || alocacao.turma.idTurma
                                .toLowerCase()
                                .includes(target.value.toLowerCase()) 
                            || alocacao.turma.nomeDisciplina
                                .toLowerCase()
                                .includes(target.value.toLowerCase())
                            || alocacao.turma.departamentoOferta
                                .toLowerCase()
                                .includes(target.value.toLowerCase()) 
                            || alocacao.sala.predio
                                .toLowerCase()
                                .includes(target.value.toLowerCase())               
                        )
                    }) 
                }
            },
            fnAgenda: items =>{
                if (target.value == ""){
                    return items
                }else{
                    return items.filter(alocacao =>{
                        let result = false
                        Object.keys(alocacao).map(alocacaoKey=>{
                            if(alocacao[alocacaoKey]){
                                if(alocacao[alocacaoKey].nomeDisciplina){
                                    if (alocacao[alocacaoKey].nomeDisciplina
                                        .toLowerCase()
                                        .includes(target.value.toLowerCase())){
                                            result = true
                                        }
                                }
                                if(alocacao[alocacaoKey].docentes){
                                    if (alocacao[alocacaoKey].docentes
                                        .toLowerCase()
                                        .includes(target.value.toLowerCase())){
                                            result = true
                                        }
                                }
                                if(alocacao[alocacaoKey].departamentoOferta){
                                    if (alocacao[alocacaoKey].departamentoOferta
                                        .toLowerCase()
                                        .includes(target.value.toLowerCase())){
                                            result = true
                                        }
                                }
                                if(alocacaoKey == 'predio'){
                                    if (alocacao[alocacaoKey]
                                        .toLowerCase()
                                        .includes(target.value.toLowerCase())){
                                            result = true
                                        }
                                }
                            }
                        })
                        return result
                    })
                }
            }
        })
    }

    const handleAnoSelect = e =>{
        setAno(e.target.value)
    }

    const handleSemestreSelect = e =>{
        setSemestre(e.target.value)
    }

    const handleClickCampos = (event) => {
        setAnchorEl(event.currentTarget)
    }
    
    const handleCloseCampos = () => {
        setAnchorEl(null)
    }

    const createExcelFile = () =>{
        var workbook = XLSX.utils.book_new();
        console.log(workbook)
        var worksheet = XLSX.utils.json_to_sheet(testeArray);
        console.log(worksheet)

        XLSX.utils.book_append_sheet(workbook, worksheet, "Example");
        
        XLSX.writeFile(workbook, 'Example.xlsx');
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
                        columnSpacing={1} 
                        sx={{paddingY:'12px'}} 
                        alignItems="center" 
                        justifyContent="space-between"
                        columns={31}
                    > 
                        <Grid item xs ={3} sx={{fontSize:'14px',fontWeight:'500',color:"#666"}}>Editar</Grid>
                        <Grid item xs ={3} sx={{fontSize:'14px',fontWeight:'500',color:"#666"}}>Exportar</Grid>
                        <Grid item xs ={12} sx={{fontSize:'14px',fontWeight:'500',color:"#666"}}>Buscar</Grid>
                        <Grid item xs ={12} sx={{fontSize:'14px',fontWeight:'500',color:"#666"}}>Mostrar</Grid>
                        <Grid item xs ={1} sx={{fontSize:'14px',fontWeight:'500',color:"#666"}}>Ajuda</Grid>
                        {/* Rotulos acima devem somar 31 */}
                        <Grid item xs={6} sx={{fontSize:'14px',fontWeight:'500',color:"#666"}} sm={3}>
                            <Button 
                                startIcon={<CachedTwoToneIcon/>}
                                onClick={handleOpenTrocaSala}
                                variant="contained"  
                                sx={{fontSize:'12px',paddingTop:'13px',paddingBottom:'12px'}} >Trocar
                            </Button>
                        </Grid>
                        <Grid item xs={6} sx={{fontSize:'14px',fontWeight:'500',color:"#666"}} sm={3}>
                            <Button 
                                startIcon={<FileDownloadTwoToneIcon/>} 
                                variant="contained" 
                                onClick={createExcelFile}
                                sx={{fontSize:'12px',paddingTop:'13px',paddingBottom:'12px'}} >Baixar
                            </Button>
                        </Grid>
                        <Grid item xs ={6} sm={12}>
                            <TextField
                                sx={inputCss}
                                onChange={handleSearch}
                                variant="outlined"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><SearchIcon/></InputAdornment>,
                                }}
                            />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <Select
                                label="Ano"
                                value={ano}
                                onChange={handleAnoSelect}
                                options ={anos}
                                style={selectCss}
                            />  
                        </Grid>
                        <Grid item xs={6} sm={3}>
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
                                onClick={handleClickCampos}
                                startIcon={<PlaylistAddTwoToneIcon/>} 
                                variant="contained"  
                                sx={{fontSize:'12px',paddingTop:'13px',paddingBottom:'12px'}} >Campos
                            </Button>
                            <Popover
                                id={idCampos}
                                open={camposOpen}
                                anchorEl={anchorEl}
                                onClose={handleCloseCampos}
                                anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                                }}
                            >
                                <AgendaCampos 
                                    state={state}
                                    setState={setState}   
                                />
                            </Popover>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                                <ToggleButtonGroup
                                    value={formatoAgenda}
                                    exclusive
                                    onChange={handleFormato}
                                    aria-label="formato-agenda"
                                >
                                    <ToggleButton value="colunas" aria-label="formato-colunas">
                                        <CalendarViewWeekIcon/>
                                    </ToggleButton>
                                    <ToggleButton value="linhas" aria-label="formato-linhas">
                                        <CalendarViewMonthIcon/>
                                    </ToggleButton>

                                </ToggleButtonGroup>
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
                    
                </Box>
            </Paper>
            <TableContainer sx={{top:'-5px',position:"relative"}} component={Paper}>
                <Box>
                    {
                        formatoAgenda == 'colunas' ? (
                            <AgendaColunas
                                state={state}
                                horariosInicio={horariosInicio}
                                filterFn={filterFn}
                                resultados={resultados}
                                formatoAgenda={formatoAgenda}
                            />
                        ):( 
                            <AgendaLinhas
                                state={state}
                                horariosInicio={horariosInicio}
                                filterFn={filterFn}
                                formatoAgenda={formatoAgenda}
                                resultados={resultados}
                            />
                        )
                    }
                    
                </Box>
            </TableContainer>

            <Dialog maxWidth="md"
                    id='modalForm'
                    scroll='body'
                    open={openTrocaSalaForm}
                    onClose={handleCloseTrocaSala}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                ><DialogContent >
                       <TrocaSalaForm 
                            ano={ano}
                            semestre={semestre}
                            dia={dia}
                            horariosInicio={horariosInicio}
                            horariosFim={horariosFim}
                            config={config}
                            closeModalForm={handleCloseTrocaSala}
                       /> 
            </DialogContent>
            </Dialog>

        
        </>
    )
}

export default Agenda;