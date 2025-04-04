import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Container,
  Link
} from '@mui/material';
import { Lock } from '@mui/icons-material';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        credentials: 'include', // Necesario para cookies
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }
  
      const data = await response.json();
      // Las cookies se manejan automáticamente
      
      navigate('/');
      window.location.reload();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box
      sx={{
        backgroundImage: 'url(/assets/images/auth/MSA_Stage5_Login.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Container maxWidth="xs">
        <Paper 
          elevation={24}
          sx={{
            p: 4,
            backgroundColor: 'rgba(40, 40, 40, 0.85)',
            borderRadius: 0, // Bordes cuadrados estilo Minecraft
            border: '4px solid #4a4a4a',
            boxShadow: `
              0 0 0 2px #2d2d2d,
              0 0 0 4px #1a1a1a,
              10px 10px 0 0 rgba(0, 0, 0, 0.5)`, // Efecto 3D
            transform: 'perspective(500px) rotateX(2deg)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: `
                0 0 0 2px #2d2d2d,
                0 0 0 4px #1a1a1a,
                15px 15px 0 0 rgba(0, 0, 0, 0.5)`,
              transform: 'perspective(500px) rotateX(5deg)'
            }
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            mb: 3
          }}>
            <Lock sx={{ 
              fontSize: 40, 
              mb: 2, 
              color: '#4CAF50',
              filter: 'drop-shadow(2px 2px 0px #2E7D32)'
            }} />
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 3, 
                color: 'white',
                fontFamily: '"Minecraft", sans-serif',
                textShadow: '2px 2px 0 #3F51B5',
                letterSpacing: '1px'
              }}
            >
              INICIAR SESIÓN
            </Typography>
          </Box>

          {error && (
            <Typography 
              color="error" 
              sx={{ 
                mb: 2,
                fontFamily: '"Minecraft", sans-serif',
                textAlign: 'center'
              }}
            >
              {error}
            </Typography>
          )}

          <Box component="form" onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Correo Electrónico"
              type="email"
              autoComplete="email" 
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
            
            <TextField
              fullWidth
              label="Contraseña"
              type="password"
              autoComplete="current-password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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
            >
              INICIAR SESIÓN
            </Button>
          </Box>

          <Typography 
            variant="body2" 
            sx={{ 
              color: '#aaa', 
              textAlign: 'center',
              fontFamily: '"Minecraft", sans-serif'
            }}
          >
            ¿No tienes cuenta?{' '}
            <Link 
              href="/register" 
              color="#4CAF50"
              sx={{
                fontFamily: '"Minecraft", sans-serif',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                  textShadow: '0 0 5px #4CAF50'
                }
              }}
            >
              REGÍSTRATE
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

export default Login;