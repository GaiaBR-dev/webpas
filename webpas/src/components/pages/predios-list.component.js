import React from "react";
import { Link as RouterLink } from 'react-router-dom';
import { Container, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import SalasDataService from '../../services/salas'
import { Card } from "@mui/material";
import { Grid } from "@mui/material";
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { CardActionArea } from '@mui/material';
import { Button } from "@mui/material";
import { IconButton } from "@mui/material";
import PageHeader from '../page-header.component'
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import { Paper, Toolbar, TextField, InputAdornment } from "@mui/material";
import HelpIcon from '@mui/icons-material/Help';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import PredioForm from "../forms/predioForm.component";
import { Dialog, DialogContent } from "@mui/material";
import handleServerResponses from "../../services/response-handler";
import Mensagem from "../mensagem.component";

const configTemp={
    dias:['Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
    periodos:['Manhã','Tarde','Noite']
}

const PrediosList = props =>{
    const [predios,setPredios] = React.useState([])
    const [salas,setSalas] = React.useState([])
    const [numeroSalas,setNumeroSalas] = useState([])
    const [predioEdit,setPredioEdit] = useState(null)
    const [openModalForm, setOpenModalForm] = useState(false);
    const [openModalFile, setOpenModalFile] = useState(false);
    const [updatingP,setUpdatingP] = useState(false)
    const [filterFn,setFilterFn] = useState({fn:items=>{return items;}})
    const [notify,setNotify] = useState({isOpen:false,message:'',type:''})
    const [confirmDialog,setConfirmDialog] = useState({isOpen:false,title:'',subtitle:''})

    const handleCloseModalForm = () => setOpenModalForm(false);
    const handleOpenModalFile = () => setOpenModalFile(true);
    const handleCloseModalFile = () => setOpenModalFile(false);

    useEffect(()=>{
        if (predios.length > 0) {
            getNumeroSalas()
        }

    }, [predios])

    useEffect(()=>{
        retornaPredios()

    }, [])

    const getNumeroSalas = () =>{
        console.log('executando numerosalasx')
        SalasDataService.getAll()
            .then(response =>{
                setSalas(response.data)
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
        setUpdatingP(false)
        setPredioEdit(null)
        setOpenModalForm(true)
    }

    const openInModalEdit = predio =>{
        setUpdatingP(true)
        setPredioEdit(predio)
        setOpenModalForm(true)
    }

    const add = (values,resetForm) =>{
        let data= {...values}
        SalasDataService.addPredio(data)
            .then(res =>handleServerResponses('add',res,setNotify))
            .catch(err=>handleServerResponses('error',err,setNotify))
        resetForm()
        setOpenModalForm(false)
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
                                                <Button size="small" variant='outlined' sx={{width:'100%'}}>Editar</Button>
                                            </Grid>
                                            <Grid item xs ={6}>
                                                <Button size="small" variant='outlined' sx={{width:'100%'}}>Deletar</Button>
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

