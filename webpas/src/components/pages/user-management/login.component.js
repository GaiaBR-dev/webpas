import React,{useState,useEffect} from "react";
import UserDataService from '../../../services/user'
import { Box } from "@mui/system";
import useForm from "../../forms/useForm";
import { Container, Typography } from "@mui/material";
import {TextField} from "@mui/material";
import {Button, Grid, Paper, Link} from "@mui/material";
import { Link as RouterLink,useSearchParams } from 'react-router-dom';

const inicialValues ={
    email:'',
    password:'', 
}

const Login = props =>{
    let [searchParams, setSearchParams] = useSearchParams();
    
    const{
        values,
        setValues,
        handleInputChange,
        erros,
        setErros,
        resetForm,
    }=useForm(inicialValues)

    const handleSubmit = e =>{
        e.preventDefault()
        const data = {...values}
        UserDataService.login(data)
            .then(res=>{
                document.cookie = `user=${JSON.stringify(res.data.user)};max-age=${1000 * 60 * 24 * 30 *60}`
                let callbackUrl = searchParams.get("callbackUrl")
                window.location.href = callbackUrl || "/"
            })
            .catch(err=>console.log(err))
    }

    return(
        <>
            <Box component="form" onSubmit={handleSubmit}>
                <Container>
                <Paper>
                    <Grid container spacing={2} alignItens="center" padding="50px">
                        <Grid item xs={6}>
                            <Typography variant="h5">Login</Typography>
                        </Grid>
                        <Grid item xs={6}></Grid>
                        <Grid item xs={12}></Grid>
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
                        <Grid item xs={12} sx={{marginY:2}}>
                            <Button variant='outlined' size="large" color='primary' onClick={resetForm} sx={{marginRight:2}}>Resetar</Button>
                            <Button variant='contained' type="submit"size="large" color='secondary'>Enviar</Button>
                        </Grid>
                        <Grid xs={12}>
                            <Typography> Não tem uma conta? 
                                <Link  component={RouterLink} to="/cadastro">Registre-se</Link>
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>
                </Container>

            </Box>
        </>
    )
}

export default Login;