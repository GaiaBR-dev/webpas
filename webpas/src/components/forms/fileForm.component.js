import React from "react";
import { useState } from "react";
import Select from "./select.component";
import { Grid, Typography, IconButton, Button } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import styled from "@emotion/styled";
import { Box } from "@mui/system";
import useForm from "./useForm";
import { FormControl,FormLabel,RadioGroup,Radio,FormControlLabel } from "@mui/material";
import * as XLSX from 'xlsx/xlsx.mjs';
import TurmasDataService from "../../services/turmas"
import ExcelValidator from "../../services/excel-validator";

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
    height:'55%',
    overflow:'auto',
    display:'block',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    p: 4,
    '@media (min-width: 900px)': {
        width: '50%'
    }
};

const inicialValues ={
    ano:'',
    semestre: 1
}

export default function FileForm(props){
    
    const handleFileSubmit = (e) =>{
        const file = document.querySelector("#readExcelFile").files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            const workbook = XLSX.read(e.target.result);
            let temTurma = false
            let rowObject
            workbook.SheetNames.forEach(sheet => {
                if (sheet === 'Turmas'){
                    temTurma = true
                    rowObject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet])
                }
            });
            if (temTurma){
                let res = ExcelValidator.firstValidateTurmas(rowObject,config)
                if (!res.erro){
                    const nturmas = ExcelValidator.mapColumnKeys(rowObject,values.ano,values.semestre)
                    let data ={
                        novasTurmas:nturmas
                    }
                    console.log(data)
                    TurmasDataService.addManyTurmas(data)
                        .then(res => console.log(res.data))
                        .catch(err => console.log(err))
                }
            }else{
                console.log('Não tem turma')
            }
        };
        reader.readAsArrayBuffer(file);
    }

    const{title, closeButton,anos,  config } = props
    const{
        values,
        setValues,
        handleInputChange
    }=useForm(inicialValues)
    
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
            <Grid item xs={12} >
                <Typography variant='body1'> Adicionar ao ano e semestre de</Typography>
            </Grid>
            <Grid item xs={12} sm={5}>
                <Select
                    name="ano"
                    label="Ano"
                    value={values.ano}
                    onChange={handleInputChange}
                    options ={anos}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl>
                    <FormLabel>Semestre</FormLabel>
                        <RadioGroup row
                            name="semestre"
                            value={values.semestre}
                            onChange={handleInputChange}>
                        <FormControlLabel value={1} control={<Radio />} label="1º Semestre" />
                        <FormControlLabel value={2} control={<Radio />} label="2º Semestre" />
                        </RadioGroup>
                    </FormControl>
            </Grid>

            <Grid item xs={3}>
                <Button variant='contained' onClick={handleFileSubmit}>Enviar</Button>
            </Grid>
        </Grid>
        </Box>
    )
}