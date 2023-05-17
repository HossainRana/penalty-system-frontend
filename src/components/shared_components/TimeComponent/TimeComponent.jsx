import React from 'react'
import  TextField  from '@material-ui/core/TextField';

function TimeComponent({type,onChange,label, id, defaultValue, value,InputLabelProps,min,max}) {
  // const required=requiredText;

    return (
    <TextField style={{width:"48%",marginLeft:"10px"}}  id={id} defaultValue={defaultValue} value={value} label={label} min={min} max={max} type={type} onChange={onChange} InputLabelProps={InputLabelProps}>

    </TextField>
  )
}

export default TimeComponent