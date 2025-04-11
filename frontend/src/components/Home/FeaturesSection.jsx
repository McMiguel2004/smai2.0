import React from 'react';
import "../../styles/Home.css";

const FeaturesSection = () => {
  return (
    <section className="content-section black">
      <table>
        <tbody>
          <tr className="fila">
            <td>
              <i className="fas fa-cogs icon2"></i>
              <h2 className="titulo">Completamente personalizable</h2>
              <p className="texto">Ajuste todo en su servidor de su manera preferida.</p>
            </td>
            <td>
              <i className="fas fa-puzzle-piece icon2"></i>
              <h2 className="titulo">Mods y plugins</h2>
              <p className="texto">
                ¿Vanilla te aburre mucho? Añade plugins, juega con tus mods favoritos o usa uno de muchos paquetes de mods preconfigurados para tu propia experiencia.
              </p>
            </td>
            <td>
              <i className="fas fa-shield-alt icon2"></i>
              <h2 className="titulo">Protegido contra DDOS</h2>
              <p className="texto">
                Tu servidor de Minecraft está completamente protegido de forma gratuita para mantenerse a salvo de los ataques DDOS.
              </p>
            </td>
          </tr>
          <tr className="fila">
            <td>
              <i className="fas fa-database icon2"></i>
              <h2 className="titulo">Copias de seguridad automáticas</h2>
              <p className="texto">
                Podemos guardar un respaldo de tu servidor en tu Google Drive, en caso de que lo necesites.
              </p>
            </td>
            <td>
              <i className="fas fa-globe-americas icon2"></i>
              <h2 className="titulo">Mundos personalizados</h2>
              <p className="texto">
                Mapas de aventura, parkour o el último minijuego. Usted puede cargar cualquier mundo que desea usar.
              </p>
            </td>
            <td>
              <i className="far fa-life-ring icon2"></i>
              <h2 className="titulo">Excelente Soporte</h2>
              <p className="texto">Si usted necesita ayuda, estamos aquí para ayudar.</p>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
};

export default FeaturesSection;
