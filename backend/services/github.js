const GithubLanguages = require("../models/GithubLanguages");

exports.getGithubRepoLanguages = async (req, res) => {
  const repoGithub = req.body.repoGithubUrl;
  const repoGithubUrlSplited = repoGithub.split(".com/")[1];
  try {
    // verification de la presence des languages dans la base de données et de leur ancienneté
    const githubLanguages = await GithubLanguages.findOne({
      repoGithubUrl: repoGithub,
    });
    if (!githubLanguages) {
      // Aucun enregistrement trouvé, on fetch directement depuis GitHub
      const data = await exports.fetchGithubRepoLanguages(repoGithubUrlSplited);
      await exports.saveGithubRepoLanguages(repoGithub, data);
      return res.json(data);
    }
    const timeDifference = new Date() - new Date(githubLanguages.date);
    const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
    if (daysDifference < 7) {
      return res.json(githubLanguages.languages);
    }
    // suppression des languages trop anciens de la base de données avant d'enregistrer les nouveaux
    await githubLanguages.deleteOne({ repoGithubUrl: repoGithub });
    const data = await exports.fetchGithubRepoLanguages(repoGithubUrlSplited);
    await exports.saveGithubRepoLanguages(repoGithub, data);
    return res.json(data);
  } catch (error) {
    console.error(
      "une erreur est survenue lors de la récupération des languages :",
      error,
    );
    res.status(500).json({
      error: "Une erreur est survenue lors de la récupération des languages",
    });
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
    console.error(
      "une erreur est survenue lors de la récupération des languages du dépôt GitHub :",
      error,
    );
    throw new Error(
      "Une erreur est survenue lors de la récupération des languages du dépôt GitHub",
    );
  }
};

exports.saveGithubRepoLanguages = async (repoGithubUrl, languages) => {
  try {
    const githubLanguages = new GithubLanguages({
      repoGithubUrl,
      languages,
      date: new Date(),
    });
    await githubLanguages.save();
    console.log("Languages enregistrés avec succès !");
  } catch (error) {
    console.error(
      "Une erreur est survenue lors de l'enregistrement des languages :",
      error,
    );
  }
};
