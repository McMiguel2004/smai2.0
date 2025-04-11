import React from 'react';
import { Link } from 'react-router-dom';
import { FaServer, FaUser, FaShoppingCart, FaThumbsUp, FaTv, FaHandPointer, FaGamepad, FaCubes } from 'react-icons/fa';
import "../../styles/Home.css";

const ServerTable = () => {
  return (
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
  );
};

export default ServerTable;
