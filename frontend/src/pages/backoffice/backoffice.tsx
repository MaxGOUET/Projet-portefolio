import Header from "../../components/Header/Header";
import "./backoffice.scss";
import "../../index.css";
import NavBackOffice from "../../components/NavBackOffice/NavBackOffice";
import { getAuthUser } from "../../lib/common";
import Chargement from "../Chargement/Chargement";
import { Navigate } from "react-router-dom";
import { getLanguages } from "../../lib/common";
import { useEffect, useState } from "react";
import Tags from "../../components/Tags/Tags";
function BackOffice() {
  const [authenticated, setAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAuthUser().then((data) => {
      if (data.authenticated === true) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
      setIsLoading(false);
    });
  }, []);

  type Language = { name: string; percentage: number };
  const fontAwesomeIcons: Record<string, string> = {
    javascript: "js",
    typescript: "typescript",
    python: "py",
    html: "html5",
    css: "css3",
    java: "java",
    scss: "sass",
    symfony: "symfony",
    php: "php",
    react: "react",
    node: "node",
  };
  const [languages, setLanguages] = useState<Language[]>([]);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const data = await getLanguages("MaxGOUET/Projet_5_Kasa");
        const total = Object.values(data as Record<string, number>).reduce(
          (sum, v) => sum + v,
          0,
        );
        const languagesWithPercent: Language[] = Object.entries(
          data as Record<string, number>,
        ).map(([name, value]) => ({
          name,
          percentage: parseFloat(((value / total) * 100).toFixed(1)),
        }));
        setLanguages(languagesWithPercent);
      } catch (error) {
        console.error("Error fetching languages:", error);
      }
    };

    fetchLanguages();
  }, []);

  if (isLoading) {
    return <Chargement />;
  }

  if (authenticated) {
    return (
      <div>
        <Header />
        <div className="back-office-container">
          <NavBackOffice />
          <div className="content">
            <Tags
              tags={languages.map((lang) => lang.name)}
              name={languages.map(
                (lang) => fontAwesomeIcons[lang.name.toLowerCase()] || "",
              )}
              value={languages.map((lang) => lang.percentage)}
            />
          </div>
        </div>
      </div>
    );
  } else {
    return <Navigate to="/login" />;
  }
}

export default BackOffice;
