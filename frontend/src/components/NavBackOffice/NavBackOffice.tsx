import { logoutUser } from "../../lib/common";
import { useNavigate } from "react-router-dom";
import "./NavBackOffice.scss";

function NavBackOffice() {
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
        <p>Ajouter un projet</p>
        <p>Modifier un projet</p>
        <p>Supprimer un projet</p>
        <p>Profil</p>
      </div>
    </div>
  );
}

export default NavBackOffice;
