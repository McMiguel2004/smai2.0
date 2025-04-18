import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Grid,
  Switch,
  FormControlLabel,
  CircularProgress,
} from '@mui/material';
import { Add, Cancel, Settings } from '@mui/icons-material';

const Servers = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombreServidor: '',
    software: 'Java',
    version: '1.20.6',
    maxPlayers: 20,
    difficulty: 'NORMAL',
    mode: 'SURVIVAL',
    maxBuildHeight: 256,
    viewDistance: 10,
    spawnNpcs: true,
    allowNether: true,
    spawnAnimals: true,
    spawnMonsters: true,
    pvp: true,
    enableCommandBlock: false,
    allowFlight: false,
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedServer, setExpandedServer] = useState(null);

  const toggleOpcionesAvanzadas = () => setShowAdvanced(prev => !prev);
  const toggleExpanded = id => {
    setExpandedServer(prev => (prev === id ? null : id));
  };
  
  const fetchServers = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/servers/show_servers', {
        method: 'GET',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('No se pudo obtener la lista de servidores');
      const data = await res.json();
      setServers(data.servers || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServers();
  }, []);

  const handleSaveServer = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/servers/Create_Server', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Error al crear servidor');
      }
      alert('Servidor creado con éxito');
      setShowForm(false);
      fetchServers();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };
  
  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que quieres eliminar este servidor?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/servers/delete_server/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Error al borrar servidor');
      }
      alert('Servidor eliminado');
      // Si estaba expandido, lo colapsamos
      if (expandedServer === id) setExpandedServer(null);
      fetchServers();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };
  


    // Nuevo método para iniciar servidor
    const handleStartServer = async (id) => {
      try {
        const res = await fetch(`http://localhost:5000/api/servers/Start_Server/${id}`, {
          method: 'POST',
          credentials: 'include',
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || 'Error al iniciar servidor');
        alert('Servidor iniciado correctamente');
        fetchServers();
      } catch (err) {
        alert('Error: ' + err.message);
      }
    };
  
    

  return (
    <Container>
      <Typography variant="h3" gutterBottom>
        Servidores
      </Typography>

      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => setShowForm(true)}
      >
        Crear Servidor
      </Button>

      {showForm && (
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Crear Nuevo Servidor
            </Typography>

            <TextField
              fullWidth
              margin="normal"
              label="Nombre del Servidor"
              value={formData.nombreServidor}
              onChange={e =>
                setFormData({ ...formData, nombreServidor: e.target.value })
              }
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Software</InputLabel>
              <Select
                value={formData.software}
                onChange={e =>
                  setFormData({ ...formData, software: e.target.value })
                }
              >
                {['Java', 'Forge', 'Fabric', 'Spigot', 'Bukkit'].map(s => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Versión</InputLabel>
              <Select
                value={formData.version}
                onChange={e =>
                  setFormData({ ...formData, version: e.target.value })
                }
              >
                {[
                  '1.20.6',
                  '1.20.5',
                  '1.20.4',
                  '1.18.2',
                  '1.12.2',
                  '1.8.9',
                ].map(v => (
                  <MenuItem key={v} value={v}>
                    {v}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box
              mt={2}
              onClick={toggleOpcionesAvanzadas}
              sx={{ cursor: 'pointer', color: 'primary.main' }}
            >
              Opciones avanzadas <Settings fontSize="small" />
            </Box>

            {showAdvanced && (
              <Box mt={2}>
                <Typography variant="h6" gutterBottom>
                  server.properties
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Máximo de Jugadores"
                      type="number"
                      value={formData.maxPlayers}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          maxPlayers: parseInt(e.target.value, 10),
                        })
                      }
                    />
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Dificultad</InputLabel>
                      <Select
                        value={formData.difficulty}
                        onChange={e =>
                          setFormData({ ...formData, difficulty: e.target.value })
                        }
                      >
                        {['NORMAL', 'HARD', 'EASY', 'PEACEFUL'].map(d => (
                          <MenuItem key={d} value={d}>
                            {d.toLowerCase()}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                      <InputLabel>Gamemode</InputLabel>
                      <Select
                        value={formData.mode}
                        onChange={e =>
                          setFormData({ ...formData, mode: e.target.value })
                        }
                      >
                        {[
                          'SURVIVAL',
                          'CREATIVE',
                          'ADVENTURE',
                          'SPECTATOR',
                        ].map(m => (
                          <MenuItem key={m} value={m}>
                            {m.toLowerCase()}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Altura Máxima de Construcción"
                      type="number"
                      value={formData.maxBuildHeight}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          maxBuildHeight: parseInt(e.target.value, 10),
                        })
                      }
                    />
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Distancia de Visualización"
                      type="number"
                      value={formData.viewDistance}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          viewDistance: parseInt(e.target.value, 10),
                        })
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={6}>
                    {[
                      ['Generar NPCs', 'spawnNpcs'],
                      ['Permitir Nether', 'allowNether'],
                      ['Generar animales', 'spawnAnimals'],
                      ['Generar monstruos', 'spawnMonsters'],
                      ['Permitir PvP', 'pvp'],
                      ['Habilitar bloques de comandos', 'enableCommandBlock'],
                      ['Permitir vuelo', 'allowFlight'],
                    ].map(([label, field]) => (
                      <FormControlLabel
                        key={field}
                        control={
                          <Switch
                            checked={formData[field]}
                            onChange={e =>
                              setFormData({ ...formData, [field]: e.target.checked })
                            }
                          />
                        }
                        label={label}
                      />
                    ))}
                  </Grid>
                </Grid>
              </Box>
            )}

            <Box mt={3} display="flex" gap={2}>
              <Button variant="contained" color="primary" onClick={handleSaveServer}>
                Guardar Servidor
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<Cancel />}
                onClick={() => setShowForm(false)}
              >
                Cerrar
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      <Box mt={5}>
        <Typography variant="h4" gutterBottom>
          Lista de Servidores
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {servers.map(server => (
              <Grid item xs={12} sm={6} md={4} key={server.id}>
                <Card sx={{ display: 'flex', flexDirection: 'column', p: 2 }}>
                  <CardContent>
                    <Typography variant="h6">{server.name}</Typography>
                    <Typography variant="body2">
                      Software: {server.software}
                    </Typography>
                    <Typography variant="body2">
                      Versión: {server.version}
                    </Typography>
                    <Typography variant="body2">
                      Estado: {server.status}
                    </Typography>
                    <Typography variant="body2">
                      ip: {server.ip_address}
                    </Typography>
                    <Typography variant="body2">
                      puerto: {server.port}
                    </Typography>
                  </CardContent>

                  <Box display="flex" justifyContent="center" mt={2} gap={1}>
                    <Button variant="outlined" onClick={() => toggleExpanded(server.id)}>
                      Ver
                    </Button>
                  </Box>

                  {expandedServer === server.id && (
                    <Box display="flex" justifyContent="center" mt={2} gap={1}>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleStartServer(server.id)}
                      >
                        Iniciar
                      </Button>
                      <Button variant="contained" color="primary">
                        Terminal
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDelete(server.id)}
                      >
                        Eliminar
                      </Button>
                    </Box>
                  )}
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default Servers;
