import React, {useState, useEffect} from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import { styled } from '@mui/material/styles';
import Navbar from "../re-usable/navbar.component";
import HomePage from "./homepage.component";
import PrediosList from "./predios-list.component";
import TurmasList from "./turmas-list.component";
import DistanciasMatriz from "./distancias-matriz.component";
import ConfigForm from "./config/config-form.component"
import Solver from "./solver.component";
import Agenda from "./agenda/agenda.component";
import Salas from "./salas-list.component";
import { Container } from "@mui/material";
import { Box } from "@mui/system";
import ConfigsDataService from '../../services/configs'
import useAuth from '../../services/useAuth'

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const containerStyle = {
  '@media (min-width: 1400px)': {
    maxWidth: '1400px'
  }
}

const PrivateLogged = props =>{
    const {user} = props
    const [config,setConfig] = useState({dias:[],periodos:[]})
  
    useEffect(()=>{
        retornaConfig()
    },[])

    const retornaConfig = () =>{
        ConfigsDataService.getConfigByUser('Eu') // mudar para usuario
            .then(res=> setConfig(res.data))
            .catch(err=>console.log(err))
    } 

    return (
    <Box sx={{display:'flex'}}>
        <BrowserRouter>
          <Navbar />
          <Box component="main" sx={{ flexGrow: 1, p: 3 , backgroundColor:'#F5F5F5' }}>
              <DrawerHeader />
              <Container sx={containerStyle} >
              <Routes>
                <Route exact path="/" element={<HomePage/>} />  
                <Route path="/predios" element={<PrediosList/>} />
                <Route path="/turmas" element={<TurmasList config={config}/>} />
                <Route path="/distancias" element={<DistanciasMatriz/>} />
                <Route path="/solver" element={<Solver config={config}/>} />
                <Route path="/agenda" element={<Agenda/>} />
                <Route path="/predios/:predio" element={<Salas/>}/>
                <Route path="/config" element={<ConfigForm/>}/>
              </Routes>
              </Container>
          </Box>
      </BrowserRouter>
    </Box> 
    )
}

export default PrivateLogged;
