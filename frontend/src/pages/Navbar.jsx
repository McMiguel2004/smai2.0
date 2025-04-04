import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Menu, MenuItem, Box, IconButton, Typography } from '@mui/material';
import { Logout, Login, PersonAdd, Storage, AccountCircle, Person, VpnKey, Home } from '@mui/icons-material';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('Cuenta');
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar autenticación llamando al endpoint /api/auth/me
    fetch('http://localhost:5000/api/auth/me', {
      method: 'GET',
      credentials: 'include', // Envía las cookies
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Not authenticated");
      })
      .then((data) => {
        setIsAuthenticated(true);
        setUsername(data.username || 'Cuenta');
      })
      .catch((err) => {
        setIsAuthenticated(false);
        setUsername('Cuenta');
      });
  }, []);

  const handleLogout = () => {
    // Llamada al endpoint /logout para invalidar la sesión en el backend
    fetch('http://localhost:5000/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    })
      .then((res) => {
        if (res.ok) {
          setIsAuthenticated(false);
          setUsername('Cuenta');
          navigate('/login');
        } else {
          throw new Error('Logout fallido');
        }
      })
      .catch((err) => console.error(err));
    setAnchorEl(null);
  };

  return (
    <AppBar 
      position="static" 
      sx={{ 
        backgroundColor: '#262423',
        borderBottom: '1px solid #333',
        boxShadow: 'none',
        height: '64px'
      }}
    >
      <Toolbar sx={{ 
        justifyContent: 'space-between',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        height: '100%',
        alignItems: 'center'
      }}>
        {/* Logo a la izquierda */}
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

        {/* Botones centrales */}
        <Box sx={{ 
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '20px'
        }}>
          <Button 
            component={Link} 
            to="/" 
            startIcon={<Home />}
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
            Home
          </Button>
          {isAuthenticated && (
            <Button 
              component={Link} 
              to="/servers" 
              startIcon={<Storage />}
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
              Servers
            </Button>
          )}
          <Button 
            component={Link} 
            to="/skins" 
            startIcon={<Person />} 
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
            Skins
          </Button>
          <Button 
            component={Link} 
            to="/wireguard" 
            startIcon={<VpnKey />}
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
            WireGuard
          </Button>
        </Box>

        {/* Menú de cuenta a la derecha */}
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', gap: 2 }}>
          {isAuthenticated && (
            <Typography variant="body1" sx={{ color: 'white' }}>
              Hola, {username}
            </Typography>
          )}
          <IconButton
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{ 
              color: 'white',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            <AccountCircle fontSize="large" />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
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
                <MenuItem 
                  component={Link} 
                  to="/login"
                  sx={{ fontFamily: '"Minecraft", sans-serif', '&:hover': { backgroundColor: '#333' } }}
                >
                  <Login sx={{ mr: 1, color: '#4CAF50' }}/> Iniciar Sesión
                </MenuItem>
                <MenuItem 
                  component={Link} 
                  to="/register"
                  sx={{ fontFamily: '"Minecraft", sans-serif', '&:hover': { backgroundColor: '#333' } }}
                >
                  <PersonAdd sx={{ mr: 1, color: '#4CAF50' }}/> Registrar
                </MenuItem>
              </>
            ) : (
              <MenuItem 
                onClick={handleLogout}
                sx={{ fontFamily: '"Minecraft", sans-serif', '&:hover': { backgroundColor: '#333' } }}
              >
                <Logout sx={{ mr: 1, color: '#f44336' }}/> Cerrar Sesión
              </MenuItem>
            )}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
