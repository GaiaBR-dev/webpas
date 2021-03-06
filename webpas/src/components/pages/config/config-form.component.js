import React, {Component, useEffect, useState} from "react";
import PageHeader from '../../re-usable/page-header.component';
import SettingsIcon from '@mui/icons-material/Settings';
import { Box, Paper, Grid, Typography, FormGroup, FormControlLabel, Checkbox, Divider, TextField, Button } from "@mui/material";
import ConfigsDataService from '../../../services/configs';
import Mensagem from '../../re-usable/mensagem.component';
import handleServerResponses from "../../../services/response-handler";

const dias = ['Segunda','Terça','Quarta','Quinta','Sexta','Sábado','Domingo']
const periodos = ['Manhã','Tarde','Noite']

const ConfigForm = props =>{
    const {config,user,logout} = props
    const [notify,setNotify] = useState({isOpen:false,message:'',type:''})
    const [diasCBList,setDiasCBList] = useState(new Array(dias.length).fill(false))
    const [periodosCBList,setPeriodosCBList] = useState(new Array(periodos.length).fill(false))
    const [horariosObj,setHorariosObj] = useState(()=>{
        let horarios = {
            "Manhã":{
                    "Ínicio":{
                        slot1:'',
                        slot2:'',
                    },
                    "Fim":{
                        slot1:'',
                        slot2:'',
                    }
            },
            "Tarde":{
                    "Ínicio":{
                        slot1:'',
                        slot2:'',
                    },
                    "Fim":{
                        slot1:'',
                        slot2:'',
                    }
            },
            "Noite":{
                    "Ínicio":{
                        slot1:'',
                        slot2:'',
                    },
                    "Fim":{
                        slot1:'',
                        slot2:'',
                    }
            }
        }
        return horarios
    })

    useEffect(()=>{
        setFormByConfig()
    },[config])

    const setFormByConfig = () =>{
        if (config){
            let tempArrayDias = new Array(dias.length).fill(false)
            config.dias.map(dia=>{
                tempArrayDias[dias.indexOf(dia)] = true
            })
            setDiasCBList(tempArrayDias)

            let tempArrayPeriodos = new Array(periodos.length).fill(false)
            config.periodos.map(periodo=>{
                tempArrayPeriodos[periodos.indexOf(periodo)] = true
            })
            setPeriodosCBList(tempArrayPeriodos)

            setHorariosObj(config.horarios)
        }
    }


    const handleCBDias = position =>{
        const novoDiasCB = diasCBList.map((item, index) =>
            index === position ? !item : item
        );
        setDiasCBList(novoDiasCB)
    }

    const handleCBPeriodos = position =>{
        const novoPeriodosCB = periodosCBList.map((item, index) =>
            index === position ? !item : item
        );
        setPeriodosCBList(novoPeriodosCB)
    }

    const handleHorariosChange = (e) =>{
        const {name,value} = e.target
        let periodo = name.slice(0,name.search("-"))
        let horario = name.slice(name.search("-")+1,name.search("_"))
        let slot = name.slice(name.search("_")+1)
        
        if(horario == "Ínicio" && slot == "slot2"){
            setHorariosObj({
                ...horariosObj,
                [periodo]:{
                    ...horariosObj[periodo],
                    ["Fim"]:{
                        ...horariosObj[periodo]["Fim"],
                        ['slot1']:value
                    },[horario]:{
                        ...horariosObj[periodo][horario],
                        [slot]:value
                    }
                }
            })
        }else{
            setHorariosObj({
                ...horariosObj,
                [periodo]:{
                    ...horariosObj[periodo],
                    [horario]:{
                        ...horariosObj[periodo][horario],
                        [slot]:value
                    }
                }
            })
        }
    }

    const handleBT = e =>{
        let configTemp = {}
        configTemp.dias = []
        dias.map((dia,indexD)=>{
            if(diasCBList[indexD]){
                configTemp.dias.push(dia)
            }
        })
        configTemp.periodos = []
        periodos.map((periodo,indexP)=>{
            if(periodosCBList[indexP]){
                configTemp.periodos.push(periodo)
            }
        })
        configTemp.horarios = {}
        periodos.map((periodo,indexP)=>{
            if(periodosCBList[indexP]){
                configTemp.horarios[periodo] = horariosObj[periodo]
            }
        })

        let data = {...configTemp}
        ConfigsDataService.updateConfig(data,config._id)
            .then(res=>handleServerResponses('configs',res,setNotify))
            .catch(err=>{
                console.log(err.response.data)
                let notAuthorized = err.response.data?.notAuth ? err.response.data.notAuth : false
                if (notAuthorized){
                    logout()
                }else{
                    handleServerResponses('configs',err,setNotify)
                }
            })
    }

    return(
        <>
            <PageHeader
                title="Configurações"
                subtitle="Definir dias, periodos e horários"
                icon={<SettingsIcon/>}
            />
            <Mensagem 
                notify={notify}
                setNotify={setNotify}
            />
            <Paper>
                <Box padding={'25px'}>
                    <Grid container columns={20} spacing={2} alignItems="center">
                        <Grid item xs={20}>
                            <Typography fontSize={'1.1rem'} fontWeight={'405'}> Dias em que a Universidade ministra aulas</Typography>
                        </Grid>
                        <Grid item xs={20}>
                            <FormGroup>
                                {dias.map((dia,index)=>{
                                    return(
                                        <FormControlLabel key ={index} control={
                                            <Checkbox checked={diasCBList[index]} onChange={()=>handleCBDias(index)} name={dia}/>} label={dia}>
                                        </FormControlLabel>
                                    )
                                })}
                            </FormGroup>
                        </Grid>
                        <Grid item xs={20}marginY={1}>
                            <Divider ></Divider>
                        </Grid>
                        <Grid item xs={20}>
                            <Typography fontSize={'1.1rem'} fontWeight={'405'}> Períodos em que a Universidade ministra aulas</Typography>
                        </Grid>
                        <Grid item xs={20}>
                            <FormGroup>
                                {periodos.map((periodo,index)=>{
                                    return(
                                        <FormControlLabel key ={index} control={
                                            <Checkbox checked={periodosCBList[index]} onChange={()=>handleCBPeriodos(index)} name={periodo}/>} label={periodo}>
                                        </FormControlLabel>
                                    )
                                })}
                            </FormGroup>
                        </Grid>
                        <Grid item xs={20}marginY={1}>
                            <Divider ></Divider>
                        </Grid>
                        <Grid item xs={20}>
                            <Typography fontSize={'1.1rem'} fontWeight={'405'}> Horários em que a Universidade ministra aulas</Typography>
                        </Grid>

                        {periodosCBList[0]?(
                            <>
                                <Grid item xs={20}>
                                    <Typography fontSize={'1rem'} fontWeight={'450'}>Manhã</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography marginLeft={5}>Horários de Ínicio</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        variant="outlined"
                                        label="Slot1"
                                        name = "Manhã-Ínicio_slot1"
                                        onChange={handleHorariosChange}
                                        value ={horariosObj['Manhã']['Ínicio'].slot1}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        variant="outlined"
                                        label="Slot2"
                                        name = "Manhã-Ínicio_slot2"
                                        onChange={handleHorariosChange}
                                        value ={horariosObj['Manhã']['Ínicio'].slot2}
                                    />
                                </Grid>
                                <Grid item xs={11}></Grid>
                                <Grid item xs={3}>
                                    <Typography marginLeft={5}>Horários de Término</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        disabled
                                        variant="outlined"
                                        label="Slot1"
                                        name = "Manhã-Fim_slot1"
                                        onChange={handleHorariosChange}
                                        value ={horariosObj['Manhã']['Fim'].slot1}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        variant="outlined"
                                        label="Slot2"
                                        name = "Manhã-Fim_slot2"
                                        onChange={handleHorariosChange}
                                        value ={horariosObj['Manhã']['Fim'].slot2}
                                    />
                                </Grid>

                            </>
                        ):(<></>)}
                        {periodosCBList[1]?(
                            <>
                                <Grid item xs={20}>
                                    <Typography fontSize={'1rem'} fontWeight={'450'}>Tarde</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography marginLeft={5}>Horários de Ínicio</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        variant="outlined"
                                        label="Slot1"
                                        name = "Tarde-Ínicio_slot1"
                                        onChange={handleHorariosChange}
                                        value ={horariosObj['Tarde']['Ínicio'].slot1}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        variant="outlined"
                                        label="Slot2"
                                        name = "Tarde-Ínicio_slot2"
                                        onChange={handleHorariosChange}
                                        value ={horariosObj['Tarde']['Ínicio'].slot2}
                                    />
                                </Grid>
                                <Grid item xs={11}></Grid>
                                <Grid item xs={3}>
                                    <Typography marginLeft={5}>Horários de Término</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        disabled
                                        variant="outlined"
                                        label="Slot1"
                                        name = "Tarde-Fim_slot1"
                                        onChange={handleHorariosChange}
                                        value ={horariosObj['Tarde']['Fim'].slot1}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        variant="outlined"
                                        label="Slot2"
                                        name = "Tarde-Fim_slot2"
                                        onChange={handleHorariosChange}
                                        value ={horariosObj['Tarde']['Fim'].slot2}
                                    />
                                </Grid>

                            </>
                        ):(<></>)}
                        {periodosCBList[2]?(
                            <>
                                <Grid item xs={20}>
                                    <Typography fontSize={'1rem'} fontWeight={'450'}>Noite</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography marginLeft={5}>Horários de Ínicio</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        variant="outlined"
                                        label="Slot1"
                                        name = "Noite-Ínicio_slot1"
                                        onChange={handleHorariosChange}
                                        value ={horariosObj['Noite']['Ínicio'].slot1}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        variant="outlined"
                                        label="Slot2"
                                        name = "Noite-Ínicio_slot2"
                                        onChange={handleHorariosChange}
                                        value ={horariosObj['Noite']['Ínicio'].slot2}
                                    />
                                </Grid>
                                <Grid item xs={11}></Grid>
                                <Grid item xs={3}>
                                    <Typography marginLeft={5}>Horários de Término</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        disabled
                                        variant="outlined"
                                        label="Slot1"
                                        name = "Noite-Fim_slot1"
                                        onChange={handleHorariosChange}
                                        value ={horariosObj['Noite']['Ínicio'].slot2}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        variant="outlined"
                                        label="Slot2"
                                        name = "Noite-Fim_slot2"
                                        onChange={handleHorariosChange}
                                        value ={horariosObj['Noite']['Fim'].slot2}
                                    />
                                </Grid>
                            </>
                        ):(<></>)}
                        
                    </Grid>
                    <br/>
                    <br/>
                    <Button variant="contained" onClick={handleBT}>Salvar</Button>
                    <br/>
                    
                </Box>
            </Paper>
        
        </>

    )


}

export default ConfigForm;