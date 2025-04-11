// components/NavButton.jsx
import { Button } from '@mui/material';

const NavButton = ({ to, icon, children }) => (
  <Button
    component="a"
    href={to}
    startIcon={icon}
    sx={{
      color: 'white',
      fontFamily: '"Minecraft", sans-serif',
      letterSpacing: '1px',
      borderRadius: 0,
      border: '2px solid #4a4a4a',
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      boxShadow: '3px 3px 0px #4CAF50',
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        transform: 'translate(1px, 1px)',
        boxShadow: '2px 2px 0px #2E7D32'
      },
      transition: 'all 0.1s ease',
      px: 2,
      py: 1
    }}
  >
    {children}
  </Button>
);

export default NavButton;
