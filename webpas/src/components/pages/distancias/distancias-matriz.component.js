import React from "react";
import DistanciaForm from '../../forms/distanciaForm.component'
import PageHeader from '../../re-usable/page-header.component';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import { Modal, TableBody, TableCell, TableRow, Grid, Toolbar, TextField, DialogContent } from "@mui/material";
import {Dialog, Button, IconButton}  from "@mui/material"
import HelpIcon from '@mui/icons-material/Help';
import useTable from "../../re-usable/useTable";
import DistanciasDataService from '../../../services/distancias'
import TurmasDataService from '../../../services/turmas';
import SalasDataService from '../../../services/salas';
import { useEffect, useState } from 'react';
import { TableContainer, Paper } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Mensagem from "../../re-usable/mensagem.component";
import ConfirmDialog from "../../re-usable/confirmDialog.component";
import handleServerResponses from "../../../services/response-handler";
import { Checkbox } from "@mui/material";
import FileFormDistancias from "../../forms/fileFormDistancia.component";
import { Alert } from "@mui/material";

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
    {id:'predio', label:'Prédio'},
    {id:'departamento', label:'Departamento'},
    {id:'distancia', label:'Distância'},
    {id:'status', label:'Status'},

]

const DistanciasMatriz = props =>{
    const {user,logout,config} = props

    const [distancias,setDistancias] = useState([]);
    const [predios,setPredios] = useState([]);
    const [departamentos,setDepartamentos] = useState([]);
    const [temTodos,setTemTodos] = useState(true);
    const [indiceDistancias,setIndiceDistancias] = useState({});
    const [distanciaTableObjs,setDistanciaTableObjs] = useState([]);
    const [openModalForm, setOpenModalForm] = React.useState(false);
    const [openModalFile, setOpenModalFile] = React.useState(false);
    const [distanciaEdit,setDistanciaEdit] = useState(null)
    const [updatingD,setUpdatingD] = useState(false)
    const [filterFn,setFilterFn] = useState({fn:items=>{return items;}})
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
        retornaPredios()
        retornaDepartamentos()
        retornaDistancias()
    }, [notify])

    useEffect(()=>{
        retornaIndiceDistancias()
        retornaTemTodos()
    },[distancias])

    useEffect(()=>{
        retornaDistanciasTableObjs()
    },[indiceDistancias,predios,departamentos])

    const retornaDistancias = () =>{
        DistanciasDataService.getAll()
            .then(response => {
                setDistancias(response.data)
            })
            .catch(err => handleServerResponses('distancias',err,setNotify))
    }

    const retornaDepartamentos = () =>{
        TurmasDataService.getDepartamentos()
            .then(response => {
                setDepartamentos(response.data)
            })
            .catch(err => handleServerResponses('turmas',err,setNotify))
    }

    const retornaPredios = () =>{
        SalasDataService.getPredios()
            .then(response => {
                setPredios(response.data)
            })
            .catch(err => {
                let notAuthorized = err.response.data?.notAuth ? err.response.data.notAuth : false
                if (notAuthorized){
                    logout()
                }
                handleServerResponses('salas',err,setNotify)
            })
    }

    const retornaIndiceDistancias = () =>{
        const indexDist = distancias.reduce((acc, cur) => {
            acc[cur.predio] = acc[cur.predio] ? acc[cur.predio] : {}
            acc[cur.predio] = {
                ...acc[cur.predio],
                [cur.departamento]: {}
            }
            acc[cur.predio][cur.departamento] = {
                ...acc[cur.predio][cur.departamento],
                distancia:cur.valorDist,
                _id:cur._id
            }
            return acc
        }, {})
        setIndiceDistancias(indexDist)
    }

    const retornaDistanciasTableObjs = () =>{
        let distTableObjArray = []
        predios.map((predio,indexp)=>{
            departamentos.map((departamento,indexd)=>{
                let strId =  `${indexp}${indexd}`
                let missing = 12 - strId.length
                indiceDistancias[predio] = indiceDistancias[predio]? indiceDistancias[predio]: {}
                for(let i=0;i<missing;i++){
                    strId = strId + "0"
                }
                let distTableObj = {
                    _id: indiceDistancias[predio][departamento]?._id ? indiceDistancias[predio][departamento]._id : strId,
                    predio:predio,
                    departamento:departamento,
                    valorDist: indiceDistancias[predio][departamento]?.distancia ? indiceDistancias[predio][departamento].distancia : "-",
                    status: indiceDistancias[predio][departamento]?.distancia ? "OK" : "Não Informado" 
                }
                distTableObjArray.push(distTableObj)
            })
        })
        setDistanciaTableObjs(distTableObjArray)
    }

    const retornaTemTodos = () =>{
        DistanciasDataService.temTodos()
            .then(res => {
                setTemTodos(res.data.isComplete)
            }).catch(err => console.log(err))
    }

    const handleSearch = e =>{
        let target = e.target
        setFilterFn({
            fn: items =>{
                if(target.value == ""){
                    return items
                }else{
                    return items.filter(distancia => {
                        return (
                            distancia.predio
                                .toLowerCase()
                                .includes(target.value.toLowerCase())
                            || distancia.departamento
                                .toLowerCase()
                                .includes(target.value.toLowerCase()) 
                            || distancia.status
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
          const newSelecteds = recordsAfterPagingAndSorting().map((distancia) => distancia._id);
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
        handleServerResponses('distancias',res,setNotify)
        retornaDistancias()
    }
    

    const addOrEdit = (updating,distancia,resetForm) =>{
        let data= {...distancia}
        if (updating){
            DistanciasDataService.updateDistancia(distancia._id,data)
                .then(res =>handleServerResponses('distancias',res,setNotify))
                .catch(err=>handleServerResponses('distancias',err,setNotify))
        }else{
            DistanciasDataService.addDistancia(data)
                .then(res =>handleServerResponses('distancias',res,setNotify))
                .catch(err=>handleServerResponses('distancias',err,setNotify))
        }
        setSelected([]);
        resetForm()
        setOpenModalForm(false)
        retornaDistancias()
    }

    const onDelete =(distancias)=>{
        setConfirmDialog({
            ...confirmDialog,
            isOpen:false
        })
        let data={distanciasID:distancias}
        DistanciasDataService.deleteDistancias(data)
            .then(res =>handleServerResponses('distancias',res,setNotify))
            .catch(err=>handleServerResponses('distancias',err,setNotify))
        retornaDistancias()
        setSelected([]);
    }

    const{
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting
    }=useTable(distanciaTableObjs,headCells,filterFn)

    const openInModalEdit = distancia =>{
        setUpdatingD(true)
        setDistanciaEdit(distancia)
        setOpenModalForm(true)
    }

    const openInModalNew = () =>{
        setUpdatingD(false)
        setDistanciaEdit(null)
        setOpenModalForm(true)
    }

    return(
        <>
            <PageHeader 
                title="Distâncias"
                subtitle="Cadastro, edição e visualização de distâncias"
                icon={<DirectionsWalkIcon />}
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
                    <FileFormDistancias
                        title={'Adicionar arquivo'}
                        closeButton={handleCloseModalFile}
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
                        <DistanciaForm
                            addOrEdit ={addOrEdit}
                            predios = {predios}
                            departamentos = {departamentos}
                            tableObjs = {distanciaTableObjs}
                            updating = {updatingD}
                            distanciaEdit = {distanciaEdit}
                            closeModalForm ={handleCloseModalForm}
                        />
                </DialogContent>
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
                </Toolbar>{temTodos ?(
                <></>
            ):(
                <Alert severity="error" sx={{marginTop:'10px'}}>Existem distâncias entre prédios e departamentos 
                não informadas. A otimização só podera ser executada com todas as distâncias cadastradas.</Alert>
            )}
                <TblContainer 
                    sx={tableStyle} 
                    tableTitle="Lista de distâncias"
                    numSelected={selected.length}
                    deleteSelected={()=>{
                        setConfirmDialog({
                            isOpen:true,
                            title:'Deletar Distâncias',
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
                        {recordsAfterPagingAndSorting().map((distancia,index)=>{
                            const isItemSelected = isSelected(distancia._id);
                            const labelId = `distancias-table-checkbox-${index}`;
                            return(
                                <TableRow 
                                    key={distancia._id} 
                                    sx ={tableRowCss}
                                    selected={isItemSelected}
                                    aria-checked={isItemSelected}
                                    role="checkbox"
                                    onClick={(event) => handleClick(event, distancia._id)}
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
                                            onClick={()=>{openInModalEdit(distancia)}}
                                        >
                                            <EditOutlinedIcon fontSize="small"/> 
                                        </IconButton>
                                    </TableCell>
                                    <TableCell>{distancia.predio}</TableCell>
                                    <TableCell>{distancia.departamento}</TableCell>
                                    <TableCell>{distancia.valorDist}</TableCell>
                                    <TableCell>{distancia.status}</TableCell>

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

export default DistanciasMatriz;