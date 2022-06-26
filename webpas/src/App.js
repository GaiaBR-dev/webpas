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



function App() {

    return (
      <ThemeProvider theme={theme}>
          <CssBaseline/>
          <Box sx={{display:'flex'}}>
            <BrowserRouter>
              <Routes>
                <Route exact path="/" element={<HomePage/>}/>
                <Route exact path="/login" element={<Login/>}/>
                <Route exact path="/cadastro" element={<Cadastro/>}/>
                <Route exact path="/lembrarsenha" element={<LembrarSenha/>}/>
                <Route exact path="/redefinirsenha/:resetToken" element={<RedefinirSenha/>}/>
                <Route path="/config" element={<ConfigWrapper/>}/>
                <Route path="/turmas" element={<TurmasWrapper/>}/>
                <Route path="/predios" element={<PrediosWrapper/>}/>
                <Route path="/predios/:predio" element={<SalasWrapper/>}/>
              </Routes>
            </BrowserRouter>
          </Box>
      </ThemeProvider>
    )
}

export default App;
