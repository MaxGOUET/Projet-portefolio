import Tags from "../../components/Tags/Tags";
import { getLanguages } from "../../lib/common";
import { useEffect, useState } from "react";
import "./languages.scss";

function Languages({ repoGithubUrl }: { repoGithubUrl: string }) {
  type Language = { name: string; percentage: number };
  const fontAwesomeIcons: Record<string, string> = {
    javascript: "js",
    typescript: "typescript",
    python: "py",
    html: "html5",
    css: "css3",
    java: "java",
    scss: "sass",
    php: "php",
    dockerfile: "docker",
  };
  const [languages, setLanguages] = useState<Language[]>([]);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const data = await getLanguages(repoGithubUrl);
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

  return (
    <div className="languages">
      <Tags
        tags={languages.map((lang) => lang.name)}
        name={languages.map(
          (lang) => fontAwesomeIcons[lang.name.toLowerCase()] || "undefined",
        )}
        value={languages.map((lang) => lang.percentage)}
      />
    </div>
  );
}

export default Languages;
