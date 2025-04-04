import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import Navbar from './pages/Navbar';
import Home from './pages/Home';
import Servers from './pages/Servers';
import Skins from './pages/Skins';
import Wireguard from './pages/Wireguard';
import Login from './pages/Login';
import Register from './pages/Register';
import Logout from './pages/Logout';
import ProtectedRoute from './protected/ProtectedRoute'; // Importa el componente de protección

import './App.css';

const App = () => {
  return (
    <>
      <CssBaseline />
      <Navbar />
      <Box component="main" sx={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/servers"
            element={
              <ProtectedRoute>
                <Servers />
              </ProtectedRoute>
            }
          />
          <Route path="/skins" element={<Skins />} />
          <Route path="/wireguard" element={<Wireguard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </Box>
    </>
  );
};

export default App;
