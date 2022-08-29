import React, {useState, useEffect} from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Login from "./components/pages/user-management/login.component";
import Cadastro from "./components/pages/user-management/cadastro.component";
import LembrarSenha from "./components/pages/user-management/lembrar-senha.component";
import RedefinirSenha from "./components/pages/user-management/redefinir-senha.component";
import HomePage from "./components/pages/homepage.component";
import { CssBaseline } from "@mui/material";
import { Box } from "@mui/system";
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from "@emotion/react";
import ConfigWrapper from './components/pages/config/config-wrapper.component';
import TurmasWrapper from "./components/pages/turmas/turmas-wrapper.component";
import PrediosWrapper from "./components/pages/predios-salas/predios-wrapper.component";
import SalasWrapper from "./components/pages/predios-salas/salas-wrapper.component";
import DistanciasWrapper from "./components/pages/distancias/distancias-wrapper.component";
import SolverWrapper from "./components/pages/solver/solver-wrapper.component";
import AgendaWrapper from "./components/pages/agenda/agenda-wrapper.component";

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
      default: '#eee',
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



function App() {
    const [openNav,setOpenNav] = React.useState(true)

    return (
      <ThemeProvider theme={theme}>
          <CssBaseline/>
          <Box sx={{display:'flex'}}>
            <BrowserRouter>
              <Routes>
                <Route exact path="/" element={<HomePage nav={openNav} setNav={setOpenNav} />}/>
                <Route exact path="/login" element={<Login nav={openNav} setNav={setOpenNav}/>}/>
                <Route exact path="/cadastro" element={<Cadastro nav={openNav} setNav={setOpenNav}/>}/>
                <Route exact path="/lembrarsenha" element={<LembrarSenha nav={openNav} setNav={setOpenNav} />}/>
                <Route exact path="/redefinirsenha/:resetToken" element={<RedefinirSenha nav={openNav} setNav={setOpenNav}/>}/>
                <Route path="/config" element={<ConfigWrapper nav={openNav} setNav={setOpenNav}/>}/>
                <Route path="/turmas" element={<TurmasWrapper nav={openNav} setNav={setOpenNav}/>}/>
                <Route path="/predios" element={<PrediosWrapper nav={openNav} setNav={setOpenNav}/>}/>
                <Route path="/predios/:predio" element={<SalasWrapper nav={openNav} setNav={setOpenNav}/>}/>
                <Route path="/distancias" element={<DistanciasWrapper nav={openNav} setNav={setOpenNav}/>}/>
                <Route path="/solver" element={<SolverWrapper nav={openNav} setNav={setOpenNav}/>}/>
                <Route path="/agenda" element={<AgendaWrapper nav={openNav} setNav={setOpenNav}/>}/>
              </Routes>
            </BrowserRouter>
          </Box>
      </ThemeProvider>
    )
}

export default App;
