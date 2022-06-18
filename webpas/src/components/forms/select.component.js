import { FormControl, FormHelperText, InputLabel , MenuItem, Select as MuiSelect} from "@mui/material";
import React from "react";

const Select = (props) =>{
    const  {name, label, value, onChange, options ,error, style = null} = props

    const cssStyle= {
        ...style,
        width:'100%'
    }

    return(
        <FormControl
            sx={cssStyle} 
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

export default Select;