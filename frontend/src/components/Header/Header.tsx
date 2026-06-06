import { useState } from "react";
import "./Header.scss";
import { NavLink } from "react-router-dom";
import Modale from "../Modale/Modale";

function Header() {
  const [isModaleOpen, setIsModaleOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const theme = document.documentElement.getAttribute("data-theme");
    if (theme) return theme === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.setAttribute(
      "data-theme",
      next ? "dark" : "light",
    );
  };

  return (
    <div className="header">
      <div className="logo">
        <img src="#" alt="Logo" className="logo" />
      </div>
      <div className="header-content">
        <div className="burger-menu" onClick={() => setIsModaleOpen(true)}>
          <i className="fa-solid fa-bars"></i>
        </div>
        <nav className="header-nav">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Accueil
          </NavLink>
          <NavLink
            to="/projets"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Projets
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Contact
          </NavLink>
          <NavLink
            to="/backoffice"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Back Office
          </NavLink>
          <NavLink
            to="https://www.github.com/MaxGOUET"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa-brands fa-github"></i>
          </NavLink>
          <NavLink
            to="https://www.linkedin.com/in/maxime-gouet-dev/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa-brands fa-linkedin"></i>
          </NavLink>
        </nav>
        <button className="dark-mode-toggle" onClick={toggleDarkMode}>
          {darkMode ? (
            <span key="sun">
              <i className="fa-solid fa-sun"></i>
            </span>
          ) : (
            <span key="moon">
              <i className="fa-solid fa-moon"></i>
            </span>
          )}
        </button>
      </div>
      <Modale isOpen={isModaleOpen} onClose={() => setIsModaleOpen(false)} />
    </div>
  );
}

export default Header;
