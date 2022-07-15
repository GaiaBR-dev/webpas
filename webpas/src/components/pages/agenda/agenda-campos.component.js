import React from "react";
import { Checkbox, FormControl, FormControlLabel, FormGroup, Typography, Box } from "@mui/material";

const AgendaCampos = props =>{
    const {state,setState} = props

    const [capacidade,setCapacidade] = React.useState(false);
    const [idTurma,setIdTurma] = React.useState(false);
    const [departamentoOferta,setDepartamentoOferta] = React.useState(false);
    const [departamentoTurma,setDepartamentoTurma] = React.useState(false);
    const [codDisciplina,setCodDisciplina] = React.useState(false);
    const [turma,setTurma] = React.useState(false);
    const [nomeDisciplina,setNomeDisciplina] = React.useState(false);
    const [totalTurma,setTotalTurma] = React.useState(false);
    const [creditosAula,setCreditosAula] = React.useState(false);
    const [docentes,setDocentes] = React.useState(false);
    
    const handleChange = (event) =>{
        setState({
            ...state,
            [event.target.name]: event.target.checked,
          });
    }

    return(
        <>
        <Box p={1.5}>
            <FormControl>
                <FormGroup>
                    <FormControlLabel
                        control={<Checkbox 
                            checked={state.capacidade} 
                            onChange={handleChange}
                            name="capacidade"
                        />}
                        label="Capacidade"
                    />
                    <FormControlLabel
                        control={<Checkbox 
                            checked={state.idTurma} 
                            onChange={handleChange}
                            name="idTurma"
                        />}
                        label="id da Turma"
                    />
                    <FormControlLabel
                        control={<Checkbox 
                            checked={state.nomeDisciplina} 
                            onChange={handleChange}
                            name="nomeDisciplina"
                        />}
                        label="Nome da Disciplina"
                    />
                    <FormControlLabel
                        control={<Checkbox 
                            checked={state.codDisciplina} 
                            onChange={handleChange}
                            name="codDisciplina"
                        />}
                        label="Código da Disciplina"
                    /> 
                    <FormControlLabel
                        control={<Checkbox 
                            checked={state.turma} 
                            onChange={handleChange}
                            name="turma"
                        />}
                        label="Turma"
                    /> 
                    <FormControlLabel
                        control={<Checkbox 
                            checked={state.departamentoOferta} 
                            onChange={handleChange}
                            name="departamentoOferta"
                        />}
                        label="Departamento de Oferta"
                    />
                    <FormControlLabel
                        control={<Checkbox 
                            checked={state.departamentoTurma} 
                            onChange={handleChange}
                            name="departamentoTurma"
                        />}
                        label="Departamento Recomendado"
                    />
                    <FormControlLabel
                        control={<Checkbox 
                            checked={state.totalTurma} 
                            onChange={handleChange}
                            name="totalTurma"
                        />}
                        label="Número de Alunos"
                    />
                    <FormControlLabel
                        control={<Checkbox 
                            checked={state.docentes} 
                            onChange={handleChange}
                            name="docentes"
                        />}
                        label="Docentes"
                    /> 
                    <FormControlLabel
                        control={<Checkbox 
                            checked={state.creditosAula} 
                            onChange={handleChange}
                            name="creditosAula"
                        />}
                        label="Créditos"
                    />      
                </FormGroup>
            </FormControl>
        </Box>
        </>
    )

}

export default AgendaCampos;