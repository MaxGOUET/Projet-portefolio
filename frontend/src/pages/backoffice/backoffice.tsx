import { logoutUser } from "../../lib/common";
import { useNavigate } from "react-router-dom";

function BackOffice() {
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
    <div>
      <h1>Backoffice</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default BackOffice;
