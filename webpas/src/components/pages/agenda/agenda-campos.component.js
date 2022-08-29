import React from "react";
import { Checkbox, FormControl, FormControlLabel, FormGroup, Typography, Box } from "@mui/material";

const AgendaCampos = props =>{
    const {state,setState} = props

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
                            checked={state.horarioFim} 
                            onChange={handleChange}
                            name="horarioFim"
                        />}
                        label="Horario de Término"
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