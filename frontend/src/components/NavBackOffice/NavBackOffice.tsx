import { logoutUser } from "../../lib/common";
import { useNavigate } from "react-router-dom";
import "./NavBackOffice.scss";

interface NavBackOfficeProps {
  onSelect: (value: string) => void;
}

function NavBackOffice({ onSelect }: NavBackOfficeProps) {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logoutUser().then((data) => {
      if (data.authenticated === false) {
        navigate("/login");
      } else {
        console.error("Logout failed:", data);
      }
    });
  };

  return (
    <div className="nav-back-office">
      <h1>Back Office</h1>
      <button onClick={handleLogout}>Logout</button>
      <div className="back-office-menu">
        <button onClick={() => onSelect("add-project")}>
          Ajouter un projet
        </button>
        <button onClick={() => onSelect("modify-project")}>
          Modifier un projet
        </button>
        <button onClick={() => onSelect("remove-project")}>
          Supprimer un projet
        </button>
        <button onClick={() => onSelect("profil")}>Profil</button>
      </div>
    </div>
  );
}

export default NavBackOffice;
