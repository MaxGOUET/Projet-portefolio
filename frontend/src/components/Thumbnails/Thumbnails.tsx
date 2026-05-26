import Languages from "../Languages/Languages";
import "./Thumbnails.scss";

import { NavLink } from "react-router-dom";

function Thumbnails({
  imgSrc,
  title,
  itemId,
  description,
  repoGithubUrl,
}: {
  imgSrc: string;
  title: string;
  itemId: string;
  description: string;
  repoGithubUrl: string;
}) {
  return (
    <>
      <NavLink to={`/project/${itemId}`}>
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
