import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Paper, Typography, Container, Alert, Link } from '@mui/material';
import { PersonAdd } from '@mui/icons-material';
import TextInput from '../components/Sesion/TextInput';
import SubmitButton from '../components/Sesion/SubmitButton';

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
        <Paper elevation={24} sx={{
            p: 4,
            backgroundColor: 'rgba(40, 40, 40, 0.85)',
            borderRadius: 0,
            border: '4px solid #4a4a4a',
            boxShadow: '0 0 0 2px #2d2d2d',
            transform: 'perspective(500px) rotateX(2deg)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 0 0 2px #2d2d2d',
              transform: 'perspective(500px) rotateX(5deg)'
            }
          }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <PersonAdd sx={{ fontSize: 40, mb: 2, color: '#4CAF50' }} />
            <Typography variant="h5" sx={{ mb: 3, color: 'white' }}>REGISTRAR USUARIO</Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

          <Box component="form" onSubmit={handleRegister}>
            <TextInput label="Nombre de usuario" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <TextInput label="Correo Electrónico" value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
            <TextInput label="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
            <SubmitButton text="REGISTRAR" onClick={handleRegister} />
          </Box>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="white">
              ¿Ya tienes cuenta?{" "}
              <Link
                href="#"
                onClick={() => navigate('/login')}
                sx={{ color: '#4CAF50', textDecoration: 'none' }}
              >
                Inicia sesión aquí
              </Link>
            </Typography>
          </Box>
          
        </Paper>
      </Container>
    </Box>
  );
}

export default Register;
