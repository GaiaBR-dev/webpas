import React, {Component, useEffect, useState} from "react";
import PageHeader from '../../re-usable/page-header.component';
import SettingsIcon from '@mui/icons-material/Settings';
import { Box, Paper, Grid, Typography, FormGroup, FormControlLabel, Checkbox, Divider, TextField, Button } from "@mui/material";
import ConfigsDataService from '../../../services/configs';
import Mensagem from '../../re-usable/mensagem.component';
import handleServerResponses from "../../../services/response-handler";

const dias = ['Segunda','Terça','Quarta','Quinta','Sexta','Sábado','Domingo']
const periodos = ['Manhã','Tarde','Noite']

const emptyHorarios = {
    "Manhã":{
            "Início":{
                slot1:'',
                slot2:'',
            },
            "Fim":{
                slot1:'',
                slot2:'',
            }
    },
    "Tarde":{
            "Início":{
                slot1:'',
                slot2:'',
            },
            "Fim":{
                slot1:'',
                slot2:'',
            }
    },
    "Noite":{
            "Início":{
                slot1:'',
                slot2:'',
            },
            "Fim":{
                slot1:'',
                slot2:'',
            }
    }
}

const ConfigForm = props =>{
    const {config,user,logout} = props
    const [notify,setNotify] = useState({isOpen:false,message:'',type:''})
    const [diasCBList,setDiasCBList] = useState(new Array(dias.length).fill(false))
    const [numSalasAux,setNumSalasAux] = useState(20);
    const [capSalasAux,setCapSalasAux] = useState(200);
    const [periodosCBList,setPeriodosCBList] = useState(new Array(periodos.length).fill(false))
    const [horariosObj,setHorariosObj] = useState(()=>{
        return emptyHorarios
    })

    useEffect(()=>{
        setFormByConfig()
    },[config])

    const setFormByConfig = () =>{
        if (config){
            console.log(config)
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
            config.horarios = config?.horarios? config.horarios : {}
            let horariosTemp = {...emptyHorarios}

            if(config.horarios["Manhã"]){
                horariosTemp["Manhã"]["Início"].slot1 = config.horarios['Manhã']['Início'].slot1
                horariosTemp["Manhã"]["Início"].slot2 = config.horarios['Manhã']['Início'].slot2
                horariosTemp["Manhã"]["Fim"].slot1 = config.horarios['Manhã']['Fim'].slot1
                horariosTemp["Manhã"]["Fim"].slot2 = config.horarios['Manhã']['Fim'].slot2
            }else{
                horariosTemp["Manhã"]["Início"].slot1 = ""
                horariosTemp["Manhã"]["Início"].slot2 = ""
                horariosTemp["Manhã"]["Fim"].slot1 = ""
                horariosTemp["Manhã"]["Fim"].slot2 = ""
            }

            if(config.horarios["Tarde"]){
                horariosTemp["Tarde"]["Início"].slot1 = config.horarios['Tarde']['Início'].slot1
                horariosTemp["Tarde"]["Início"].slot2 = config.horarios['Tarde']['Início'].slot2
                horariosTemp["Tarde"]["Fim"].slot1 = config.horarios['Tarde']['Fim'].slot1
                horariosTemp["Tarde"]["Fim"].slot2 = config.horarios['Tarde']['Fim'].slot2
            }else{
                horariosTemp["Tarde"]["Início"].slot1 = ""
                horariosTemp["Tarde"]["Início"].slot2 = ""
                horariosTemp["Tarde"]["Fim"].slot1 = ""
                horariosTemp["Tarde"]["Fim"].slot2 = ""
            }

            if(config.horarios["Noite"]){
                horariosTemp["Noite"]["Início"].slot1 = config.horarios['Noite']['Início'].slot1
                horariosTemp["Noite"]["Início"].slot2 = config.horarios['Noite']['Início'].slot2
                horariosTemp["Noite"]["Fim"].slot1 = config.horarios['Noite']['Fim'].slot1
                horariosTemp["Noite"]["Fim"].slot2 = config.horarios['Noite']['Fim'].slot2
            }else{
                horariosTemp["Noite"]["Início"].slot1 = ""
                horariosTemp["Noite"]["Início"].slot2 = ""
                horariosTemp["Noite"]["Fim"].slot1 = ""
                horariosTemp["Noite"]["Fim"].slot2 = ""
            }

            setHorariosObj(horariosTemp)
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
        
        if(horario == "Início" && slot == "slot2"){
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
                                    <Typography marginLeft={5}>Horários de Início</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        variant="outlined"
                                        label="Slot1"
                                        name = "Manhã-Início_slot1"
                                        onChange={handleHorariosChange}
                                        value ={horariosObj['Manhã']['Início'].slot1}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        variant="outlined"
                                        label="Slot2"
                                        name = "Manhã-Início_slot2"
                                        onChange={handleHorariosChange}
                                        value ={horariosObj['Manhã']['Início'].slot2}
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
                                    <Typography marginLeft={5}>Horários de Início</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        variant="outlined"
                                        label="Slot1"
                                        name = "Tarde-Início_slot1"
                                        onChange={handleHorariosChange}
                                        value ={horariosObj['Tarde']['Início'].slot1}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        variant="outlined"
                                        label="Slot2"
                                        name = "Tarde-Início_slot2"
                                        onChange={handleHorariosChange}
                                        value ={horariosObj['Tarde']['Início'].slot2}
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
                                    <Typography marginLeft={5}>Horários de Início</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        variant="outlined"
                                        label="Slot1"
                                        name = "Noite-Início_slot1"
                                        onChange={handleHorariosChange}
                                        value ={horariosObj['Noite']['Início'].slot1}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        variant="outlined"
                                        label="Slot2"
                                        name = "Noite-Início_slot2"
                                        onChange={handleHorariosChange}
                                        value ={horariosObj['Noite']['Início'].slot2}
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
                                        value ={horariosObj['Noite']['Início'].slot2}
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

                    <Grid item xs={20} marginY="15px">
                            <Divider/>
                    </Grid>
                    <Grid item xs={20}>
                            <Typography fontSize={'1.1rem'} fontWeight={'405'}> Configurações do prédio auxiliar</Typography>
                    </Grid>
                    <Grid item xs={20}>
                        <TextField
                            variant="outlined"
                            label="Número de Salas"
                            name = "numSalasAux"
                            value ={numSalasAux}
                        />
                    </Grid>
                    <Grid item xs={20}>
                        <TextField
                            variant="outlined"
                            label="Capacidade das Salas"
                            name = "capSalasAux"
                            value ={capSalasAux}
                        />
                    </Grid>
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