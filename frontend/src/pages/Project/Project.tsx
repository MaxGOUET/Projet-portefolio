import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getProjects } from "../../lib/common";
import "./project.scss";
import Loading from "../Loading/Loading";

interface Project {
  _id: string;
  title: string;
  imageUrl: string;
  description: string;
}

function Project() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getProjects().then((data) => {
      setProjects(data);
      setIsLoading(false);
    });
  }, []);

  const { projectId } = useParams();
  const project: Project | undefined = projects.find(
    (project) => project._id === projectId,
  );
  if (isLoading) {
    return <Loading />;
  }
  if (!project) {
    return <div>projet non trouvé - faire 404</div>;
  }

  return (
    <div className="project">
      <h1>Project n° {project._id}</h1>
    </div>
  );
}

export default Project;
