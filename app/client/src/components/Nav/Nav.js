import React from "react";

function Nav() {
  return (
    <header className="lg:py-2">
      <nav className="nav flex">
        <div className="es-nav-container py-3 px-3 w-full flex items-center">
          <div className="font-bold text-lg uppercase w-1/2">Esgrow</div>
          <div className="menu w-1/2 text-end">menu</div>
        </div>
      </nav>
    </header>
  );
}

export default Nav;
