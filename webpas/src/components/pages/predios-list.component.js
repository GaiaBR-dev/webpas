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


const PrediosList = props =>{
    const [predios,setPredios] = React.useState([])
    const [salas,setSalas] = React.useState([])

    useEffect(()=>{
        retornaPredios()
        retornaSalas()
    }, [])

    function numeroSalas(predio){
        let salaPredio = [{"predio":"x"}]
        salaPredio = salas.find( sala =>{
            return sala.predio === predio
        }).then(salasP => {
            return salasP.lenght
        }).catch(err => console.log(err))

    }

    const retornaSalas = () =>{
        SalasDataService.getAll()
            .then(response =>{
                setSalas(response.data)
            }).catch(err =>{
                console.log(err)
            })
    }

    const retornaPredios = () =>{
        SalasDataService.getPredios()
            .then(response =>{
                setPredios(response.data)
            }).catch(err =>{
                console.log(err)
            })
    }

    return(
        <React.Fragment>
            <PageHeader 
                title="Prédios e Salas"
                subtitle="Cadastro, edição e visualização de prédios"
                icon={<HomeWorkIcon/>}
            />

            <Grid container spacing={3}>
                    {predios.map(predio=>{
                        return (
                            <Grid item xs={3}>
                                <Card>
                                    <CardActionArea>
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {predio}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" my={2}>
                                            Número de Salas: 10
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
                                                    to={"/predios/"+predio}
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

