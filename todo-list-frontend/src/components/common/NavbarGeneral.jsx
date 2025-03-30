// todo-list-frontend/src/components/common/NavbarGeneral.jsx

import { useState } from "react";
import logo from "../../assets/images/Logotipo-nombre.png";

export const NavbarGeneral = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="fixed w-full z-20 top-0 bg-white shadow-md">
      <div className="wrapper flex items-center justify-between px-4 py-3 md:px-6">
        {/* Logo */}
        <nav>
          <img
            src={logo}
            alt="Logo"
            className="h-10 w-auto sm:h-12 md:h-14 lg:h-16"
          />
        </nav>
      </div>
    </div>
  );
};
