import React from 'react';
import { Box, Typography, List, ListItem, Divider, Paper } from '@mui/material';
import { Code } from '@mui/icons-material';
import "../styles/Wireguard.css";


const Wireguard = () => {
 



  return (
    <Box sx={{ p: 3 }} className="wireguard-container">
      <Paper elevation={3} sx={{ p: 4 }}>
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
          Una <a href="https://en.wikipedia.org/wiki/Virtual_private_network">VPN</a> (Virtual Private Network o red privada virtual) recrea mediante software y cifrado una red que no existe a nivel físico pero que permite comunicar de manera segura a los equipos que participan en esta red.
        </Typography>

        <Box sx={{ textAlign: 'center', my: 4 }}>
          <img 
            src="https://elpuig.xeill.net/Members/vcarceler/articulos/introduccion-a-wireguard/1280px-vpn_overview-en-svg.png/@@images/2d6a706b-3787-450c-b03a-e51df2c12422.png" 
            alt="Esquema de una VPN" 
            style={{ maxWidth: '100%', height: 'auto' }}
          />
          <Typography variant="caption" display="block">Fuente Wikipedia: Esquema de una VPN.</Typography>
        </Box>

        <Typography paragraph>
          El tráfico de la VPN acaba transmitiéndose por los adaptadores de red y la infraestructura física que comunica los equipos, pero antes de transmitir este tráfico se cifra y se encapsula en paquetes que lo transportan hasta su destino. En el destino, cuando se reciben los datos, se descifran y se recomponen los paquetes virtuales transmitidos por la VPN.
        </Typography>

        <Typography paragraph>
          Así en el esquema se aprecia que los dos ordenadores ya están conectados a la red física (de color negro) pero al ejecutar una VPN parece que, además de la interfaz física, los ordenadores tienen otra interfaz de red con un enlace privado (de color rojo) para ellos.
        </Typography>

        <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 4 }}>
          Características de WireGuard
        </Typography>

        <Typography paragraph>
          <a href="https://www.wireguard.com/">WireGuard</a> es una herramienta libre y moderna para implementar VPNs. La herramienta clásica de GNU/Linux para implementar VPNs ha sido <a href="https://openvpn.net/">OpenVPN</a>, una herramienta modular y muy completa. WireGuard no aspira a substituir a OpenVPN en todos sus modos de funcionamiento, aspira a facilitar la creación de VPNs con buena seguridad y rendimiento.
        </Typography>

        <Typography paragraph>
          Al utilizar WireGuard:
        </Typography>

        <List>
          <ListItem>• Se utiliza UDP como transporte.</ListItem>
          <ListItem>• Un equipo WireGuard que acepte conexiones debe tener abierto un puerto UDP y una IP conocida.</ListItem>
          <ListItem>• Se utiliza <a href="https://es.wikipedia.org/wiki/Criptograf%C3%ADa_asim%C3%A9trica">criptografía de clave pública</a>. Cada equipo tendrá dos claves: la privada y la pública.</ListItem>
          <ListItem>• El equipo cliente que conecte con el servidor no necesita tener ninguna IP pública ni ningún puerto abierto.</ListItem>
          <ListItem>• WireGuard no se encarga de asignar direcciones en la VPN, ni repartir las claves, ni de ninguna otra tarea que no sea mantener el túnel.</ListItem>
        </List>

        <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 4 }}>
          Instalación
        </Typography>

        <Typography paragraph>
          WireGuard está disponible en los repositorios de las principales distribuciones de GNU/Linux y también se puede <a href="https://www.wireguard.com/install/">instalar en otros sistemas operativos</a>.
        </Typography>

        <Typography paragraph>
          La instalación en Ubuntu se puede realizar con un comando:
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
          Una vez instalado se podrá utilizar la herramienta <code>wg</code>.
        </Typography>

        <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 4 }}>
          Configuración de una VPN entre dos equipos
        </Typography>

        <Typography paragraph>
          La configuración más básica consta de dos equipos: uno que actúa como <code>servidor</code> (y tiene una IP y un puerto UDP abierto) y otro que actúa como <code>cliente</code>.
        </Typography>

        <Typography variant="h5" component="h3" gutterBottom>
          Creación de un par de claves en cada equipo
        </Typography>

        <Typography paragraph>
          Cada equipo en la VPN utilizará dos claves: pública y privada.
          Estas claves se pueden generar con el siguiente comando:
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
          Después de ejecutar el comando se habrán creado los ficheros:
        </Typography>

        <List>
          <ListItem>• <code>privatekey</code> con la clave privada.</ListItem>
          <ListItem>• <code>publickey</code> con la clave pública.</ListItem>
        </List>

        <Typography variant="h5" component="h3" gutterBottom>
          Configuración en el servidor
        </Typography>

        <Typography paragraph>
          Una vez instalado <code>wireguard</code> se podrá acceder al directorio <code>/etc/wireguard</code> para crear en su interior el par de claves.
        </Typography>

        <Typography paragraph>
          Después se podrá editar el fichero <code>/etc/wireguard/wg0.conf</code>:
        </Typography>

        <Paper elevation={2} sx={{ p: 2, backgroundColor: '#f5f5f5', mb: 3 }}>
          <Typography variant="body1" fontFamily="monospace" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
            {`[Interface]
# IP que tendrá la interfaz wg0
Address = 192.168.6.1/24

# Puerto en el que escuchará el servidor
ListenPort = 41194

# Clave privada del servidor
PrivateKey = hshshsh...

[Peer]
# Clave pública del cliente.
PublicKey = adfadf...

# IP exacta (/32) del cliente en la VPN 
AllowedIPs = 192.168.6.2/32`}
          </Typography>
        </Paper>

        <Typography paragraph>
          Después se podrá activar el servicio:
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
          Y encenderlo:
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
          Editar el fichero <code>/etc/wireguard/wg0.conf</code>:
        </Typography>

        <Paper elevation={2} sx={{ p: 2, backgroundColor: '#f5f5f5', mb: 3 }}>
          <Typography variant="body1" fontFamily="monospace" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
            {`[Interface]
# Clave privada del cliente
PrivateKey = ZzZz...
 
# IP para el cliente en la VPN
Address = 192.168.6.2/24
 
[Peer]
# Clave pública del servidor
PublicKey = XxXxX... 
# Tráfico que se aceptará (toda la red /24)
AllowedIPs = 192.168.6.0/24
 
# IP y puerto UDP en el que escucha el servidor
Endpoint = 125.239.76.212:41194
 

# Si no hay tráfico transmitir un paquete cada 30 segundos
PersistentKeepalive = 30`}
          </Typography>
        </Paper>

        <Typography paragraph>
          Después se podrá activar y encender el servicio como en el servidor.
        </Typography>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h5" component="h3" gutterBottom>
          Más información:
        </Typography>

        <List>
          <ListItem>• <a href="https://www.wireguard.com/">WireGuard</a></ListItem>
        </List>

        
        

        
      </Paper>
    </Box>
  );
};

export default Wireguard;