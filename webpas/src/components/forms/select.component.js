import { FormControl, FormHelperText, InputLabel , MenuItem, Select as MuiSelect} from "@mui/material";
import React from "react";

export default function Select(props){
    const  {name, label, value, onChange, options ,error = null} = props

    return(
        <FormControl
            sx={{width:'100%'}} 
            variant='outlined'
            {...(error && {error:true})}
        >
            <InputLabel>{label}</InputLabel>
            <MuiSelect
                name ={name}
                label ={label}
                value = {value}
                onChange={onChange}
            >
                <MenuItem value="">{label}</MenuItem> 
                {
                    options.map(item =>{
                        return <MenuItem  key ={item} value={item}>{item}</MenuItem>
                    })
                }
            </MuiSelect>
            {error && <FormHelperText>{error}</FormHelperText>}
        </FormControl>
    )
}