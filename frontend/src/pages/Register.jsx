import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Container, 
  Paper,
  Alert,
  Link
} from '@mui/material';
import { PersonAdd } from '@mui/icons-material';

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
  
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }
  
      const data = await response.json();
      setMessage('Registration successful! Please login.');
      
      // Limpiar el formulario
      setUsername('');
      setEmail('');
      setPassword('');
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
            borderRadius: 0,
            border: '4px solid #4a4a4a',
            boxShadow: `
              0 0 0 2px #2d2d2d,
              0 0 0 4px #1a1a1a,
              10px 10px 0 0 rgba(0, 0, 0, 0.5)`,
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
            <PersonAdd sx={{ 
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
                textShadow: '2px 2px 0 #3F51B5', // Changed from #7B1FA2 to match Login
                letterSpacing: '1px'
              }}
            >
              REGISTRAR USUARIO
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ 
            mb: 2,
            fontFamily: '"Minecraft", sans-serif',
            borderRadius: 0,
            border: '2px solid #f44336'
          }}>{error}</Alert>}
          
          {message && <Alert severity="success" sx={{ 
            mb: 2,
            fontFamily: '"Minecraft", sans-serif',
            borderRadius: 0,
            border: '2px solid #4CAF50'
          }}>{message}</Alert>}

          <Box component="form" onSubmit={handleRegister}>
            <TextField
              fullWidth
              label="Nombre de usuario"
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
              autoComplete="new-password"
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
                  backgroundColor: '#388E3C', // Changed from #1976D2 to match Login
                  transform: 'translate(1px, 1px)',
                  boxShadow: '2px 2px 0px #2E7D32'
                },
                transition: 'all 0.1s ease'
              }}
            >
              REGISTRAR
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
            ¿Ya tienes cuenta?{' '}
            <Link 
              href="/login" 
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
              INICIA SESIÓN
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

export default Register;