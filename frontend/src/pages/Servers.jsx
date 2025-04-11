import React, { useState } from 'react';
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
  Paper,
  Switch,
  FormControlLabel,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
} from '@mui/material';
import {
  Add,
  Cancel,
  Close,
  Delete,
  Settings,
  UploadFile,
  Storage as ServerIcon,
} from '@mui/icons-material';

const Servers = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombreServidor: '',
    software: 'Java',
    version: '1.20.6',
    maxPlayers: 20,
    difficulty: 'normal',
    mode: 'survival',
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

  const toggleOpcionesAvanzadas = () => {
    setShowAdvanced(prev => !prev);
  };

  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <Container>
      <Typography variant="h3" gutterBottom>Servidores</Typography>

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
            <Typography variant="h5">Crear Nuevo Servidor</Typography>

            <TextField
              fullWidth
              margin="normal"
              label="Nombre del Servidor"
              value={formData.nombreServidor}
              onChange={(e) =>
                setFormData({ ...formData, nombreServidor: e.target.value })
              }
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Software</InputLabel>
              <Select
                value={formData.software}
                onChange={(e) =>
                  setFormData({ ...formData, software: e.target.value })
                }
              >
                {['Java', 'Forge', 'Fabric', 'Spigot', 'Bukkit'].map((s) => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Versión</InputLabel>
              <Select
                value={formData.version}
                onChange={(e) =>
                  setFormData({ ...formData, version: e.target.value })
                }
              >
                {[
                  '1.20.6',
                  '1.20.5',
                  '1.20.4',
                  '1.18.2',
                  '1.12.2',
                  '1.8.9'
                ].map((v) => (
                  <MenuItem key={v} value={v}>{v}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box mt={2} onClick={toggleOpcionesAvanzadas} sx={{ cursor: 'pointer', color: 'primary.main' }}>
              Opciones avanzadas <Settings fontSize="small" />
            </Box>

            {showAdvanced && (
              <Box mt={2}>
                <Typography variant="h6">server.properties</Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      label="Máximo de Jugadores"
                      type="number"
                      value={formData.maxPlayers}
                      onChange={(e) =>
                        setFormData({ ...formData, maxPlayers: parseInt(e.target.value) })
                      }
                      fullWidth
                    />
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Dificultad</InputLabel>
                      <Select
                        value={formData.difficulty}
                        onChange={(e) =>
                          setFormData({ ...formData, difficulty: e.target.value })
                        }
                      >
                        {['peaceful', 'easy', 'normal', 'hard'].map((d) => (
                          <MenuItem key={d} value={d}>{d}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Gamemode</InputLabel>
                      <Select
                        value={formData.mode}
                        onChange={(e) =>
                          setFormData({ ...formData, mode: e.target.value })
                        }
                      >
                        {['survival', 'creative', 'adventure', 'spectator'].map((m) => (
                          <MenuItem key={m} value={m}>{m}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      label="Altura Máxima de Construcción"
                      type="number"
                      value={formData.maxBuildHeight}
                      onChange={(e) =>
                        setFormData({ ...formData, maxBuildHeight: parseInt(e.target.value) })
                      }
                      fullWidth
                    />
                    <TextField
                      label="Distancia de Visualización"
                      type="number"
                      value={formData.viewDistance}
                      onChange={(e) =>
                        setFormData({ ...formData, viewDistance: parseInt(e.target.value) })
                      }
                      fullWidth
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
                            onChange={(e) =>
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

            <Box mt={3}>
              <Button variant="contained" color="primary" onClick={() => {}}>
                Guardar Servidor
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<Cancel />}
                sx={{ ml: 2 }}
                onClick={() => setShowForm(false)}
              >
                Cerrar
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Tabla de Servidores */}
      <Box mt={5}>
        <Typography variant="h4">Lista de Servidores</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre del Servidor</TableCell>
              <TableCell>Software</TableCell>
              <TableCell>Versión</TableCell>
              <TableCell>Dirección IP</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Aquí irán los datos dinámicos de servidores */}
          </TableBody>
        </Table>
      </Box>
    </Container>
  );
};

export default Servers;
