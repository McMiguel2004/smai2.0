import React, { useState } from 'react';
import "../styles/Home.css";
import { Link } from 'react-router-dom';

import { FaSun, FaMoon, FaServer, FaUser,FaShoppingCart, FaHandPointer, FaGamepad, FaCubes, FaTv, FaThumbsUp
} from 'react-icons/fa';

const Home = () => {
  const [isNightMode, setIsNightMode] = useState(false);

  const toggleTheme = () => {
    setIsNightMode(!isNightMode);
  };

  // Función para obtener la ruta de la imagen según el modo
  const getImagePath = (imageName) => {
    return `/assets/images/home/${isNightMode ? 'night' : 'day'}/${imageName}`;
  };

  // Función para obtener la ruta de los pétalos según el modo
  const getCherryBlossomPath = (type) => {
    return `/assets/images/home/${isNightMode ? 'night' : 'day'}/cherryBlossomPetals_${type}.png`;
  };

  return (
    <div className="home-container">
      {/* Sección parallax con fondo negro */}
      <section className="parallax-section black">
        <div 
          id="MC_Hero_ParallaxC_0" 
          className={`MC_Hero_ParallaxC ${isNightMode ? 'MC_Hero_ParallaxC__night' : 'MC_Hero_ParallaxC__day'}`} 
          data-mc-component-pubsub='{"component":"Hero_ParallaxC","id":0}' 
          data-mc-status="mounted" 
          style={{ transform: 'translateY(0px)' }}
        >
          {/* Botón para cambiar el tema */}
          <button 
            onClick={toggleTheme}
            className="theme-toggle-button"
            aria-label={isNightMode ? "Cambiar a modo día" : "Cambiar a modo noche"}
          >
            {isNightMode ? <FaSun /> : <FaMoon />}
          </button>

          <div className="MC_Hero_ParallaxC_Layers">
            {/* Capa del cielo */}
            <div className="MC_Hero_ParallaxC_Layers_sky">
              <div className="MC_Hero_ParallaxC_Layers_sky_background" style={{ transform: 'translateY(0vw)' }}>
                <img 
                  role="presentation" 
                  className="MC_Hero_ParallaxC_img" 
                  src={getImagePath(isNightMode ? 'Sky_Night.png' : 'Sky_Sun.png')} 
                  alt={isNightMode ? "Fondo de cielo nocturno" : "Fondo de cielo diurno"}
                />
              </div>
              <div className="MC_Hero_ParallaxC_Layers_sky_details" style={{ transform: 'translateY(0vw)' }}>
                <img 
                  role="presentation" 
                  className="MC_Hero_ParallaxC_img" 
                  src={getImagePath(isNightMode ? 'Clouds_Night.png' : 'Clouds.png')} 
                  alt={isNightMode ? "Nubes de noche" : "Nubes de día"}
                />
              </div>
            </div>
            
            {/* Capa de fondo */}
            <div className="MC_Hero_ParallaxC_Layers_background">
              <div className="MC_Hero_ParallaxC_Layers_background_main" style={{ transform: 'translateY(0vw)' }}>
                <img 
                  role="presentation" 
                  className="MC_Hero_ParallaxC_img" 
                  src={getImagePath(isNightMode ? 'BG_Near_Night.png' : 'BG_Near.png')} 
                  alt={isNightMode ? "Fondo cercano de noche" : "Fondo cercano de día"}
                />
              </div>
            </div>
            
            {/* Capa de enfoque */}
            <div className="MC_Hero_ParallaxC_Layers_focus">
              <div className="MC_Hero_ParallaxC_Layers_focus_main" style={{ transform: 'translateY(0vw)' }}>
                <img 
                  role="presentation" 
                  className="MC_Hero_ParallaxC_img" 
                  src={getImagePath(isNightMode ? 'Focus_Cherry_Night.png' : 'Focus_Cherry.png')} 
                  alt={isNightMode ? "Enfoque de cerezo de noche" : "Enfoque de cerezo de día"}
                />
                {/* Grupo de animaciones */}
                <div className="MC_Animations_group MC_Animations_group_0" id="MC_Hero_ParallaxC_0_Animations_group_0">
                  <div 
                    className={`MC_Animations_Layer MC_Animations_Waterfall ${isNightMode ? 'MC_Animations_night' : 'MC_Animations_day'} MC_Animations__play`} 
                    style={{
                      '--bg-asset': `url(${getImagePath('waterfall.png')})`,
                      '--animation-delay': '0s',
                      animationDuration: '0ms'
                    }} 
                    id="MC_Hero_ParallaxC_0_Animations_group_0_layer_6"
                  ></div>
                  
                  <div 
                    className={`MC_Animations_Layer MC_Animations_CherryBlossomPetals_3 MC_Animations_CherryBlossomPetals MC_Animations_CherryBlossomPetals__back ${isNightMode ? 'MC_Animations_night' : 'MC_Animations_day'} MC_Animations__play`} 
                    style={{
                      '--bg-asset': `url(${getCherryBlossomPath('back')})`,
                      '--animation-delay': '0s',
                      animationDuration: '0ms'
                    }} 
                    id="MC_Hero_ParallaxC_0_Animations_group_0_layer_4"
                  ></div>
                  
                  <div 
                    className={`MC_Animations_Layer MC_Animations_CherryBlossomPetals_2 MC_Animations_CherryBlossomPetals MC_Animations_CherryBlossomPetals__front ${isNightMode ? 'MC_Animations_night' : 'MC_Animations_day'} MC_Animations__play`} 
                    style={{
                      '--bg-asset': `url(${getCherryBlossomPath('front')})`,
                      '--animation-delay': '-3s',
                      animationDuration: '0ms'
                    }} 
                    id="MC_Hero_ParallaxC_0_Animations_group_0_layer_3"
                  ></div>
                  
                  <div 
                    className={`MC_Animations_Layer MC_Animations_CherryBlossomPetals_1 MC_Animations_CherryBlossomPetals MC_Animations_CherryBlossomPetals__front ${isNightMode ? 'MC_Animations_night' : 'MC_Animations_day'} MC_Animations__play`} 
                    style={{
                      '--bg-asset': `url(${getCherryBlossomPath('front')})`,
                      '--animation-delay': '0s',
                      animationDuration: '0ms'
                    }} 
                    id="MC_Hero_ParallaxC_0_Animations_group_0_layer_2"
                  ></div>
                </div>
              </div>
            </div>
            
            {/* Capa de primer plano */}
            <div className="MC_Hero_ParallaxC_Layers_foreground">
              <div className="MC_Hero_ParallaxC_Layers_foreground_main" style={{ transform: 'translateY(0vw)' }}>
                <img 
                  role="presentation" 
                  className="MC_Hero_ParallaxC_img" 
                  src={getImagePath(isNightMode ? 'Foreground_Night.png' : 'Foreground.png')} 
                  alt={isNightMode ? "Primer plano de noche" : "Primer plano de día"}
                />
              </div>
            </div>
          </div>
          
          <div className="MC_Hero_ParallaxC_DigDeeper" id="MC_Hero_ParallaxC_0_DigDeeper" tabIndex="-1"></div>
        </div>
      </section>

      {/* Sección de contenido blanca */}
      <section className="content-section white">
        <div className="content-wrapper">
        <h1 className="minecraft-font">
          Servidores de Minecraft.<br />
          Automatizados. Increíbles.
        </h1>
        <p class="margen-doble"></p>

          <table className="tabla">
            <tbody>
              <tr className="fila">
                <td className="icon"><FaServer size={40} /></td>
                <td className="texto izquierda">
                  <h2 className="bckw">Tu servidor de Minecraft personal</h2>
                  <p>Tenemos una base de datos segura para mantener seguro sus datos</p>
                  <button>
                    <Link to="/servers"><FaUser /> Consigue el tuyo ahora</Link>
                  </button>
                </td>
              </tr>
              <tr className="fila">
                <td className="texto derecha">
                  <h2 className="bckw">Gratis</h2>
                  <p>Nuestro servicio es gratis, y siempre lo será para todos. No hay posibilidad de que pagues por nada.</p>
                  <button>
                    <Link to="/servers"><FaShoppingCart /> No pagar nada ahora</Link>
                  </button>
                </td>
                <td className="icon"><FaThumbsUp size={40} /></td>
              </tr>
              <tr className="fila">
                <td className="icon"><FaTv size={40} /></td>
                <td className="texto izquierda">
                  <h2 className="bckw">Fácil de usar</h2>
                  <p>Fácil de usar. No sabemos por qué sería complicado tener un servidor en Minecraft, si en Smai es tan fácil como pulsar un botón.</p>
                  <button>
                    <Link to="/servers"><FaHandPointer /> Presione un botón ahora</Link>
                  </button>
                </td>
              </tr>
              <tr className="fila">
                <td className="texto derecha">
                  <h2 className="bckw">Hecho para ser jugado</h2>
                  <p>Le ofrecemos servidores, donde puede jugar y divertirse. Mucha diversión. Sin restricciones innecesarias para robar tiempo y dinero.</p>
                  <button>
                    <Link to="/servers"><FaGamepad /> Jugar ahora</Link>
                  </button>
                </td>
                <td className="icon"><FaCubes size={40} /></td>
              </tr>
            </tbody>
          </table>

        </div>
      </section>

      {/* Sección de contenido negra */}
      <section className="content-section black">
      <tbody>
                <tr class="fila">
                    <td>
                        <i class="fas fa-cogs icon2"></i>
                         {/*<img src="/Img/eng.png" alt="Descripción de la imagen 1">*/}
                        <h2 class="titulo">Completamente personalizable</h2>
                        <p class="texto">Ajuste todo en su servidor de su manera preferida.</p>
                    </td>
                    <td>
                        <i class="fas fa-puzzle-piece icon2"></i>
                       {/*  <img src="/Img/puz.png" alt="Descripción de la imagen 2"> */}
                        <h2 class="titulo">Mods y plugins</h2>
                        <p class="texto">¿Vanilla te aburre mucho? Añade plugins, juega con tus mods favoritos o usa uno de muchos paquetes de mods preconfigurados para tu propia experiencia.</p>
                    </td>
                    <td>
                        <i class="fas fa-shield-alt icon2"></i>
                        {/* <img src="/Img/escudo.png" alt="Descripción de la imagen 3"> */}
                        <h2 class="titulo">Protegido contra DDOS</h2>
                        <p class="texto">Tu servidor de Minecraft está completamente protegido de forma gratuita para mantenerse a salvo de los ataques DDOS.</p>
                    </td>
                </tr>
                <p class="margen-doble"></p>
                <tr class="fila">
                    <td>
                        <i class="fas fa-database icon2"></i>
                       {/* <img src="/Img/dtb.png" alt="Descripción de la imagen 4"> */}
                        <h2 class="titulo">Copias de seguridad automáticas</h2>
                        <p class="texto">Podemos guardar un respaldo de tu servidor en tu Google Drive, en caso de que lo necesites.</p>
                    </td>
                    <td>
                        <i class="fas fa-globe-americas icon2"></i>
                       {/*  <img src="/Img/mundo.png" alt="Descripción de la imagen 5"> */}
                        <h2 class="titulo">Mundos personalizados</h2>
                        <p class="texto">Mapas de aventura, parkour o el último minijuego. Usted puede cargar cualquier mundo que desea usar.</p>
                    </td>
                    <td>
                        <i class="far fa-life-ring icon2"></i>
                        {/* <img src="/Img/soporte.png" alt="Descripción de la imagen 6"> */}
                        <h2 class="titulo">Excelente Soporte</h2>
                        <p class="texto">Si usted necesita ayuda, estamos aquí para ayudar.</p>
                    </td>
                </tr>
            </tbody>
      </section>

      {/* Otra sección de contenido blanca */}
      <section className="content-section white">
        <div className="content-wrapper">
          <h1>Otra Sección Blanca</h1>
          <p>Continúa agregando más contenido aquí. Esta estructura te permite alternar secciones para lograr un diseño similar al de la página de Minecraft.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
