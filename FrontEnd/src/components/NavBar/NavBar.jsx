import React, { useState, useRef} from "react";
import MenuLink from "../MenuLink/MenuLink";
import "./NavBar.css";
import { useNavigate, NavLink } from "react-router-dom";
import { FiLogOut } from 'react-icons/fi';

function NavBar() {
  const [dropMenuOpen, setDropMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [menuBtn, setMenuBtn] = useState(false);
  const [closeBtn, setCloseBtn] = useState(true);
  const navigate = useNavigate();

  const handleMenu = () => {
    setMenuBtn(true);
    setCloseBtn(false);
  };

  const handleClose = () => {
    setCloseBtn(true);
    setMenuBtn(false);
  };

  const handleLogOut = () => {
    navigate("/");
  };

  return (
    <div className="wrap">
      <div className="nav w-full bg-[#0F2043] text-white py-4 px-6 flex items-center shadow-md relative">
        {/* Logo */}
        <div className="logo text-2xl font-bold">SunTrack Admin</div>

        {/* Menu Links (aligned to right) */}
        <div className={`ml-auto flex items-center gap-6 ${menuBtn ? "block" : "hidden"} md:flex`}>
          <MenuLink url="/dashboard" name="Dashboard" />
          <MenuLink url="/fleet-managers" name="Manage" />


          {/* Logout */}
          <button
            onClick={handleLogOut}
            className="logout-btn"
            title="Logout"
          >
            <FiLogOut style={{ marginRight: 6, fontSize: '1.1em' }} /> Logout
          </button>
        </div>

        {/* Mobile menu toggle */}
        <div className="menuOrClose md:hidden ml-2">
          {closeBtn ? (
            <button onClick={handleMenu} title="Open Menu">
              <svg
                width="28px"
                height="28px"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#ffffff"
                  fillRule="evenodd"
                  d="M19 4a1 1 0 01-1 1H2a1 1 0 010-2h16a1 1 0 011 1zm0 6a1 1 0 01-1 1H2a1 1 0 110-2h16a1 1 0 011 1zm-1 7a1 1 0 100-2H2a1 1 0 100 2h16z"
                />
              </svg>
            </button>
          ) : (
            <button onClick={handleClose} title="Close Menu">
              <svg
                fill="#ffffff"
                height="28px"
                width="28px"
                viewBox="0 0 490 490"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polygon points="456.851,0 245,212.564 33.149,0 0.708,32.337 212.669,245.004 0.708,457.678 33.149,490 245,277.443 456.851,490 489.292,457.678 277.331,245.004 489.292,32.337 " />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default NavBar;
