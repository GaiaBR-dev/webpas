import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SalasDataService from '../../services/salas'
import PageHeader from "../page-header.component";
import Mensagem from "../mensagem.component";
import ConfirmDialog from "../confirmDialog.component";
import { TableContainer, Paper, TableBody, TableCell, TableRow} from "@mui/material";
import useTable from "../useTable";
import { Toolbar, Grid, Button, TextField, Modal } from "@mui/material";
import { IconButton } from "@mui/material";
import HelpIcon from '@mui/icons-material/Help';
import { InputAdornment } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import handleServerResponses from "../../services/response-handler";
import { Dialog, DialogContent } from "@mui/material";
import SalaForm from '../forms/salaForm.component';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link as RouterLink } from 'react-router-dom';
import { Checkbox } from "@mui/material";
import FileFormSalas from "../forms/fileFormSala.component";
import ConfigsDataService from '../../services/configs'

const headCells =[
    {id:'actions',label:"Ações", disableSorting:true},
    {id:'numeroSala', label:'Sala'},
    {id:'capacidade', label:'Capacidade'},
    {id:'disponibilidade', label:'Disponibilidade'},
]

const tableRowCss ={
    '& .MuiTableCell-root':{
        padding:1,
    }
}

const tableStyle ={
    marginTop:1.5,
    '& thead th':{
        fontWeight: '600',
        fontSize:'0.7rem',
        color: '#fff',
        backgroundColor: 'secondary.main'
    },
    '& tbody td': {
        fontSize:'0.7rem',
    },
    '& tbody tr:hover':{
        backgroundColor: "#ddd",
        cursor: 'pointer'
    }
}

const Salas = ()=>{
    let params = useParams()
    const [salas,setSalas]=useState([])
    const [salaEdit,setSalaEdit] = useState(null)
    const [config,setConfig] = useState({dias:[],periodos:[]});
    const [openModalForm, setOpenModalForm] = useState(false);
    const [openModalFile, setOpenModalFile] = useState(false);
    const [updatingS,setUpdatingS] = useState(false)
    const [filterFn,setFilterFn] = useState({fn:items=>{return items;}})
    const [notify,setNotify] = useState({isOpen:false,message:'',type:''})
    const [confirmDialog,setConfirmDialog] = useState({isOpen:false,title:'',subtitle:''})
    const [selected, setSelected] = React.useState([]);

    useEffect(()=>{
        retornaConfig()
    }, [])

    useEffect(()=>{
        getSalas(params.predio)
    },[params.predios,notify])

    const handleCloseModalForm = () => {
        setOpenModalForm(false)
        setSelected([])
    };

    const handleOpenModalFile = () => setOpenModalFile(true);
    const handleCloseModalFile = () => setOpenModalFile(false);

    const getSalas = predio =>{
        SalasDataService.getSalas(predio)
            .then(response=>{
                setSalas(response.data)
            }).catch(err => console.log(err))
    }

    const retornaConfig = () =>{
        ConfigsDataService.getConfigByUser('Eu') // mudar para usuario
            .then(res=> setConfig(res.data))
            .catch(err=>console.log(err))
    }

    const openInModalEdit = sala =>{
        setUpdatingS(true)
        setSalaEdit(sala)
        setOpenModalForm(true)
    }

    const openInModalNew = () =>{
        setUpdatingS(false)
        setSalaEdit(null)
        setOpenModalForm(true)
    }

    const handleSearch = e =>{
        let target = e.target
        setFilterFn({
            fn: items =>{
                if(target.value == ""){
                    return items
                }else{
                    return items.filter(sala => {
                        return (
                            sala.numeroSala
                                .toLowerCase()
                                .includes(target.value.toLowerCase())
                        )
                    }) 
                }
            }
        })
    }

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
          const newSelecteds = recordsAfterPagingAndSorting().map((sala) => sala._id);
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

    const addOrEdit = (updating,sala,predio,disponibilidade,resetForm) =>{
        let data= {...sala,disponibilidade:disponibilidade}
        if (updating){
            SalasDataService.updateSala(predio,sala._id,data)
                .then(res =>handleServerResponses('salas',res,setNotify))
                .catch(err=>handleServerResponses('salas',err,setNotify))
        }else{
            SalasDataService.addSala(predio,data)
                .then(res =>handleServerResponses('salas',res,setNotify))
                .catch(err=>handleServerResponses('salas',err,setNotify))
        }
        resetForm()
        setOpenModalForm(false)
        setSelected([])
        getSalas(params.predio)
    }

    const onDelete =(salas)=>{
        setConfirmDialog({
            ...confirmDialog,
            isOpen:false
        })
        let data={salasID:salas}
        SalasDataService.deleteSalas(data)
            .then(res =>handleServerResponses('salas',res,setNotify))
            .catch(err=>handleServerResponses('salas',err,setNotify))
        getSalas(params.predio)

    }

    const fileHandleResponse = res =>{
        setOpenModalFile(false)
        handleServerResponses('salas',res,setNotify)
    }

    const{
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting
    }=useTable(salas,headCells,filterFn)

    return(
        <>
            <PageHeader 
                title={"Salas - " +params.predio}
                subtitle="Cadastro, edição e visualização de salas"
            />
            <Mensagem 
                notify={notify}
                setNotify={setNotify}
            />
            <ConfirmDialog
                confirmDialog={confirmDialog}
                setConfirmDialog={setConfirmDialog}
            />
            <Modal
                id='modalFile'
                open={openModalFile}
                onClose={handleCloseModalFile}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <FileFormSalas
                    title="Adicionar Arquivo"
                    closeButton={handleCloseModalFile}
                    config={config}
                    handleResponse={fileHandleResponse}
                />
            </Modal>
            <TableContainer component={Paper}>
                <Dialog maxWidth="sm"
                    id='modalForm'
                    scroll='body'
                    open={openModalForm}
                    onClose={handleCloseModalForm}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                ><DialogContent >
                    <SalaForm
                        config={config}
                        predio={params.predio}
                        addOrEdit={addOrEdit}
                        salaEdit = {salaEdit}
                        updating={updatingS}
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
                        <Grid item xs ={2} sx={{fontSize:'14px',fontWeight:'500',color:"#666"}}>Voltar</Grid>
                        <Grid item xs ={5} sx={{fontSize:'14px',fontWeight:'500',color:"#666"}}>Adicionar</Grid>
                        <Grid item xs ={11} sx={{fontSize:'14px',fontWeight:'500',color:"#666"}}>Buscar</Grid>

                        <Grid item xs ={1} sx={{fontSize:'14px',fontWeight:'500',color:"#666"}}>Ajuda</Grid>
                        <Grid item xs={6} sm={2}> 
                            <Button 
                                startIcon={<ArrowBackIcon/>}
                                component={RouterLink}
                                to={"/predios"}
                                variant="contained"  
                                sx={{fontSize:'12px',paddingTop:'12px',paddingBottom:'12px'}} >Prédios
                            </Button>
                        </Grid>
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
                        tableTitle="Lista de Salas"
                        numSelected={selected.length}
                        deleteSelected={()=>{
                            setConfirmDialog({
                                isOpen:true,
                                title:'Deletar Turmas',
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
                        {recordsAfterPagingAndSorting().map((sala,index)=>{
                            const isItemSelected = isSelected(sala._id);
                            const labelId = `salas-table-checkbox-${index}`;
                            const totalDisp = config.dias.length*config.periodos.length
                            let dispCount = 0
                            let disponibilidade = ''
                            sala.disponibilidade.map(obj=>{
                               obj.disponivel ?  dispCount++ : dispCount = dispCount
                            })
                            if (dispCount/totalDisp < 0.33){
                                disponibilidade = 'Baixa'
                            }else if (dispCount/totalDisp < 0.66){
                                disponibilidade = 'Média'
                            }else{
                                disponibilidade = 'Alta'
                            }

                            return(
                                <TableRow 
                                    key={sala._id} 
                                    sx ={tableRowCss}
                                    selected={isItemSelected}
                                    aria-checked={isItemSelected}
                                    role="checkbox"
                                    onClick={(event) => handleClick(event, sala._id)}
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
                                            onClick={()=>{openInModalEdit(sala)}}   
                                        >
                                            <EditOutlinedIcon fontSize="small"/> 
                                        </IconButton>
                                    </TableCell>
                                    <TableCell>{sala.numeroSala}</TableCell>
                                    <TableCell>{sala.capacidade}</TableCell>
                                    <TableCell>{disponibilidade}</TableCell>

                                    
                                </TableRow>
                        )})}
                    </TableBody>
                </TblContainer>
                <TblPagination/>
            </TableContainer>
        </>
    )
}

export default Salas;