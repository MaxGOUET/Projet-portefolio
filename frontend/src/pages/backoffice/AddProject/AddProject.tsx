import { addProject } from "../../../lib/common";

function AddProject() {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await addProject({
      title: formData.get("title") as string,
      url: formData.get("url") as string,
      description: formData.get("description") as string,
      repoGithubUrl: formData.get("repoGithubUrl") as string,
    });
  };

  return (
    <div>
      <h1>Ajouter un projet</h1>
      <form action="add-project" onSubmit={handleSubmit}>
        <label htmlFor="project-name">Titre du projet:</label>
        <input type="text" id="project-name" name="title" required />
        <label htmlFor="project-url">URL du projet:</label>
        <input type="url" id="project-url" name="url" required />
        <label htmlFor="project-description">Description du projet:</label>
        <textarea
          id="project-description"
          name="description"
          required
        ></textarea>
        <label htmlFor="project-github">URL GitHub du projet:</label>
        <input type="url" id="project-github" name="repoGithubUrl" required />
        <button type="submit">Ajouter le projet</button>
      </form>
    </div>
  );
}

export default AddProject;
