import React from "react";
import { Link as RouterLink } from 'react-router-dom';
import { Typography } from "@mui/material";
import { useState, useEffect } from "react";
import SalasDataService from '../../services/salas'
import ConfirmDialog from "../confirmDialog.component";
import { Card } from "@mui/material";
import { Grid } from "@mui/material";
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { CardActionArea } from '@mui/material';
import { Button } from "@mui/material";
import { IconButton } from "@mui/material";
import PageHeader from '../page-header.component'
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import { Paper, Toolbar, TextField, InputAdornment, Modal } from "@mui/material";
import HelpIcon from '@mui/icons-material/Help';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import PredioForm from "../forms/predioForm.component";
import PredioEditForm from "../forms/predioEditForm.component";
import { Dialog, DialogContent } from "@mui/material";
import handleServerResponses from "../../services/response-handler";
import Mensagem from "../mensagem.component";
import FileFormSalas from "../forms/fileFormSala.component";

const configTemp={
    dias:['Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
    periodos:['Manhã','Tarde','Noite']
}

const PrediosList = props =>{
    const [predios,setPredios] = React.useState([])
    const [predioEdit,setPredioEdit] = React.useState([])
    const [numeroSalas,setNumeroSalas] = useState([])
    const [openModalForm, setOpenModalForm] = useState(false);
    const [openModalFormEdit, setOpenModalFormEdit] = useState(false);
    const [openModalFile, setOpenModalFile] = useState(false);
    const [filterFn,setFilterFn] = useState({fn:items=>{return items;}})
    const [notify,setNotify] = useState({isOpen:false,message:'',type:''})
    const [confirmDialog,setConfirmDialog] = useState({isOpen:false,title:'',subtitle:''})

    const handleCloseModalForm = () => setOpenModalForm(false);
    const handleCloseModalFormEdit = () => setOpenModalFormEdit(false);
    const handleOpenModalFile = () => setOpenModalFile(true);
    const handleCloseModalFile = () => setOpenModalFile(false);

    useEffect(()=>{
        if (predios.length > 0) {
            getNumeroSalas()
        }

    }, [predios])

    useEffect(()=>{
        retornaPredios()
    }, [notify])

    const getNumeroSalas = () =>{
        console.log('executando numerosalasx')
        SalasDataService.getAll()
            .then(response =>{
                let arrayTemp = []
                predios.map(predio=>{
                    let predioTemp ={}
                    predioTemp.nome = predio
                    predioTemp.salas = response.data.filter( sala =>{
                        return sala.predio === predio
                    }).length
                    arrayTemp.push(predioTemp)
                })
                setNumeroSalas(arrayTemp)
            }).catch(err =>{
                console.log(err)
            })
    }

    console.log(numeroSalas)

    const retornaPredios = () =>{
        console.log('executando predios')

        SalasDataService.getPredios()
            .then(response =>{
                setPredios(response.data)
            }).catch(err =>{
                console.log(err)
            })
    }

    const openInModalNew = () =>{
        setPredioEdit(null)
        setOpenModalForm(true)
    }

    const openInModalEdit = predio =>{
        setPredioEdit(predio)
        setOpenModalFormEdit(true)
    }

    const add = (values,disponibilidade,resetForm) =>{
        let data= {...values,disponibilidade}
        SalasDataService.addPredio(data)
            .then(res =>handleServerResponses('salas',res,setNotify))
            .catch(err=>handleServerResponses('salas',err,setNotify))
        resetForm()
        setOpenModalForm(false)
    }

    const edit = (values,resetForm) =>{
        let data = {...values}
        SalasDataService.editPredio(data,predioEdit)
            .then(res =>handleServerResponses('salas',res,setNotify))
            .catch(err=>handleServerResponses('salas',err,setNotify))
        resetForm()
        setOpenModalFormEdit(false)
    }

    const onDelete =(predio)=>{
        setConfirmDialog({
            ...confirmDialog,
            isOpen:false
        })
        SalasDataService.deletePredio(predio)
            .then(res =>handleServerResponses('salas',res,setNotify))
            .catch(err=>handleServerResponses('salas',err,setNotify))
    }

    const handleSearch = e =>{
        let target = e.target
        setFilterFn({
            fn: items =>{
                if(target.value == ""){
                    return items
                }else{
                    return items.filter(predioObj => {
                        return (
                            predioObj.nome
                                .toLowerCase()
                                .includes(target.value.toLowerCase())
                        )
                    }) 
                }
            }
        })
    }

    const fileHandleResponse = res =>{
        setOpenModalFile(false)
        handleServerResponses('salas',res,setNotify)
    }

    return(
        <React.Fragment>
            <PageHeader 
                title="Prédios e Salas"
                subtitle="Cadastro, edição e visualização de prédios"
                icon={<HomeWorkIcon/>}
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
                    config={configTemp}
                    handleResponse={fileHandleResponse}
                />
            </Modal>
            <Paper>
                <Toolbar>
                    <Grid container 
                        spacing={2} 
                        sx={{paddingY:'12px'}} 
                        alignItems="center" 
                        justifyContent="space-between"
                        columns={20}
                    > 
                        <Grid item xs ={6} sx={{fontSize:'14px',fontWeight:'500',color:"#666"}}>Adicionar</Grid>
                        <Grid item xs ={9} sx={{fontSize:'14px',fontWeight:'500',color:"#666"}}>Buscar</Grid>
                        <Grid item xs ={4} sx={{fontSize:'14px',fontWeight:'500',color:"#666"}}></Grid>
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
                        <Grid item xs={6} sm={1}>
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
                    <Dialog 
                        maxWidth="sm"
                        id='modalForm'
                        scroll='body'
                        open={openModalForm}
                        onClose={handleCloseModalForm}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    ><DialogContent >
                        <PredioForm
                            add ={add}
                            config={configTemp}
                            closeModalForm ={handleCloseModalForm}
                        /></DialogContent>
                    </Dialog>
                    <Dialog 
                        maxWidth="sm"
                        id='modalFormEdit'
                        scroll='body'
                        open={openModalFormEdit}
                        onClose={handleCloseModalFormEdit}
                        aria-labelledby="modal-modal-title-edit"
                        aria-describedby="modal-modal-description-dit"
                    ><DialogContent >
                        <PredioEditForm
                            predioVelho={predioEdit}
                            edit ={edit}
                            closeModalForm ={handleCloseModalFormEdit}
                        /></DialogContent>
                    </Dialog>
                </Toolbar>
            </Paper>
            <Grid container spacing={4} marginTop={1}>
                    {filterFn.fn(numeroSalas).map(predioObj=>{
                        
                        return (
                            <Grid item xs={3}>
                                <Card>
                                    <CardActionArea>
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {predioObj.nome}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" my={2}>
                                            Número de Salas: {predioObj.salas}
                                        </Typography>
                                    </CardContent>
                                    </CardActionArea>
                                    <CardActions>
                                        <Grid container spacing={1} rowSpacing={1}>
                                            <Grid item xs ={12}>
                                                <Button 
                                                    size="small" 
                                                    variant='outlined' 
                                                    sx={{width:'100%'}}
                                                    component={RouterLink}
                                                    to={"/predios/"+predioObj.nome}
                                                >
                                                    Ver Salas
                                                </Button>
                                            </Grid>
                                            <Grid item xs ={6}>
                                                <Button size="small" variant='outlined' sx={{width:'100%'}}
                                                    onClick={()=>openInModalEdit(predioObj.nome)}
                                                >Editar</Button>
                                            </Grid>
                                            <Grid item xs ={6}>
                                                <Button size="small" variant='outlined' sx={{width:'100%'}}
                                                    onClick={()=>{
                                                        setConfirmDialog({
                                                            isOpen:true,
                                                            title: `Deletar Predio - ${predioObj.nome}`,
                                                            subtitle:'Tem certeza que deseja deletar? Você não pode desfazer esta operação.',
                                                            onConfirm: () =>{onDelete(predioObj.nome)}
                                                        })
                                                    }}
                                                >Deletar</Button>
                                            </Grid>
                                        </Grid>
                                    </CardActions>
                                </Card>
                            </Grid>
                        )
                    })}
            </Grid>
        </React.Fragment>
    )
}

export default PrediosList

