import React from "react";
import { useState, useEffect } from "react";
import { Grid, Typography, IconButton, Button } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import styled from "@emotion/styled";
import { Box } from "@mui/system";
import * as XLSX from 'xlsx/xlsx.mjs';
import DistanciasDataService from "../../services/distancias"
import ExcelValidator from "../../services/excel-validator";
import { LinearProgress } from "@mui/material";

const Input = styled('input')({
    display: 'none',
});

function handleFileChoose(e){
    document.querySelector("#excelFileName").textContent =e.target.files[0].name;
}

const modalStyleFile = {
    position:'absolute',
    backgroundColor: "#fff",
    borderRadius: '8px',
    top:'50%',
    left:'50%',

    overflow:'auto',
    display:'block',
    transform: 'translate(-50%, -50%)',
    width: '75%',
    p: 4,
    '@media (min-width: 900px)': {
        width: '65%'
    },
    '@media (min-width: 1050px)': {
        width: '55%'
    },
    '@media (min-width: 1400px)': {
        width: '45%'
    },
    '@media (min-width: 1600px)': {
        width: '35%'
    },
    '@media (min-width: 1800px)': {
        width: '25%'
    },
};

export default function FileFormDistancias(props){
    const [working,setWorking] = useState(false)

    useEffect(()=>{
        setWorking(false)
    },[])
    
    const handleFileSubmit = (e) =>{
        const file = document.querySelector("#readExcelFile").files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            setWorking(true)
            const workbook = XLSX.read(e.target.result);
            let temDistancia = false
            let rowObject
            workbook.SheetNames.forEach(sheet => {
                if (sheet === 'Distâncias'){
                    temDistancia = true
                    rowObject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet])
                }
            });
            if (temDistancia){
                let res = ExcelValidator.firstValidateDistancias(rowObject)
                if (!res.erro){
                    const ndistancias = ExcelValidator.mapColumnKeysDistancias(rowObject)
                    let data ={
                        novasDistancias:ndistancias
                    }
                    DistanciasDataService.addManyDistancias(data)
                        .then(res => handleResponse(res))
                        .catch(err => handleResponse(err))
                }else{
                    handleResponse(res)
                }
            }else{
                console.log('Não tem distância')
            }
        };
        reader.readAsArrayBuffer(file);
    }

    const{title, closeButton, handleResponse } = props
    
    return (
        <Box component="form" sx = {modalStyleFile}>
        <Grid container rowSpacing={2} spacing={1} justifyContent="space-between" columns={12}>
            <Grid item xs={11} >
                <Typography variant='h5'>{title}</Typography>
            </Grid>
            <Grid item xs={1} >
                <IconButton onClick={closeButton}><CloseIcon/></IconButton>
            </Grid>
            <Grid item xs={12} mb={1}>
                <label htmlFor='readExcelFile'>
                    <Input 
                        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" 
                        id="readExcelFile" 
                        multiple type="file"
                        onChange={handleFileChoose}
                    />
                    <Button component='span' variant='outlined' >Escolher Arquivo</Button>
                </label>
                <Typography
                    sx={{display:"inline", marginLeft:2}}
                    id="excelFileName"
                    variant='body1'
                />
            </Grid>
            <Grid item xs={6} alignContent='center'>
                <Button variant='contained' onClick={handleFileSubmit}>Enviar</Button>
            </Grid>
            <Grid item xs ={12}>
                {working ?  (
                        <LinearProgress></LinearProgress>
                    ):(
                        <div></div>
                    )
                        
                }
            </Grid>
        </Grid>
        </Box>
    )
}