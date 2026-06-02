const GithubLanguages = require("../models/GithubLanguages");

exports.getGithubRepoLanguages = async (req, res) => {
  const repoGithub = req.body.repoGithubUrl;
  try {
    const response = await fetch(
      `${process.env.REPO_GITHUB_API_URL}${repoGithub}/languages`,
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_ACCESS_TOKEN}`,
        },
      },
    );
    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${response.statusText}`,
      );
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching GitHub repo languages:", error);
    res.status(500).json({ error: "Failed to fetch GitHub repo languages" });
  }
};

exports.fetchGithubRepoLanguages = async (repoGithubUrl) => {
  try {
    const response = await fetch(
      `${process.env.REPO_GITHUB_API_URL}${repoGithubUrl}/languages`,
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_ACCESS_TOKEN}`,
        },
      },
    );
    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${response.statusText}`,
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching GitHub repo languages:", error);
    throw new Error("Failed to fetch GitHub repo languages");
  }
};

exports.saveGithubRepoLanguages = async (userId, repoGithubUrl, languages) => {
  try {
    const githubLanguages = new GithubLanguages({
      userId,
      repoGithubUrl,
      languages,
      date: new Date(),
    });
    await githubLanguages.save();
    console.log("GitHub languages saved successfully!");
  } catch (error) {
    console.error("Error saving GitHub languages:", error);
  }
};
