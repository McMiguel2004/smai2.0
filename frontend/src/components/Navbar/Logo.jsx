// components/Logo.jsx
import { Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Logo = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
    <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
      <Box
        component="img"
        src="/assets/images/navbar/smai.png"
        alt="Logo"
        sx={{
          height: 40,
          filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.5))',
          cursor: 'pointer'
        }}
      />
    </Link>
  </Box>
);

export default Logo;
