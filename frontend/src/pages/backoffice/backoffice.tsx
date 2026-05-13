import { logoutUser, getLanguages } from "../../lib/common";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Tags from "../../components/Tags/Tags";

function BackOffice() {
  const navigate = useNavigate();
  const [languages, setLanguages] = useState<string[]>([]);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const data = await getLanguages("MaxGOUET", "Projet_5_Kasa");
        const total = Object.values(data as Record<string, number>).reduce(
          (sum, v) => sum + v,
          0,
        );
        const languagesWithPercent = Object.entries(
          data as Record<string, number>,
        ).map(
          ([name, value]) => `${name} (${((value / total) * 100).toFixed(1)}%)`,
        );
        setLanguages(languagesWithPercent);
      } catch (error) {
        console.error("Error fetching languages:", error);
      }
    };

    fetchLanguages();
  }, []);

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
      <Tags tags={languages} />
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default BackOffice;
