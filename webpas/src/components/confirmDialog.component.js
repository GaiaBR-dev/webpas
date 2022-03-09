import { Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import React from "react";
import { Button } from "@mui/material";

const dialogStyle={
    '& .MuiPaper-root':{
        padding:1,
    },
    '& .MuiDialogContent-root':{
        textAlign:'center'
    },
    '& .MuiDialogActions-root':{
        justifyContent:'center'
    }
}

export default function ConfirmDialog(props){
    
    const {confirmDialog,setConfirmDialog} = props
    
    return(
        <Dialog open={confirmDialog.isOpen} sx={dialogStyle}>
            <DialogTitle>

            </DialogTitle>
            <DialogContent>
                <Typography variant="h6">{confirmDialog.title}</Typography>
                <Typography variant="subtitle2">{confirmDialog.subtitle}</Typography>
            </DialogContent>
            <DialogActions>  
                <Button 
                    variant="contained" 
                    color="secondary"
                    onClick={
                        confirmDialog.onConfirm
                    }
                >Sim</Button>
                <Button 
                    variant="contained" 
                    color="primary"
                    onClick={()=> setConfirmDialog({...confirmDialog,isOpen:false})}
                >Não</Button>
            </DialogActions>
        </Dialog>
    )
}