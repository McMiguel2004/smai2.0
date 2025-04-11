// components/AccountMenu.jsx
import { Menu, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';
import { Login, PersonAdd, Logout } from '@mui/icons-material';

const AccountMenu = ({ anchorEl, onClose, isAuthenticated, handleLogout }) => (
  <Menu
    anchorEl={anchorEl}
    open={Boolean(anchorEl)}
    onClose={onClose}
    sx={{
      '& .MuiPaper-root': {
        backgroundColor: '#1e1e1e',
        color: 'white',
        borderRadius: 0,
        border: '2px solid #4a4a4a',
        boxShadow: '5px 5px 0px rgba(0,0,0,0.2)'
      }
    }}
  >
    {!isAuthenticated ? (
      <>
        <MenuItem component={Link} to="/login" sx={{ fontFamily: '"Minecraft", sans-serif', '&:hover': { backgroundColor: '#333' } }}>
          <Login sx={{ mr: 1, color: '#4CAF50' }} /> Iniciar Sesión
        </MenuItem>
        <MenuItem component={Link} to="/register" sx={{ fontFamily: '"Minecraft", sans-serif', '&:hover': { backgroundColor: '#333' } }}>
          <PersonAdd sx={{ mr: 1, color: '#4CAF50' }} /> Registrar
        </MenuItem>
      </>
    ) : (
      <MenuItem onClick={handleLogout} sx={{ fontFamily: '"Minecraft", sans-serif', '&:hover': { backgroundColor: '#333' } }}>
        <Logout sx={{ mr: 1, color: '#f44336' }} /> Cerrar Sesión
      </MenuItem>
    )}
  </Menu>
);

export default AccountMenu;
