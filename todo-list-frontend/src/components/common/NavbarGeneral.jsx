import logo from "../../assets/images/Logotipo-only.png";

export const NavbarGeneral = () => {
  const logoAltText = "Logotipo de la aplicación";
  return (
    <div className="fixed w-full z-20 top-0 bg-white shadow-md">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        <div>
          <img
            src={logo}
            alt={logoAltText}
            className="h-10 w-auto sm:h-12 md:h-14 lg:h-16"
          />
        </div>
      </div>
    </div>
  );
};
