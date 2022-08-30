import React, { useEffect, useState } from "react";
import useForm from "./useForm";
import { Button, Divider, FormControl, FormControlLabel, FormLabel, RadioGroup, TextField } from "@mui/material";
import { Radio } from "@mui/material";
import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import { IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import ExcelExporter from "../../services/excel-exporter";
import * as XLSX from 'xlsx/xlsx.mjs';

const inicialValues ={
    formato: 1,
    filtro: 1,
    camposSelecionados: 1,
}

const formCssClass ={
    '& .MuiGrid-item':{
        '& .MuiTextField-root':{
            width:"100%"
        }
    }
}

const ExportarResultadoForm = props =>{
    const {ano,semestre,closeModalForm,resultados,horariosInicio,state,filterFn} = props

    const [exportLinhas,setExportLinhas] = useState([]);
    const [exportColunas,setExportColunas] = useState([]);
    const [alocacoes,setAlocacoes] = useState([]);

    useEffect(()=>{
        retornaAlocacoes()
    },[resultados])

    const retornaAlocacoes = () =>{
        if(resultados.length > 0){
            let alocacoesTemp = []
            resultados.map(resultado=>{
                resultado.alocacoes.map(alocacao=>{
                    let alocacaoTemp = {
                        horario: alocacao?.horarioSlot == 1 ? 
                            getHorarioByPeriodo(resultado.periodo,1) : 
                            getHorarioByPeriodo(resultado.periodo,2),
                        turma : alocacao?.turma,
                        sala: alocacao?.sala 
                    }
                    alocacoesTemp.push(alocacaoTemp)
                })
            })

            let resposta = alocacoesTemp.filter(aloc=>{
                return aloc.horario == aloc.turma.horarioInicio
            })
            console.log(resposta)

            setAlocacoes(resposta)
        }else{
            setAlocacoes([])
        }
    }

    const getHorarioByPeriodo = (periodo,slot) =>{
        let periodoNum= 0
        if (periodo === 'Manhã'){
            periodoNum = 0
        } else if ( periodo === 'Tarde'){
            periodoNum = 1
        } else if ( periodo === 'Noite'){
            periodoNum = 2
        }
        return horariosInicio[periodoNum*2+slot - 1]
    }

    const retornaExportObjLinhas = () =>{
        if(alocacoes.length > 0){
            
            let unique = alocacoes.reduce((acc, cur) => {
                const search = acc.find(obj => obj.sala === cur.sala.numeroSala && obj.predio === cur.sala.predio)
                if (!search) {
                acc.push({ sala: cur.sala.numeroSala, predio: cur.sala.predio})
                }
                return acc
            }, [])
    
            let dias = [...new Set(alocacoes.map(item => item.turma.diaDaSemana))];
        
            let tableObjs = []
            dias.map(diaDaSemana=>{
                let result = {}
                unique.map(obj=>{
                    result = {...obj}                         
                    result.diaDaSemana = diaDaSemana
                    horariosInicio.map(horario=>{
                        let alocacao = alocacoes.find(aloc=>(
                            aloc.sala.numeroSala == obj.sala &&
                            aloc.sala.predio == obj.predio &&
                            aloc.horario == horario &&
                            aloc.turma.diaDaSemana == diaDaSemana
                        ))
                        if (alocacao){
                            result[horario] = alocacao.turma
                            result[horario].capacidade = alocacao.sala.capacidade
                        }
                    })
                    tableObjs.push(result)
                })
            })
            console.log(tableObjs)
            setExportLinhas(tableObjs)     
        }
    }

    const retornaExportObjColunas = () =>{
        if (alocacoes.length > 0){
            let result = []
            if (values.filtro == 1){
                if (values.camposSelecionados == 1){
                    result = ExcelExporter.colunasSemFiltroSemCampos(alocacoes)
                }else if (values.camposSelecionados == 2){
                    result = ExcelExporter.colunasSemFiltroComCampos(alocacoes,state)
                }
            }else if (values.filtro == 2){
                if (values.camposSelecionados == 1){
                    result = ExcelExporter.colunasComFiltroSemCampos(alocacoes,filterFn)
                }else if (values.camposSelecionados == 2){
                    result = ExcelExporter.colunasComFiltroComCampos(alocacoes,filterFn,state)
                }
            }
            setExportColunas(result)
            createExcelFile(result)
        }
        
    }

    const createExcelFile = exportArray =>{
        var workbook = XLSX.utils.book_new();
        var worksheet = XLSX.utils.json_to_sheet(exportArray);
        XLSX.utils.book_append_sheet(workbook, worksheet, "Resultados");
        XLSX.writeFile(workbook, 'Resultado.xlsx');
    }

    const{
        values,
        setValues,
        handleInputChange,
        erros,
        setErros,
        resetForm,
    }=useForm(inicialValues)

    const createExportLinhasFile = () =>{
        
    }

    const handleSubmit = e =>{
        e.preventDefault()
        if (values.formato == 1){
            retornaExportObjColunas()
        }else if (values.formato == 2){

        }

    }

    return (
        <>
        <Box component="form"  onSubmit={handleSubmit}>
            <Grid container
                columns={12}
                spacing={2}
                sx = {formCssClass} 
                justifyContent="space-between"
                alignItems="flex-start">
                <Grid item xs={11}>
                    <Typography variant="h5">Exportar Resultado</Typography>
                </Grid>
                <Grid item xs={1}>
                    <IconButton onClick={closeModalForm} >
                        <CloseIcon />
                    </IconButton>
                </Grid>
                <Grid item xs={12}><Divider/></Grid> 
                
                <Grid item xs={12} >
                    <FormControl>
                        <FormLabel>Formato</FormLabel>
                        <RadioGroup row
                        name="formato"
                        value={values.formato}
                        onChange={handleInputChange}>
                            <FormControlLabel value={1} control={<Radio />} label="Base de Dados" />
                            <FormControlLabel value={2} control={<Radio />} label="Agenda" />
                        </RadioGroup>
                    </FormControl>
                </Grid>


                <Grid item xs={12} >
                    <FormControl>
                        <FormLabel>Busca</FormLabel>
                        <RadioGroup row
                        name="filtro"
                        value={values.filtro}
                        onChange={handleInputChange}>
                            <FormControlLabel value={1} control={<Radio />} label="Todos" />
                            <FormControlLabel value={2} control={<Radio />} label="Somente buscados" />
                        </RadioGroup>
                    </FormControl>
                </Grid>

                <Grid item xs={12} >
                    <FormControl>
                        <FormLabel>Campos</FormLabel>
                        <RadioGroup row
                        name="camposSelecionados"
                        value={values.camposSelecionados}
                        onChange={handleInputChange}>
                            <FormControlLabel value={1} control={<Radio />} label="Todos" />
                            <FormControlLabel value={2} control={<Radio />} label="Somente campos selecionados" />
                        </RadioGroup>
                    </FormControl>
                </Grid>
                <Grid item xs={12} ></Grid>
                <Grid item xs={12} sx={{marginY:2}}>
                    <Button variant='outlined' size="large" color='primary' onClick={resetForm} sx={{marginRight:2}}>Resetar</Button>
                    <Button variant='contained' type="submit"size="large" color='secondary'>Baixar</Button>
                </Grid>
            </Grid>
        </Box>
        </>
    )
}

export default ExportarResultadoForm