import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SalasDataService from '../../services/salas'
import PageHeader from "../page-header.component";
import Mensagem from "../mensagem.component";
import ConfirmDialog from "../confirmDialog.component";
import { TableContainer, Paper, TableBody, TableCell, TableRow} from "@mui/material";
import useTable from "../useTable";
import { Toolbar, Grid, Button, TextField } from "@mui/material";
import { IconButton } from "@mui/material";
import HelpIcon from '@mui/icons-material/Help';
import { InputAdornment } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

const headCells =[
    {id:'actions',label:"Ações", disableSorting:true},
    {id:'numeroSala', label:'Sala'},
    {id:'capacidade', label:'Capacidade'},
    {id:'disponivelManha', label:'Disponível de Manhã'},
    {id:'disponivelTarde', label:'Disponível de Tarde'},
    {id:'disponivelNoite', label:'Disponível de Noite'},
]

const tableRowCss ={
    '& .MuiTableCell-root':{
        padding:1,
    }
}

const Salas = ()=>{
    let params = useParams()
    const [salas,setSalas]=useState([])
    const [salaEdit,setSalaEdit] = useState(null)
    const [openModalForm, setOpenModalForm] = React.useState(false);
    const [openModalFile, setOpenModalFile] = React.useState(false);
    const [updatingS,setUpdatingS] = useState(false)
    const [filterFn,setFilterFn] = useState({fn:items=>{return items;}})
    const [notify,setNotify] = useState({isOpen:false,message:'',type:''})
    const [confirmDialog,setConfirmDialog] = useState({isOpen:false,title:'',subtitle:''})

    const handleCloseModalForm = () => setOpenModalForm(false);
    const handleOpenModalFile = () => setOpenModalFile(true);
    const handleCloseModalFile = () => setOpenModalFile(false);

    const getSalas = predio =>{
        SalasDataService.getSalas(predio)
            .then(response=>{
                setSalas(response.data)
                console.log(response.data)
            }).catch(err => console.log(err))
    }

    useEffect(()=>{
        getSalas(params.predio)
    },[params.predio])

    const handleUpdatingS= isUpdating => {
        isUpdating? setUpdatingS(true): setUpdatingS(false)
    }

    const openInModalEdit = sala =>{
        handleUpdatingS(true)
        setSalaEdit(sala)
        setOpenModalForm(true)
    }

    const openInModalNew = () =>{
        handleUpdatingS(false)
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

    const{
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting
    }=useTable(salas,headCells,filterFn)

    return(
        <>
            <PageHeader 
                title="Salas"
                subtitle="teste 123"
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
                    <TblContainer>
                    <TblHead />
                    <TableBody>
                        {recordsAfterPagingAndSorting().map(sala=>(
                            <TableRow key={sala._id} sx ={tableRowCss}>
                                <TableCell>
                                    <IconButton 
                                        sx={{padding:'4px'}} 
                                        color="primary"
                                        
                                    >
                                         <EditOutlinedIcon fontSize="small"/> 
                                    </IconButton>
                                    <IconButton 
                                        sx={{padding:'4px'}} 
                                        color="error"
                                        onClick={()=>{
                                            setConfirmDialog({
                                                isOpen:true,
                                                title:'Deletar Sala',
                                                subtitle:'Tem certeza que deseja deletar? Você não pode desfazer esta operação.',
                                                /*onConfirm: () =>{onDelete(sala._id)}*/
                                            })
                                        }}
                                    > <DeleteIcon fontSize="small"/> </IconButton>
                                </TableCell>
                                <TableCell>{sala.numeroSala}</TableCell>
                                <TableCell>{sala.capacidade}</TableCell>
                                <TableCell>{sala.disponivelManha?"sim":"não"}</TableCell>
                                <TableCell>{sala.disponivelTarde?"sim":"não"}</TableCell>
                                <TableCell>{sala.disponivelNoite?"sim":"não"}</TableCell>
                                
                            </TableRow>
                        ))}
                    </TableBody>
                </TblContainer>
                <TblPagination/>
            </TableContainer>
        </>
    )
}

export default Salas;