import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import Logo from "../../images/logo.png";

// Context
import { WalletContext } from "../../context/WalletContext";

/* Components*/
import MenuIcon from "../Helpers/MenuIcon";
import CloseIcon from "../Helpers/CloseIcon";
import SmileIcon from "../Helpers/SmileIcon";

function Nav() {
  const [toggle, setToggle] = useState(false);
  const address = localStorage.getItem("address");

  const { isConnectable, onConnect } = useContext(WalletContext);

  // start connect app here
  const onConnectRequest = async () => {
    onConnect();
  };

  // connect wallet
  const ConnectBtn = ({ onClick }) => {
    if (!isConnectable) {
      return (
        <button
          className="bg-[#AFD9D5] px-120 py-4 rounded-full text-white btn-connect"
          onClick={() => {
            window.location = "https://metamask.io/download/";
          }}
        >
          Install a wallet
        </button>
      );
    }

    return address ? (
      <div className="text-[#fffbee] bg-[#AFD9D5] font-bold text-4xl cursor-pointer flex items-center justify-center flex-col">
        <SmileIcon />
        <span className="block text-xs font-bold">
          {address.substring(0, 4) + `...` + address.substring(4, 8)}
        </span>
      </div>
    ) : (
      <button
        className="bg-[#AFD9D5] px-8 py-4 rounded-full text-[#ffffff] btn-connect"
        {...{ onClick }}
      >
        Connect
      </button>
      
    );
  };

  useEffect(() => {
    const navLinks = Array.from(document.querySelectorAll(".nav-links li"));
    navLinks.forEach((navlink) => {
      navlink.addEventListener("click", () => {
        setToggle(false);
      });
    });
  }, []);


  return (
    <header className="custom-header px-4">
      <div className="logo">
        <Link to="/" className="font-bold text-white uppercase text-1xl">
          Esgrow
        </Link>
      </div>

      <div className={`nav-menu ${toggle ? "show" : ""}`}>
        <ul>
          <li className="uppercase">
            <Link to="/airdrop">Airdrop Whitelist</Link>
          </li>
          <li className="uppercase">
            <Link to="/marketplace">Markeplace</Link>
          </li>
          <li className="hide-btn uppercase">
            <ConnectBtn onClick={onConnectRequest} />
          </li>
        </ul>

        <div className="fix-later">
          <ConnectBtn onClick={onConnectRequest} />
        </div>
        </div>
      <div className="menu-btn">
        <button
          className="border-none text-white font-bold text-2xl"
          onClick={() => setToggle((toggle) => !toggle)}
        >
          {toggle ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>
    </header>
  );
}

export default Nav;
