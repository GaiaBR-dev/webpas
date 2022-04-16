import React from "react";
import TurmaForm from '../forms/turmaForm.component'
import FileForm from "../forms/fileForm.component";
import PageHeader from '../page-header.component';
import SchoolIcon from '@mui/icons-material/School';
import { Modal, TableBody, TableCell, TableRow, Grid, Toolbar, TextField, DialogContent } from "@mui/material";
import {Dialog, Button, IconButton}  from "@mui/material"
import HelpIcon from '@mui/icons-material/Help';
import useTable from "../useTable";
import TurmasDataService from '../../services/turmas'
import { useEffect, useState } from 'react';
import { TableContainer, Paper } from "@mui/material";
import Select from "../forms/select.component";
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Mensagem from "../mensagem.component";
import ConfirmDialog from "../confirmDialog.component";
import handleServerResponses from "../../services/response-handler";
import { Checkbox } from "@mui/material";

const configTemp={
    horarios:[800,1000,1200,1400,1600,1800,1900,2100,2300],
    dias:['Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
    creditos:[10,6,5,4,3,2,1,0],
    anos:[2019,2020,2021,2022,2023],
    semestres:[1,2]
}

const tableRowCss ={
    '& .MuiTableCell-root':{
        padding:1,
    }
}

const tableStyle ={
    '& thead th span':{
        fontWeight: '600',
        fontSize:'0.7rem',
    },
    '& tbody td': {
        fontSize:'0.7rem',
    }
}

const headCells =[
    {id:'actions',label:"Editar", disableSorting:true},
    {id:'idTurma', label:'idTurma'},
    {id:'nomeDisciplina', label:'Nome da Disciplina'},
    {id:'turma', label:'Turma'},
    {id:'totalTurma', label:'Total de Alunos'},
    {id:'diaDaSemana', label:'Dia'},
    {id:'horarioInicio', label:'Horário de Ínicio'},
    {id:'horarioFim', label:'Horário de Término'},
    {id:'creditosAula', label:'Creditos'},
    {id:'departamentoOferta', label:'Departamento de Oferta'},
    {id:'departamentoTurma', label:'Departamento Recomendado'},
    {id:'campus', label:'Campus'},
    {id:'docentes', label:'Docentes'},
    {id:'codDisciplina', label:'Código da Disciplina'},
    
]

const thisYear =  2019//new Date().getFullYear()

const TurmasList = props =>{
    const [turmas,setTurmas] = useState([]);
    const [openModalForm, setOpenModalForm] = React.useState(false);
    const [openModalFile, setOpenModalFile] = React.useState(false);
    const [turmaEdit,setTurmaEdit] = useState(null)
    const [updatingT,setUpdatingT] = useState(false)
    const [filterFn,setFilterFn] = useState({fn:items=>{return items;}})
    const [anoTable,setAnoTable] = useState(thisYear)
    const [semestreTable,setSemestreTable] = useState(1)
    const [notify,setNotify] = useState({isOpen:false,message:'',type:''})
    const [confirmDialog,setConfirmDialog] = useState({isOpen:false,title:'',subtitle:''})
    const [selected, setSelected] = React.useState([]);

    const handleCloseModalForm = () => {
        setOpenModalForm(false)
        setSelected([])
    };
    const handleOpenModalFile = () => setOpenModalFile(true);
    const handleCloseModalFile = () => setOpenModalFile(false);

    useEffect(()=>{
        retornaTurmas(anoTable,semestreTable)
    }, [anoTable,semestreTable,notify])

    const retornaTurmas = (ano,semestre) =>{
        TurmasDataService.getByAnoSemestre(ano,semestre)
            .then(response => {
                setTurmas(response.data)
            })
            .catch(err => handleServerResponses(err,setNotify))
    }

    const handleAnoTableSelect = e =>{
        setAnoTable(e.target.value)
    }

    const handleSemestreTableSelect = e =>{
        setSemestreTable(e.target.value)
    }

    const handleUpdatingT= isUpdating => {
        isUpdating? setUpdatingT(true): setUpdatingT(false)
    }

    const handleSearch = e =>{
        let target = e.target
        setFilterFn({
            fn: items =>{
                if(target.value == ""){
                    return items
                }else{
                    return items.filter(turma => {
                        return (
                            turma.nomeDisciplina
                                .toLowerCase()
                                .includes(target.value.toLowerCase())
                           // || turma.docentes
                           //     .toLowerCase()
                          //      .includes(target.value.toLowerCase()) 
                        )
                    }) 
                }
            }
        })
    }
    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
          const newSelecteds = recordsAfterPagingAndSorting().map((turma) => turma._id);
          setSelected(newSelecteds);
          return;
        }
        setSelected([]);
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];
    
        if (selectedIndex === -1) {
          newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
          newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
          newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
          newSelected = newSelected.concat(
            selected.slice(0, selectedIndex),
            selected.slice(selectedIndex + 1),
          );
        }
    
        setSelected(newSelected);
    };

    const fileHandleResponse = res =>{
        setOpenModalFile(false)
        handleServerResponses('turmas',res,setNotify)
        retornaTurmas(anoTable,semestreTable)
    }
    

    const addOrEdit = (updating,turma,resetForm) =>{
        let data= {...turma}
        if (updating){
            TurmasDataService.updateTurma(turma._id,data)
                .then(res =>handleServerResponses('turmas',res,setNotify))
                .catch(err=>handleServerResponses('turmas',err,setNotify))
            setSelected([]);
        }else{
            TurmasDataService.addTurma(data)
                .then(res =>handleServerResponses('turmas',res,setNotify))
                .catch(err=>handleServerResponses('turmas',err,setNotify))
        }
        resetForm()
        setOpenModalForm(false)
        retornaTurmas(anoTable,semestreTable)
    }

    const onDelete =(turmas)=>{
        setConfirmDialog({
            ...confirmDialog,
            isOpen:false
        })
        let data={turmasID:turmas}
        TurmasDataService.deleteTurmas(data)
            .then(res =>handleServerResponses('turmas',res,setNotify))
            .catch(err=>handleServerResponses('turmas',err,setNotify))
        retornaTurmas(anoTable,semestreTable)
        setSelected([]);
    }

    const{
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting
    }=useTable(turmas,headCells,filterFn)

    const openInModalEdit = turma =>{
        handleUpdatingT(true)
        setTurmaEdit(turma)
        setOpenModalForm(true)
    }

    const openInModalNew = () =>{
        handleUpdatingT(false)
        setTurmaEdit(null)
        setOpenModalForm(true)
    }

    return(
        <>
            <PageHeader 
                title="Turmas"
                subtitle="Cadastro, edição e visualização de turmas"
                icon={<SchoolIcon />}
            />
            <Mensagem 
                notify={notify}
                setNotify={setNotify}
            />
            <ConfirmDialog
                confirmDialog={confirmDialog}
                setConfirmDialog={setConfirmDialog}
            />
            <TableContainer component={Paper}>
                <Modal
                    id='modalFile'
                    open={openModalFile}
                    onClose={handleCloseModalFile}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <FileForm 
                        title="Adicionar Arquivo"
                        closeButton={handleCloseModalFile}
                        anos={configTemp.anos}
                        config={configTemp}
                        handleResponse={fileHandleResponse}
                    />
                </Modal>
                <Dialog maxWidth="md"
                    id='modalForm'
                    scroll='body'
                    open={openModalForm}
                    onClose={handleCloseModalForm}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                ><DialogContent >
                    <TurmaForm
                        addOrEdit={addOrEdit}
                        turmaEdit = {turmaEdit}
                        updating={updatingT}
                        dias={configTemp.dias}
                        horarios={configTemp.horarios}
                        creditos={configTemp.creditos}
                        anos={configTemp.anos}
                        closeModalForm ={handleCloseModalForm}
                    /></DialogContent>
                </Dialog>
                <Toolbar>
                <Grid container 
                    spacing={2} 
                    sx={{paddingTop:'12px'}} 
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
                            onClick ={handleOpenModalFile}
                            sx={{fontSize:'12px',paddingTop:'12px',paddingBottom:'12px'}} >Arquivo
                        </Button>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Button 
                            startIcon={<AddIcon/>} 
                            variant="contained" 
                            onClick={openInModalNew}
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
                            onChange={handleSearch}
                        />
                    </Grid>
                    <Grid item xs={6} sm={2}>
                        <Select
                            label="Ano"
                            value={anoTable}
                            onChange={handleAnoTableSelect}
                            options ={configTemp.anos}
                        />  
                    </Grid>
                    <Grid item xs={6} sm={2}>
                        <Select 
                            label="Semestre"
                            value={semestreTable}
                            onChange={handleSemestreTableSelect}
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
                <TblContainer 
                    sx={tableStyle} 
                    style={tableStyle} 
                    tableTitle="Lista de Turmas"
                    numSelected={selected.length}
                    deleteSelected={()=>{
                        setConfirmDialog({
                            isOpen:true,
                            title:'Deletar Turma',
                            subtitle:'Tem certeza que deseja deletar? Você não pode desfazer esta operação.',
                            onConfirm: () =>{onDelete(selected)}
                        })
                    }}
                >
                    <TblHead
                        onSelectAllClick={handleSelectAllClick}
                        numSelected={selected.length}
                        rowCount={recordsAfterPagingAndSorting().length}
                    />
                    <TableBody>
                        {recordsAfterPagingAndSorting().map((turma,index)=>{
                            const isItemSelected = isSelected(turma._id);
                            const labelId = `turmas-table-checkbox-${index}`;
                            return(
                                <TableRow 
                                    key={turma._id} 
                                    sx ={tableRowCss}
                                    selected={isItemSelected}
                                    aria-checked={isItemSelected}
                                    role="checkbox"
                                    onClick={(event) => handleClick(event, turma._id)}
                                >
                                    <TableCell padding="checkbox">
                                    <Checkbox
                                        color="primary"
                                        checked={isItemSelected}
                                        inputProps={{
                                            'aria-labelledby': labelId,
                                        }}
                                    />
                                </TableCell>
                                    <TableCell>
                                        <IconButton 
                                            sx={{padding:'4px'}} 
                                            color="primary"
                                            onClick={()=>{openInModalEdit(turma)}}
                                        >
                                            <EditOutlinedIcon fontSize="small"/> 
                                        </IconButton>
                                    </TableCell>
                                    <TableCell>{turma.idTurma}</TableCell>
                                    <TableCell>{turma.nomeDisciplina}</TableCell>
                                    <TableCell>{turma.turma}</TableCell>
                                    <TableCell>{turma.totalTurma}</TableCell>
                                    <TableCell>{turma.diaDaSemana}</TableCell>
                                    <TableCell>{turma.horarioInicio}</TableCell>
                                    <TableCell>{turma.horarioFim}</TableCell>
                                    <TableCell>{turma.creditosAula}</TableCell>
                                    <TableCell>{turma.departamentoOferta}</TableCell>
                                    <TableCell>{turma.departamentoTurma}</TableCell>
                                    <TableCell>{turma.campus}</TableCell>
                                    <TableCell>{turma.docentes}</TableCell>
                                    <TableCell>{turma.codDisciplina}</TableCell>

                                </TableRow>
                            )
                        })}
                    </TableBody>
                </TblContainer>
                <TblPagination/>
            </ TableContainer>
        </>
    )
}

export default TurmasList;