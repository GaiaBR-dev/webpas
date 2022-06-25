import React from "react";
import { Typography } from "@mui/material";
import { Grid, Divider } from "@mui/material";

const iconTypo ={
    '& .MuiSvgIcon-root':{
        fontSize: '1.8rem',
        marginRight: 0.7,
        display:'inline-block',
    }
}

const subtitleH = {
    opacity: '0.7'
}

const PageHeader = props =>{
    const { title ,subtitle, icon} = props
    
    return(
        <>
        <Grid container 
            direction="row"
            justifyContent="flex-start"
            alignItems="center">
            <Grid item sx ={iconTypo}>
                {icon}
            </Grid>
            <Grid item>
                <Typography 
                    variant="h4"
                    component="div"
                >{title}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography 
                        sx ={subtitleH}
                        variant="subtitle2"
                        component="div"
                    >{subtitle}</Typography>
            </Grid>
        </Grid>
        <br/>
        <Divider/>
        <br/>
        </>
    )
}

export default PageHeader;