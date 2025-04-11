import React from 'react';
import "../../styles/Home.css";
import { FaSun, FaMoon } from 'react-icons/fa';

const HeroParallax = ({ isNightMode, toggleTheme }) => {
  // Funciones para obtener la ruta de las imágenes según el modo
  const getImagePath = (imageName) => `/assets/images/home/${isNightMode ? 'night' : 'day'}/${imageName}`;
  const getCherryBlossomPath = (type) => `/assets/images/home/${isNightMode ? 'night' : 'day'}/cherryBlossomPetals_${type}.png`;

  return (
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
            <div 
              className="MC_Hero_ParallaxC_Layers_sky_background" 
              style={{ transform: 'translateY(0vw)' }}
            >
              <img 
                role="presentation" 
                className="MC_Hero_ParallaxC_img" 
                src={getImagePath(isNightMode ? 'Sky_Night.png' : 'Sky_Sun.png')} 
                alt={isNightMode ? "Fondo de cielo nocturno" : "Fondo de cielo diurno"} 
              />
            </div>
            <div 
              className="MC_Hero_ParallaxC_Layers_sky_details" 
              style={{ transform: 'translateY(0vw)' }}
            >
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
            <div 
              className="MC_Hero_ParallaxC_Layers_background_main" 
              style={{ transform: 'translateY(0vw)' }}
            >
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
            <div 
              className="MC_Hero_ParallaxC_Layers_focus_main" 
              style={{ transform: 'translateY(0vw)' }}
            >
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
            <div 
              className="MC_Hero_ParallaxC_Layers_foreground_main" 
              style={{ transform: 'translateY(0vw)' }}
            >
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
  );
};

export default HeroParallax;
