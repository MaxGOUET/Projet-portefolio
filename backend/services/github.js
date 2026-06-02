const GithubLanguages = require("../models/GithubLanguages").GithubLanguages;

exports.getGithubRepoLanguages = async (req, res) => {
  const repoGithub = req.body.repoGithubUrl;
  const repoGithubUrlSplited = repoGithub.split(".com/")[1];
  GithubLanguages.findOne({ repoGithubUrl: repoGithub })
    .then((githubLanguages) => {
      if (githubLanguages) {
        const timeDifference = new Date() - new Date(githubLanguages.date);
        const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
        if (daysDifference < 7) {
          res.json(githubLanguages.languages);
        } else {
          githubLanguages
            .deleteOne({ repoGithubUrl: repoGithub })
            .catch((error) => {
              console.error(
                "Une erreur est survenue lors de la suppression des anciennes langues GitHub :",
                error,
              );
            });
          const fetchLanguages = async () => {
            try {
              const response = await fetch(
                `${process.env.REPO_GITHUB_API_URL}${repoGithubUrlSplited}/languages`,
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
              const newGithubLanguages = new GithubLanguages({
                repoGithubUrl: repoGithub,
                languages: data,
                date: new Date(),
              });
              await newGithubLanguages.save();
              res.json(data);
            } catch (error) {
              console.error(
                "une erreur est survenue lors de la récupération des langues du dépôt GitHub :",
                error,
              );
              res
                .status(500)
                .json({
                  error:
                    "Une erreur est survenue lors de la récupération des langues du dépôt GitHub",
                });
            }
          };
          fetchLanguages();
        }
      }
    })
    .catch((error) => {
      console.error(
        "une erreur est survenue lors de la récupération des langues GitHub depuis la base de données :",
        error,
      );
      res
        .status(500)
        .json({
          error:
            "Une erreur est survenue lors de la récupération des langues GitHub depuis la base de données",
        });
    });
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
      "une erreur est survenue lors de la récupération des langues du dépôt GitHub :",
      error,
    );
    throw new Error(
      "Une erreur est survenue lors de la récupération des langues du dépôt GitHub",
    );
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
    console.log("Langages GitHub enregistrés avec succès !");
  } catch (error) {
    console.error(
      "Une erreur est survenue lors de l'enregistrement des langues GitHub :",
      error,
    );
  }
};
