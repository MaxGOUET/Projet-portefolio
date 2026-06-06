import "./Modale.scss";
import { NavLink } from "react-router-dom";

interface ModaleProps {
  isOpen: boolean;
  onClose: () => void;
}

function Modale({ isOpen, onClose }: ModaleProps) {
  if (!isOpen) return null;

  return (
    <div className="modale-overlay" onClick={onClose}>
      <button className="modale-close" onClick={onClose}>
        <i className="fa-solid fa-xmark"></i>
      </button>
      <nav className="modale-nav" onClick={(e) => e.stopPropagation()}>
        <NavLink
          to="/"
          onClick={onClose}
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Accueil
        </NavLink>
        <NavLink
          to="/projets"
          onClick={onClose}
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Projets
        </NavLink>
        <NavLink
          to="/contact"
          onClick={onClose}
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Contact
        </NavLink>
        <NavLink
          to="/backoffice"
          onClick={onClose}
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
    </div>
  );
}

export default Modale;
