import React from 'react';
import { Button } from '@mui/material';

const SubmitButton = ({ text, onClick }) => {
  return (
    <Button
      fullWidth
      type="submit"
      variant="contained"
      sx={{ 
        mt: 3, 
        mb: 2, 
        py: 1.5,
        borderRadius: 0,
        backgroundColor: '#4CAF50',
        color: 'white',
        fontFamily: '"Minecraft", sans-serif',
        fontSize: '1rem',
        letterSpacing: '1px',
        border: '2px solid #2E7D32',
        boxShadow: '3px 3px 0px #2E7D32',
        '&:hover': {
          backgroundColor: '#388E3C', 
          transform: 'translate(1px, 1px)',
          boxShadow: '2px 2px 0px #2E7D32'
        },
        transition: 'all 0.1s ease'
      }}
      onClick={onClick}
    >
      {text}
    </Button>
  );
};

export default SubmitButton;
