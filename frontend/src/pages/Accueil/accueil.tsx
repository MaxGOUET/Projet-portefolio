import { useEffect, useState } from "react";
import Thumbnails from "../../components/Thumbnails/Thumbnails";
import { getProjects } from "../../lib/common";

type Project = {
  _id: string;
  title: string;
  imageUrl: string;
  description: string;
  repoGithubUrl: string;
};

function Accueil() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    getProjects().then((data) => setProjects(data));
  }, []);

  return (
    <>
      <div className="accueil">
        {projects.map((p) => (
          <Thumbnails
            key={p._id}
            imgSrc={p.imageUrl}
            title={p.title}
            projectId={p._id}
            description={p.description}
            repoGithubUrl={p.repoGithubUrl}
          />
        ))}
      </div>
    </>
  );
}

export default Accueil;
