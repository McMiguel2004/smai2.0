import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import Logo from '../components/Navbar/Logo';
import CenterButtons from '../components/Navbar/CenterButtons';
import AccountIcon from '../components/Navbar/AccountIcon';
import AccountMenu from '../components/Navbar/AccountMenu';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('Cuenta');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/auth/me', {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => res.ok ? res.json() : Promise.reject())
      .then((data) => {
        setIsAuthenticated(true);
        setUsername(data.username || 'Cuenta');
      })
      .catch(() => {
        setIsAuthenticated(false);
        setUsername('Cuenta');
      });
  }, []);

  const handleLogout = () => {
    fetch('http://localhost:5000/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    })
      .then((res) => {
        if (res.ok) {
          setIsAuthenticated(false);
          setUsername('Cuenta');
          navigate('/login');
        }
      })
      .catch(console.error);
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" sx={{
      backgroundColor: '#262423',
      borderBottom: '1px solid #333',
      boxShadow: 'none',
      height: '64px'
    }}>
      <Toolbar sx={{
        justifyContent: 'space-between',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        height: '100%',
        alignItems: 'center'
      }}>
        <Logo />
        <CenterButtons />
        <AccountIcon username={username} isAuthenticated={isAuthenticated} onClick={(e) => setAnchorEl(e.currentTarget)} />
        <AccountMenu anchorEl={anchorEl} onClose={() => setAnchorEl(null)} isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
