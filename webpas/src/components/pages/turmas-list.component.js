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
import DeleteIcon from '@mui/icons-material/Delete'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Mensagem from "../mensagem.component";
import ConfirmDialog from "../confirmDialog.component";
import handleServerResponses from "../../services/response-handler";

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
    {id:'actions',label:"Ações", disableSorting:true},
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
    const [openModalForm, setOpenModalForm] = React.useState(false);
    const [openModalFile, setOpenModalFile] = React.useState(false);
    const [turmas,setTurmas] = useState([]);
    const [turmaEdit,setTurmaEdit] = useState(null)
    const [updatingT,setUpdatingT] = useState(false)
    const [filterFn,setFilterFn] = useState({fn:items=>{return items;}})
    const [anoTable,setAnoTable] = useState(thisYear)
    const [semestreTable,setSemestreTable] = useState(1)
    const [notify,setNotify] = useState({isOpen:false,message:'',type:''})
    const [confirmDialog,setConfirmDialog] = useState({isOpen:false,title:'',subtitle:''})

    const handleCloseModalForm = () => setOpenModalForm(false);
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
            .catch(err => console.log(err))
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

    const addOrEdit = (updating,turma,resetForm) =>{
        let data= {...turma}
        if (updating){
            TurmasDataService.updateTurma(turma._id,data)
                .then(res =>handleServerResponses('update',res,setNotify))
                .catch(err=>handleServerResponses('error',err,setNotify))
        }else{
            TurmasDataService.addTurma(data)
                .then(res =>handleServerResponses('add',res,setNotify))
                .catch(err=>handleServerResponses('error',err,setNotify))
        }
        resetForm()
        setOpenModalForm(false)
        retornaTurmas(anoTable,semestreTable)
    }

    const onDelete =(id)=>{
        setConfirmDialog({
            ...confirmDialog,
            isOpen:false
        })
        TurmasDataService.deleteTurma(id)
            .then(res =>handleServerResponses('delete',res,setNotify))
            .catch(err=>handleServerResponses('error',err,setNotify))
        retornaTurmas(anoTable,semestreTable)

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
                <TblContainer sx={tableStyle} style={tableStyle}>
                    <TblHead />
                    <TableBody>
                        {recordsAfterPagingAndSorting().map(turma=>(
                            <TableRow key={turma._id} sx ={tableRowCss}>
                                <TableCell>
                                    <IconButton 
                                        sx={{padding:'4px'}} 
                                        color="primary"
                                        onClick={()=>{openInModalEdit(turma)}}
                                    >
                                         <EditOutlinedIcon fontSize="small"/> 
                                    </IconButton>
                                    <IconButton 
                                        sx={{padding:'4px'}} 
                                        color="error"
                                        onClick={()=>{
                                            setConfirmDialog({
                                                isOpen:true,
                                                title:'Deletar Turma',
                                                subtitle:'Tem certeza que deseja deletar? Você não pode desfazer esta operação.',
                                                onConfirm: () =>{onDelete(turma._id)}
                                            })
                                        }}
                                    > <DeleteIcon fontSize="small"/> </IconButton>
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
                        ))}
                    </TableBody>
                </TblContainer>
                <TblPagination/>
            </ TableContainer>
        </>
    )
}

export default TurmasList;