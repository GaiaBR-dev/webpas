import React, { useEffect } from "react";
import useAuth from '../../services/useAuth';
import { styled } from '@mui/material/styles';
import Navbar from "../re-usable/navbar.component";
import { Button, Container } from "@mui/material";
import { Box } from "@mui/system";
import PageHeader from "../re-usable/page-header.component";
import WebhookIcon from '@mui/icons-material/Webhook';
import UserDataService from '../../services/user'

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


const HomePage = props =>{
    const {logout,user} = useAuth()
    const {nav,setNav} = props

    useEffect(()=>{
        UserDataService.getPrivate()
            .then(res=>{
                let authorized = res.data.success
                if(!authorized){
                    logout()
                }
            }).catch(err=>{
                console.log(err)
                logout()
            })
    },[])

    return(
        <>
            <Navbar open={nav} setOpen={setNav}/>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                <Container sx={containerStyle}>
                    <PageHeader
                        title="WebPAS"
                        subtitle="Software Web para resolução do Problema de Alocação de Salas"
                        icon={<WebhookIcon/>}
                    />
                </Container>
            </Box>
        </>
    )

}

export default HomePage;