import "./Thumbnails.scss";

import { NavLink } from "react-router-dom";

function Thumbnails({
  imgSrc,
  alt,
  title,
  itemId,
}: {
  imgSrc: string;
  alt: string;
  title: string;
  itemId: string;
}) {
  return (
    <NavLink to={`/${itemId}`}>
      <div className="thumbnails">
        <img src={imgSrc} alt={alt} />
        <h2>{title}</h2>
        <p className="description">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel
          sapien augue. Donec vel sapien augue.
        </p>
      </div>
    </NavLink>
  );
}

export default Thumbnails;
