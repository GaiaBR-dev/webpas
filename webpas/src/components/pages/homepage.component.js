import React from "react";
import useAuth from '../../services/useAuth';
import { styled } from '@mui/material/styles';
import Navbar from "../re-usable/navbar.component";
import { Container } from "@mui/material";
import { Box } from "@mui/system";
import PageHeader from "../re-usable/page-header.component";
import WebhookIcon from '@mui/icons-material/Webhook';

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

function HomePage(){
    const {logout,user} = useAuth()

    return(
        <>
            <Navbar/>
            <Box component="main" sx={{ flexGrow: 1, p: 3 , backgroundColor:'#F5F5F5' }}>
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