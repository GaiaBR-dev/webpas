import { Alert, Snackbar } from "@mui/material";
import React from "react";

export default function Mensagem(props){
    const {notify, setNotify} = props
    
    const handleClose = (event,reason) =>{
        if (reason === 'clickaway'){
            return
        }
        setNotify({
            ...notify,
            isOpen:false
        })
    }

    return(
        <Snackbar
            sx={{marginTop:'50px'}}
            open={notify.isOpen}
            autoHideDuration={3000}
            anchorOrigin={{vertical:'top',horizontal:'right'}}
            onClose={handleClose}
        >
            <Alert severity={notify.type} variant="filled" onClose={handleClose}>
                {notify.message}
            </Alert>
        </Snackbar>
    )
}