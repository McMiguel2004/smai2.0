import React, { useState, useEffect } from 'react';
import { 
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Grid,
  Paper,
  Alert
} from '@mui/material';
import { Storage as ServerIcon, Add, Cancel, PlayArrow, Stop, Delete } from '@mui/icons-material';

const Servers = () => {
  const [showForm, setShowForm] = useState(false);
  const [servers, setServers] = useState([]);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    version: '1.20.1',
  });

  useEffect(() => {
    // Aquí iría la llamada a la API para obtener los servidores del usuario
    // fetchServers();
  }, []);

  const toggleForm = () => setShowForm(!showForm);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Aquí iría la llamada a la API para crear el servidor
      // const response = await createServer(formData);
      // Actualizar lista de servidores
      setShowForm(false);
      setFormData({ name: '', version: '1.20.1' });
    } catch (err) {
      setError('Error al crear el servidor');
    }
  };

  const handleStartServer = (serverId) => {
    // Lógica para iniciar servidor
  };

  const handleStopServer = (serverId) => {
    // Lógica para detener servidor
  };

  const handleDeleteServer = (serverId) => {
    // Lógica para eliminar servidor
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, backgroundColor: 'rgba(18, 18, 18, 0.8)' }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 4
        }}>
          <Typography variant="h4" sx={{ color: 'white' }}>
            <ServerIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Mis Servidores
          </Typography>
          
          <Button
            onClick={toggleForm}
            variant="contained"
            startIcon={showForm ? <Cancel /> : <Add />}
          >
            {showForm ? 'Cancelar' : 'Crear Servidor'}
          </Button>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {showForm && (
          <Card sx={{ mb: 4, backgroundColor: 'rgba(30, 30, 30, 0.7)' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                Nuevo Servidor
              </Typography>
              
              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Nombre del Servidor"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  margin="normal"
                  sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                  InputLabelProps={{ style: { color: '#aaa' } }}
                  InputProps={{ style: { color: 'white' } }}
                />
                
                <TextField
                  fullWidth
                  select
                  label="Versión"
                  name="version"
                  value={formData.version}
                  onChange={handleInputChange}
                  margin="normal"
                  SelectProps={{
                    native: true,
                  }}
                  sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                  InputLabelProps={{ style: { color: '#aaa' } }}
                  InputProps={{ style: { color: 'white' } }}
                >
                  <option value="1.20.1">1.20.1</option>
                  <option value="1.19.4">1.19.4</option>
                  <option value="1.18.2">1.18.2</option>
                </TextField>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button type="submit" variant="contained" sx={{ ml: 1 }}>
                    Crear Servidor
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}

        <Grid container spacing={3}>
          {servers.length === 0 ? (
            <Grid item xs={12}>
              <Typography sx={{ color: '#aaa', textAlign: 'center' }}>
                No tienes servidores creados. Crea tu primer servidor!
              </Typography>
            </Grid>
          ) : (
            servers.map(server => (
              <Grid item xs={12} sm={6} md={4} key={server.id}>
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  backgroundColor: 'rgba(30, 30, 30, 0.7)'
                }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2" sx={{ color: 'white' }}>
                      {server.name}
                    </Typography>
                    <Typography sx={{ color: '#aaa', mb: 1 }}>
                      Versión: {server.version}
                    </Typography>
                    <Typography sx={{ color: server.status === 'running' ? '#4caf50' : '#f44336' }}>
                      Estado: {server.status === 'running' ? 'En ejecución' : 'Detenido'}
                    </Typography>
                  </CardContent>
                  
                  <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Button 
                      size="small" 
                      startIcon={<PlayArrow />}
                      onClick={() => handleStartServer(server.id)}
                      disabled={server.status === 'running'}
                    >
                      Iniciar
                    </Button>
                    <Button 
                      size="small" 
                      startIcon={<Stop />}
                      onClick={() => handleStopServer(server.id)}
                      disabled={server.status !== 'running'}
                      color="error"
                    >
                      Detener
                    </Button>
                    <Button 
                      size="small" 
                      startIcon={<Delete />}
                      onClick={() => handleDeleteServer(server.id)}
                      color="warning"
                    >
                      Eliminar
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Paper>
    </Container>
  );
};

export default Servers;