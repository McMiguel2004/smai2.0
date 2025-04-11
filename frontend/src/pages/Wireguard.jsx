// Archivo: /public/src/pages/wireguard.jsx
import React, { useState } from 'react';
import { Box, Typography, List, ListItem, Divider, Paper } from '@mui/material';
import { Code } from '@mui/icons-material';
import "../styles/Wireguard.css";

const Wireguard = () => {
  // Estado para seleccionar el tutorial (Ubuntu o Windows)
  const [selectedTutorial, setSelectedTutorial] = useState("ubuntu");

  // Contenido del tutorial para Ubuntu
  const ubuntuTutorial = (
    <div className="tutorial">
      <Typography variant="h5" gutterBottom>
        Instalación de WireGuard en Ubuntu
      </Typography>
      <ol className="space-y-4">
        <li>
          <Typography variant="subtitle1" className="font-semibold">1. Actualizar el sistema</Typography>
          <Typography variant="body2" className="text-sm">
            Antes de instalar, actualiza la lista de paquetes y los paquetes existentes:
          </Typography>
          <pre className="bg-gray-200 p-2 rounded" style={{ marginTop: '8px' }}>
            sudo apt update && sudo apt upgrade -y
          </pre>
        </li>
        <li>
          <Typography variant="subtitle1" className="font-semibold">2. Instalar WireGuard</Typography>
          <Typography variant="body2" className="text-sm">
            Instala el paquete de WireGuard con:
          </Typography>
          <pre className="bg-gray-200 p-2 rounded" style={{ marginTop: '8px' }}>
            sudo apt install wireguard -y
          </pre>
        </li>
        <li>
          <Typography variant="subtitle1" className="font-semibold">3. Descargar la configuración</Typography>
          <Typography variant="body2" className="text-sm">
            Descarga el archivo de configuración proporcionado:
          </Typography>
          <img 
            src="/assets/images/wireguard/windows/Vpn.png" 
            alt="Instalador Wireguard" 
            className="mt-2" 
            style={{ width: '100%', maxWidth: '400px', height: 'auto' }} 
          />
        </li>
        <li>
          <Typography variant="subtitle1" className="font-semibold">4. Mover y proteger el archivo de configuración</Typography>
          <Typography variant="body2" className="text-sm">
            Mueve el archivo de configuración a la ubicación correcta y cambia sus permisos:
          </Typography>
          <pre className="bg-gray-200 p-2 rounded" style={{ marginTop: '8px' }}>
            sudo mv wireguard.conf /etc/wireguard/wg0.conf{'\n'}sudo chmod 600 /etc/wireguard/wg0.conf
          </pre>
        </li>
        <li>
          <Typography variant="subtitle1" className="font-semibold">5. Activar WireGuard</Typography>
          <Typography variant="body2" className="text-sm">
            Inicia WireGuard con la configuración descargada:
          </Typography>
          <pre className="bg-gray-200 p-2 rounded" style={{ marginTop: '8px' }}>
            sudo wg-quick up wg0
          </pre>
        </li>
        <li>
          <Typography variant="subtitle1" className="font-semibold">6. Verificar la conexión</Typography>
          <Typography variant="body2" className="text-sm">
            Asegúrate de que la VPN está funcionando correctamente:
          </Typography>
          <pre className="bg-gray-200 p-2 rounded" style={{ marginTop: '8px' }}>
            sudo wg
          </pre>
        </li>
        <li>
          <Typography variant="subtitle1" className="font-semibold">7. Habilitar la VPN al iniciar el sistema (opcional)</Typography>
          <Typography variant="body2" className="text-sm">
            Si deseas que WireGuard se inicie automáticamente en cada arranque:
          </Typography>
          <pre className="bg-gray-200 p-2 rounded" style={{ marginTop: '8px' }}>
            sudo systemctl enable wg-quick@wg0
          </pre>
        </li>
      </ol>
    </div>
  );

  // Contenido del tutorial para Windows
  const windowsTutorial = (
    <div className="tutorial">
      <Typography variant="h5" gutterBottom>
        Tutorial para Windows
      </Typography>
      <ol className="space-y-4">
        <li>
          <Typography variant="subtitle1" className="font-semibold">1. Descarga el instalador</Typography>
          <Typography variant="body2" className="text-sm">
            Descarga el instalador desde el sitio oficial:
            <br />
            <a href="https://www.wireguard.com/install/" className="text-blue-500">Instalar Wireguard</a>
          </Typography>
          <img 
            src="/assets/images/wireguard/windows/Intallation.png" 
            alt="Instalador Wireguard" 
            className="mt-2" 
            style={{ width: '100%', maxWidth: '400px', height: 'auto' }}
          />
        </li>
        <li>
          <Typography variant="subtitle1" className="font-semibold">2. Ejecuta el instalador</Typography>
          <Typography variant="body2" className="text-sm">
            Ejecuta el archivo descargado y sigue los pasos del instalador.
          </Typography>
        </li>
        <li>
          <Typography variant="subtitle1" className="font-semibold">3. Descargar la configuración</Typography>
          <Typography variant="body2" className="text-sm">
            En la esquina superior derecha de la página encontrarás la opción de VPN para descargar el archivo de configuración.
          </Typography>
          <img 
            src="/assets/images/wireguard/windows/Vpn.png" 
            alt="Instalador Wireguard" 
            className="mt-2" 
            style={{ width: '100%', maxWidth: '400px', height: 'auto' }}
          />
        </li>
        <li>
          <Typography variant="subtitle1" className="font-semibold">4. Importe la configuración</Typography>
          <Typography variant="body2" className="text-sm">
            Abre WireGuard y presiona el botón de importar para adjuntar el archivo descargado.
          </Typography>
          <img 
            src="/assets/images/wireguard/windows/Wireguard.png" 
            alt="Importar configuración" 
            className="mt-2" 
            style={{ width: '100%', maxWidth: '400px', height: 'auto' }}
          />
        </li>
        <li>
          <Typography variant="subtitle1" className="font-semibold">5. Inicie la conexión</Typography>
          <Typography variant="body2" className="text-sm">
            Presiona el botón "Activar" para iniciar la conexión.
          </Typography>
          <img 
            src="/assets/images/wireguard/windows/Activar.png" 
            alt="Conexión activa" 
            className="mt-2" 
            style={{ width: '100%', maxWidth: '400px', height: 'auto' }}
          />
        </li>
        <li>
          <Typography variant="subtitle1" className="font-semibold">6. Configuración del Firewall</Typography>
          <Typography variant="body2" className="text-sm">
            Si el Firewall de Windows bloquea la conexión, abre "Firewall y protección de red" y sigue con "Configuración Avanzada". Luego, configura una nueva regla.
          </Typography>
          <img 
            src="/assets/images/wireguard/windows/Windows.png" 
            alt="Configuración del Firewall" 
            className="mt-2" 
            style={{ width: '100%', maxWidth: '400px', height: 'auto' }}
          />
          <img 
            src="/assets/images/wireguard/windows/Avanzada.png" 
            alt="Configuración Avanzada del Firewall" 
            className="mt-2" 
            style={{ width: '100%', maxWidth: '400px', height: 'auto' }}
          />
          <img 
            src="/assets/images/wireguard/windows/Entrada.png" 
            alt="Reglas de entrada" 
            className="mt-2" 
            style={{ width: '100%', maxWidth: '400px', height: 'auto' }}
          />
          <img 
            src="/assets/images/wireguard/windows/Regla.png" 
            alt="Nueva Regla" 
            className="mt-2" 
            style={{ width: '100%', maxWidth: '400px', height: 'auto' }}
          />
          <Typography variant="subtitle1" className="font-semibold" style={{ marginTop: '8px' }}>
            7. Configuración de la regla
          </Typography>
          <Typography variant="body2" className="text-sm">
            Especifica los parámetros necesarios en el menú de configuración de la regla:
          </Typography>
          <img 
            src="/assets/images/wireguard/windows/Tipo.png" 
            alt="Tipo" 
            className="mt-2" 
            style={{ width: '100%', maxWidth: '400px', height: 'auto' }}
          />
          <img 
            src="/assets/images/wireguard/windows/Programa.png" 
            alt="Programa" 
            className="mt-2" 
            style={{ width: '100%', maxWidth: '400px', height: 'auto' }}
          />
          <img 
            src="/assets/images/wireguard/windows/Protocolo.png" 
            alt="Protocolo" 
            className="mt-2" 
            style={{ width: '100%', maxWidth: '400px', height: 'auto' }}
          />
          <img 
            src="/assets/images/wireguard/windows/Ambito.png" 
            alt="Ambito" 
            className="mt-2" 
            style={{ width: '100%', maxWidth: '400px', height: 'auto' }}
          />
          <img 
            src="/assets/images/wireguard/windows/Accion.png" 
            alt="Acción" 
            className="mt-2" 
            style={{ width: '100%', maxWidth: '400px', height: 'auto' }}
          />
          <img 
            src="/assets/images/wireguard/windows/Perfil.png" 
            alt="Perfil" 
            className="mt-2" 
            style={{ width: '100%', maxWidth: '400px', height: 'auto' }}
          />
          <img 
            src="/assets/images/wireguard/windows/Nombre.png" 
            alt="Nombre" 
            className="mt-2" 
            style={{ width: '100%', maxWidth: '400px', height: 'auto' }}
          />
          <img 
            src="/assets/images/wireguard/windows/Reglas.png" 
            alt="Reglas activas" 
            className="mt-2" 
            style={{ width: '100%', maxWidth: '400px', height: 'auto' }}
          />
          <Typography variant="body2" className="text-sm" style={{ marginTop: '8px' }}>
            Por último, verifica que la regla esté activa en la lista. Una vez finalizado, ya puedes disfrutar de jugar en LAN con tus amigos.
          </Typography>
        </li>
      </ol>
    </div>
  );

  // Retorno del componente unificando todo el contenido dentro de un único Paper
  return (
    <Box sx={{ p: 3 }} className="wireguard-container">
      <Paper elevation={3} sx={{ p: 4 }}>
        {/* Sección de Introducción y Configuración de WireGuard */}
        <Typography variant="h3" component="h1" gutterBottom>
          Introducción a WireGuard
        </Typography>
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <img 
            src="https://elpuig.xeill.net/Members/vcarceler/articulos/introduccion-a-wireguard/2000px-logo_of_wireguard-svg.png" 
            alt="WireGuard logo" 
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </Box>
        <Typography paragraph>
          Una <a href="https://en.wikipedia.org/wiki/Virtual_private_network" style={{ color: '#1976d2' }}>VPN</a> (Virtual Private Network o red privada virtual) recrea mediante software y cifrado una red que no existe a nivel físico pero que permite conectar de forma segura los equipos participantes.
        </Typography>
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <img 
            src="https://elpuig.xeill.net/Members/vcarceler/articulos/introduccion-a-wireguard/1280px-vpn_overview-en-svg.png/@@images/2d6a706b-3787-450c-b03a-e51df2c12422.png" 
            alt="Esquema de una VPN" 
            style={{ maxWidth: '100%', height: 'auto' }}
          />
          <Typography variant="caption" display="block">
            Fuente Wikipedia: Esquema de una VPN.
          </Typography>
        </Box>
        <Typography paragraph>
          El tráfico de la VPN se cifra y encapsula para transmitirse y, al llegar al destino, se descifra para recomponer la información. Así, aunque ambos equipos estén conectados a la red física, se establece un canal seguro y privado.
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 4 }}>
          Características de WireGuard
        </Typography>
        <Typography paragraph>
          <a href="https://www.wireguard.com/" style={{ color: '#1976d2' }}>WireGuard</a> es una herramienta moderna para implementar VPNs, que ofrece seguridad y rendimiento a través de:
        </Typography>
        <List>
          <ListItem>• Uso de UDP como transporte.</ListItem>
          <ListItem>• Servidor con puerto UDP abierto e IP conocida.</ListItem>
          <ListItem>• Criptografía de clave pública (cada equipo tiene clave privada y pública).</ListItem>
          <ListItem>• Cliente sin necesidad de IP pública ni puerto abierto.</ListItem>
          <ListItem>• Función exclusiva de mantener el túnel VPN.</ListItem>
        </List>
        <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 4 }}>
          Instalación
        </Typography>
        <Typography paragraph>
          WireGuard se encuentra en los repositorios de las principales distribuciones GNU/Linux y también se puede <a href="https://www.wireguard.com/install/" style={{ color: '#1976d2' }}>instalar en otros sistemas</a>.
        </Typography>
        <Typography paragraph>
          En Ubuntu, la instalación se realiza ejecutando:
        </Typography>
        <Paper elevation={2} sx={{ p: 2, backgroundColor: '#f5f5f5', mb: 3 }}>
          <Box display="flex" alignItems="center">
            <Code sx={{ mr: 1 }} />
            <Typography variant="body1" fontFamily="monospace">
              apt install wireguard-tools
            </Typography>
          </Box>
        </Paper>
        <Typography paragraph>
          Una vez instalado, se utiliza el comando <code>wg</code> para gestionar la VPN.
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 4 }}>
          Configuración de una VPN entre dos equipos
        </Typography>
        <Typography paragraph>
          La configuración mínima requiere dos equipos: uno actuando como <code>servidor</code> (con IP y puerto UDP abiertos) y otro como <code>cliente</code>.
        </Typography>
        <Typography variant="h5" component="h3" gutterBottom>
          Creación de un par de claves en cada equipo
        </Typography>
        <Typography paragraph>
          Cada equipo utiliza dos claves (pública y privada) que se generan así:
        </Typography>
        <Paper elevation={2} sx={{ p: 2, backgroundColor: '#f5f5f5', mb: 3 }}>
          <Box display="flex" alignItems="center">
            <Code sx={{ mr: 1 }} />
            <Typography variant="body1" fontFamily="monospace">
              umask 077; wg genkey | tee privatekey | wg pubkey &gt; publickey
            </Typography>
          </Box>
        </Paper>
        <Typography paragraph>
          Se crean dos archivos:
        </Typography>
        <List>
          <ListItem>• <code>privatekey</code> con la clave privada.</ListItem>
          <ListItem>• <code>publickey</code> con la clave pública.</ListItem>
        </List>
        <Typography variant="h5" component="h3" gutterBottom>
          Configuración en el servidor
        </Typography>
        <Typography paragraph>
          Una vez instalado, accede al directorio <code>/etc/wireguard</code> y genera las claves. Luego edita el archivo <code>/etc/wireguard/wg0.conf</code>:
        </Typography>
        <Paper elevation={2} sx={{ p: 2, backgroundColor: '#f5f5f5', mb: 3 }}>
          <Typography variant="body1" fontFamily="monospace" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
{`[Interface]
# IP de la interfaz wg0
Address = 192.168.6.1/24

# Puerto UDP de escucha
ListenPort = 41194

# Clave privada del servidor
PrivateKey = hshshsh...

[Peer]
# Clave pública del cliente
PublicKey = adfadf...

# IP exacta del cliente
AllowedIPs = 192.168.6.2/32`}
          </Typography>
        </Paper>
        <Typography paragraph>
          Activa el servicio:
        </Typography>
        <Paper elevation={2} sx={{ p: 2, backgroundColor: '#f5f5f5', mb: 3 }}>
          <Box display="flex" alignItems="center">
            <Code sx={{ mr: 1 }} />
            <Typography variant="body1" fontFamily="monospace">
              systemctl enable wg-quick@wg0
            </Typography>
          </Box>
        </Paper>
        <Typography paragraph>
          Y encéndelo:
        </Typography>
        <Paper elevation={2} sx={{ p: 2, backgroundColor: '#f5f5f5', mb: 3 }}>
          <Box display="flex" alignItems="center">
            <Code sx={{ mr: 1 }} />
            <Typography variant="body1" fontFamily="monospace">
              systemctl start wg-quick@wg0
            </Typography>
          </Box>
        </Paper>
        <Typography variant="h5" component="h3" gutterBottom>
          Configuración en el cliente
        </Typography>
        <Typography paragraph>
          Edita el archivo <code>/etc/wireguard/wg0.conf</code>:
        </Typography>
        <Paper elevation={2} sx={{ p: 2, backgroundColor: '#f5f5f5', mb: 3 }}>
          <Typography variant="body1" fontFamily="monospace" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
{`[Interface]
# Clave privada del cliente
PrivateKey = ZzZz...

# IP del cliente en la VPN
Address = 192.168.6.2/24

[Peer]
# Clave pública del servidor
PublicKey = XxXxX...
# Rango de IPs permitidas
AllowedIPs = 192.168.6.0/24

# IP y puerto UDP del servidor
Endpoint = 125.239.76.212:41194

# Mantener conexión (cada 30 segundos)
PersistentKeepalive = 30`}
          </Typography>
        </Paper>
        <Typography paragraph>
          Finalmente, activa el servicio en el cliente.
        </Typography>
        <Divider sx={{ my: 4 }} />
        <Typography variant="h5" component="h3" gutterBottom>
          Más información:
        </Typography>
        <List>
          <ListItem>• <a href="https://www.wireguard.com/" style={{ color: '#1976d2' }}>WireGuard</a></ListItem>
        </List>

        {/* Sección del Tutorial */}
        <Divider sx={{ my: 4 }} />
        <Typography variant="h4" component="h2" gutterBottom>
          Tutorial
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <button
            onClick={() => setSelectedTutorial("ubuntu")}
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: selectedTutorial === "ubuntu" ? '#1976d2' : '#e0e0e0',
              color: selectedTutorial === "ubuntu" ? '#fff' : '#000',
              cursor: 'pointer'
            }}
          >
            Ubuntu
          </button>
          <button
            onClick={() => setSelectedTutorial("windows")}
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: selectedTutorial === "windows" ? '#1976d2' : '#e0e0e0',
              color: selectedTutorial === "windows" ? '#fff' : '#000',
              cursor: 'pointer'
            }}
          >
            Windows
          </button>
        </Box>
        <Box sx={{ border: '1px solid #e0e0e0', p: 2, borderRadius: '4px', maxHeight: '500px', overflowY: 'auto' }}>
          {selectedTutorial === "ubuntu" ? ubuntuTutorial : windowsTutorial}
        </Box>
      </Paper>
    </Box>
  );
};

export default Wireguard;
