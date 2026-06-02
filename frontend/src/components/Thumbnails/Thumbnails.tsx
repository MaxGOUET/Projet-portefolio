import Languages from "../Languages/Languages";
import "./Thumbnails.scss";

import { NavLink } from "react-router-dom";

function Thumbnails({
  imgSrc,
  title,
  projectId,
  description,
  repoGithubUrl,
}: {
  imgSrc: string;
  title: string;
  projectId: string;
  description: string;
  repoGithubUrl: string;
}) {
  return (
    <>
      <NavLink to={`/project/${projectId}`}>
        <div className="thumbnails">
          <img src={imgSrc} alt={`${title}-image`} />
          <h2>{title}</h2>
          <p className="description">{description}</p>
          <Languages repoGithubUrl={repoGithubUrl} />
        </div>
      </NavLink>
    </>
  );
}

export default Thumbnails;
