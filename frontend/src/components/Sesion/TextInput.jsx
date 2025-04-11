import React from 'react';
import { TextField } from '@mui/material';

const TextInput = ({ label, value, onChange, type = "text", required = true }) => {
  return (
    <TextField
      fullWidth
      label={label}
      type={type}
      margin="normal"
      value={value}
      onChange={onChange}
      required={required}
      sx={{
        backgroundColor: 'rgba(0, 0, 0, 0.3)', 
        borderRadius: 0,
        border: '2px solid #4a4a4a',
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: '#4a4a4a',
          },
        },
      }}
      InputLabelProps={{ 
        style: { 
          color: '#aaa',
          fontFamily: '"Minecraft", sans-serif' 
        } 
      }}
      InputProps={{ 
        style: { 
          color: 'white',
          fontFamily: '"Minecraft", sans-serif'
        } 
      }}
    />
  );
};

export default TextInput;
