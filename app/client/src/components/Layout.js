import React from "react";
import Nav from "./Nav/Nav";

function Layout({ children }) {
  return (
    <>
      <Nav />
      <div className="">{children}</div>
    </>
  );
}

export default Layout;
