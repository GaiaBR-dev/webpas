import React, {Component, useState} from "react";

const AgendaResultado = props =>{
    const [ resultados,setResultados] = useState([])

    const {ano,semestre,dia,horario,config} = props

    const retornaResultados = (ano,semestre,dia,horario) =>{
        const periodo = getPeriodoByHorario(horario,config)
        ResultadosDataService.getByAnoSemestre(ano,semestre,dia,periodo)
            .then(res=>{
                setResultados(res.data)
            }).catch(err=>console.log(err))
    }

    const getPeriodoByHorario = (horario,config) =>{
        
    }


}

export default AgendaResultado