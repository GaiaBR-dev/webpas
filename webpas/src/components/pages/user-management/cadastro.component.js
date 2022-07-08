import React,{useState,useEffect} from "react";
import UserDataService from '../../../services/user';
import ConfigDataService from '../../../services/configs';
import { Box } from "@mui/system";
import useForm from "../../forms/useForm";
import { Container, DialogContent, Typography } from "@mui/material";
import {TextField} from "@mui/material";
import {Button, Grid, Paper, Link} from "@mui/material";
import { Link as RouterLink } from 'react-router-dom';
import {Dialog} from "@mui/material";
import { IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from "react-router-dom";
import useAuth from "../../../services/useAuth";

const inicialValues ={
    username: '',
    email:'',
    password:'',
    confirmPassword:''
}

const Cadastro = props =>{
    const {user} = useAuth(false)

    const navigate = useNavigate()

    const [openDialog,setOpenDialog] = useState(false);
    const [errorMessage,setErrorMessage] = useState("")

    useEffect(()=>{
        if(user){
            navigate('/')
        }
    },[user])

    const{
        values,
        setValues,
        handleInputChange,
        erros,
        setErros,
        resetForm,
    }=useForm(inicialValues)

    const handleDialogClose = () =>{
        resetForm()
        window.location.href = "/login"
    }

    const handleSubmit = e =>{
        e.preventDefault()
        const data = {...values}
        UserDataService.cadastrar(data)
            .then(res=>{
                const userId = res.data._id
                ConfigDataService.newUserConfig(userId)//Mudar para verificação por email depois
                    .then(res=>{
                        setOpenDialog(true)
                    }).catch(err=>{
                        let serverResponse = err.response.data
                        console.log(serverResponse)
                        setErrorMessage(serverResponse.error)
                    })
            }).catch(err=>{
                let serverResponse = err.response.data
                console.log(serverResponse)
                setErrorMessage(serverResponse.error)
            })
    }

    return(
        <>
            <Box component="form" onSubmit={handleSubmit}>
                
                <Container>
                <Paper>
                    <Dialog maxWidth="md" open={openDialog} onClose={handleDialogClose}>
                        <DialogContent>
                            <Box minWidth={400}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={10}>
                                    <Typography>
                                        Usuário criado!
                                    </Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <IconButton onClick={handleDialogClose} >
                                        <CloseIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                            </Box>
                        </DialogContent>
                    </Dialog>
                    <Grid container spacing={2} alignItems="center" padding="50px">
                        <Grid item xs={6}>
                            <Typography variant="h5">Cadastro de usuários</Typography>
                        </Grid>
                        <Grid item xs={6}></Grid>
                        <Grid item xs={12}></Grid>
                        <Grid item xs={6}>
                            <TextField 
                                variant="outlined"
                                name = "username"
                                onChange={handleInputChange}
                                label="Nome de Usuário"
                                value ={values.username}></TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField 
                                variant="outlined"
                                name = "email"
                                onChange={handleInputChange}
                                label="Email"
                                value ={values.email}></TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField 
                                variant="outlined"
                                name = "password"
                                onChange={handleInputChange}
                                type="password"
                                label="Senha"
                                value ={values.password}></TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField 
                                variant="outlined"
                                name = "confirmPassword"
                                onChange={handleInputChange}
                                type="password"
                                label="Confirme a senha"
                                value ={values.confirmPassword}></TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography color="peru">{errorMessage}</Typography>
                        </Grid>
                        <Grid item xs={12} sx={{marginY:2}}>
                            <Button variant='outlined' size="large" color='primary' onClick={()=>{resetForm();setErrorMessage("")}} sx={{marginRight:2}}>Resetar</Button>
                            <Button variant='contained' type="submit"size="large" color='secondary'>Enviar</Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography> Já tem uma conta? <Link  component={RouterLink} to="/login">Entre</Link></Typography>
                        </Grid>

                    </Grid>
                </Paper>
                </Container>

            </Box>
        </>
    )
}

export default Cadastro;