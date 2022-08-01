import React, {useEffect,useState} from "react";
import useAuth from "../../../services/useAuth";
import ConfigsDataService from '../../../services/configs';
import { styled } from '@mui/material/styles';
import Navbar from "../../re-usable/navbar.component";
import { Container } from "@mui/material";
import { Box } from "@mui/system";
import SalasList from './salas-list.component';

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

const SalasWrapper = props =>{
    const {user,logout} = useAuth()
    const [config,setConfig] = useState({dias:[],periodos:[]})
    const [noUser,setNoUser] = useState(true)
  
    useEffect(()=>{
      if(user && noUser){
        retornaConfig()
        setNoUser(false)
      }
    },[user])

    const retornaConfig = () =>{
        let searchId = user? user._id : "10"
        ConfigsDataService.getConfigById(searchId) 
            .then(res=> {
              setConfig(res.data)})
            .catch(err=>{
              let notAuthorized = err.response.data?.notAuth ? err.response.data.notAuth : false
              if (notAuthorized){
                logout()
              } 
            })
    }
    return(
        <>
        <Navbar/>
        <Box component="main" sx={{ flexGrow: 1, p: 3}}>
            <DrawerHeader />
            <Container sx={containerStyle}>
              <SalasList config={config} user={user} logout={logout}/>
            </Container>
        </Box>
      </>
    )


}

export default SalasWrapper;