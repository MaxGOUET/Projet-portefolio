import "./Tags.scss";

function Tags({
  tags,
  name,
  value,
}: {
  tags: string[];
  name: string[];
  value: number[];
}) {
  return (
    <div className="tags-container">
      {tags.map((tag, index) => (
        <div key={index} className="tag">
          <i
            className={
              name[index] === "undefined"
                ? "fa-solid fa-code"
                : `fa-brands fa-${name[index]?.toLowerCase()}`
            }
          ></i>
          <p>{`${tag} (${value[index]}%)`}</p>
        </div>
      ))}
    </div>
  );
}

export default Tags;
