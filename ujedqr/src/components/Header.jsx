import React from 'react';
import './Header.css'; // Importa el archivo CSS
import Logo from './LogoUJED.png'

function Header() {
  return (
    <header className="mobile-header">
      <div className="logo">
        <img src={Logo} alt="Logo del sitio" />
      </div>
      <nav>
        <ul>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
