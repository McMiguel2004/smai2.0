import React, { useEffect, useRef } from 'react';
import "../styles/Skins.css";

const Skins = () => {
  const scriptsLoaded = useRef(false);

  useEffect(() => {
    // Evitar cargar los scripts múltiples veces
    if (scriptsLoaded.current) return;
    scriptsLoaded.current = true;

    // Función para cargar scripts
    const loadScript = (src, id) => {
      return new Promise((resolve, reject) => {
        if (document.getElementById(id)) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.id = id;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };

    // Cargar scripts en orden
    const loadAllScripts = async () => {
      try {
        await loadScript('/js/three.min.js', 'three-js');
        await loadScript('/js/2dskin.js', '2dskin-js');
        await loadScript('/js/3dskin.js', '3dskin-js');

        // Tu código original
        async function getUUID(playerName) {
          try {
            const response = await fetch(`https://api.ashcon.app/mojang/v2/user/${playerName}`);
            const data = await response.json();

            if (data.error) {
              console.error('Error al obtener los datos del jugador:', data.error);
              return null;
            }
            return data.uuid;
          } catch (error) {
            console.error('Error en la solicitud:', error);
            return null;
          }
        }

        // Asegurarse de que los elementos existen
        const usernameInput = document.getElementById('username');
        if (usernameInput) {
          usernameInput.onkeypress = async function (e) {
            if (!e) e = window.event;
            const keyCode = e.keyCode || e.which;
            if (keyCode === 13) {
              const playerName = usernameInput.value;
              const uuid = await getUUID(playerName);
              if (window.img) { // Verificar que img existe
                window.img.src = `https://crafatar.com/skins/${uuid}`;
              }
            }
          };
        }
      } catch (error) {
        console.error('Error loading scripts:', error);
      }
    };

    loadAllScripts();

    // Limpieza más agresiva al desmontar
    return () => {
      ['canvas', 'model'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
          element.innerHTML = '';
        }
      });

      // Reiniciar Three.js si es necesario
      if (window.skinViewer) {
        window.skinViewer.dispose();
        delete window.skinViewer;
      }
    };
  }, []);

  return (
    <div>
      <div className="skins-container">
        <canvas id="canvas" width="64" height="64"></canvas>
        <div id="sidebar">
          <strong>Username</strong>
          <input id="username" type="text" placeholder="Nombre del jugador" />

          <strong>Toggle Visibility - Body Parts</strong>
          <label><input id="headToggle" type="checkbox" defaultChecked />Head</label>
          <label><input id="bodyToggle" type="checkbox" defaultChecked />Body</label>
          <label><input id="leftArmToggle" type="checkbox" defaultChecked />Left Arm</label>
          <label><input id="rightArmToggle" type="checkbox" defaultChecked />Right Arm</label>
          <label><input id="leftLegToggle" type="checkbox" defaultChecked />Left Leg</label>
          <label><input id="rightLegToggle" type="checkbox" defaultChecked />Right Leg</label>

          <strong>Toggle Visibility - Secondary Layer</strong>
          <label><input id="head2Toggle" type="checkbox" defaultChecked />Head</label>
          <label><input id="body2Toggle" type="checkbox" defaultChecked />Body</label>
          <label><input id="leftArm2Toggle" type="checkbox" defaultChecked />Left Arm</label>
          <label><input id="rightArm2Toggle" type="checkbox" defaultChecked />Right Arm</label>
          <label><input id="leftLeg2Toggle" type="checkbox" defaultChecked />Left Leg</label>
          <label><input id="rightLeg2Toggle" type="checkbox" defaultChecked />Right Leg</label>
        </div>
        <div id="model"></div>
        <div id="info">
          Skins downloaded from <a href="https://crafatar.com/" target="_blank" rel="noopener noreferrer">Crafatar</a>
        </div>
      </div>
    </div>
  );
};

export default Skins;