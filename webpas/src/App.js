import React, {useState, useEffect} from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import { styled } from '@mui/material/styles';
import Navbar from "./components/navbar.component";
import HomePage from "./components/pages/homepage.component";
import PrediosList from "./components/pages/predios-list.component";
import TurmasList from "./components/pages/turmas-list.component";
import DistanciasMatriz from "./components/pages/distancias-matriz.component";
import ConfigForm from "./components/pages/config-form.component"
import Solver from "./components/pages/solver.component";
import Agenda from "./components/pages/agenda.component";
import Salas from "./components/pages/salas-list.component";
import { Container } from "@mui/material";
import { CssBaseline } from "@mui/material";
import { Box, minWidth } from "@mui/system";
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from "@emotion/react";
import ConfigsDataService from './services/configs'

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const theme = createTheme({
  palette: {
    type: 'light',
    primary: {
      main: 'rgba(33,33,33)',
    },
    secondary: {
      main: '#ff7d11',
    },
    background: {
      default: '#f5f5f5',
    },
    text: {
      primary: '#000000',
    },
    error: {
      main: '#d50000',
    },
  },
  typography: {
    h4: {
      fontWeight: 500,
    },
  },
})

const containerStyle = {
  '@media (min-width: 1400px)': {
    maxWidth: '1400px'
  }
}

function App() {
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

      <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
      <CssBaseline/>
      <BrowserRouter>
          <Navbar />
          <Box component="main" sx={{ flexGrow: 1, p: 3 , backgroundColor:'#F5F5F5' }}>
              <DrawerHeader />
              <Container sx={containerStyle} >
              <Routes>
                <Route path="/" element={<HomePage/>} />  
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
      </ThemeProvider>
    )
}

export default App;
