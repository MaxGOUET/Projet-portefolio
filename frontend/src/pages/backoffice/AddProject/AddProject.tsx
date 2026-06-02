import { useState } from "react";
import { postProject } from "../../../lib/common";
import "./AddProject.scss";

function AddProject() {
  const [responseOk, setResponseOk] = useState("");
  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await postProject({
      title: formData.get("title") as string,
      url: formData.get("url") as string,
      description: formData.get("description") as string,
      repoGithubUrl: formData.get("repoGithubUrl") as string,
    });
    if (!postProject) {
      setResponseOk("error");
      setTimeout(() => {
        setResponseOk("");
      }, 3000);
      return;
    }
    event.target.reset();
    setResponseOk("success");
    setTimeout(() => {
      setResponseOk("");
    }, 3000);
  };

  return (
    <div className="form-add-container">
      <h1>Ajouter un projet</h1>
      <form action="add-project" onSubmit={handleSubmit}>
        <span className="title">
          <label htmlFor="project-name">Titre du projet:</label>
          <input type="text" id="project-name" name="title" required />
        </span>
        <span className="url">
          <label htmlFor="project-url">URL du projet:</label>
          <input type="url" id="project-url" name="url" required />
        </span>
        <span className="description">
          <label htmlFor="project-description">Description du projet:</label>
          <textarea
            id="project-description"
            name="description"
            required
          ></textarea>
        </span>
        <span className="github">
          <label htmlFor="project-github">URL GitHub du projet:</label>
          <input type="url" id="project-github" name="repoGithubUrl" required />
        </span>
        <button type="submit">Ajouter le projet</button>
      </form>
      {(responseOk === "success" && <p>Projet ajouté avec succès !</p>) ||
        (responseOk === "error" && (
          <p>Une erreur est survenue lors de l'ajout du projet.</p>
        ))}
    </div>
  );
}

export default AddProject;
