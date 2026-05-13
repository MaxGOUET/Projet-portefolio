import "./Tags.scss";

function Tags({ tags }: { tags: string[] }) {
  return (
    <div className="tagsContainer">
      {tags.map((tag, index) => (
        <div key={index} className="tag">
          {tag}
        </div>
      ))}
    </div>
  );
}

export default Tags;
