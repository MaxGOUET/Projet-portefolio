const sharp = require("sharp");
const path = require("path");

const convertImage = (req, res, next) => {
  if (!req.file) {
    return next();
  } else {
    const filePath = path
      .parse(req.file.originalname)
      .name.split(" ")
      .join("_");

    if (req.file.mimetype !== "image/webp") {
      sharp(req.file.buffer)
        .webp({ quality: 80 })
        .toFile(`images/${filePath}-converted.webp`)
        .then(() => {
          next();
        })
        .catch((err) => {
          console.error("Erreur lors de la conversion de l'image :", err);
          next(err);
        });
    } else {
      sharp(req.file.buffer)
        .toFile(`images/${filePath}.webp`)
        .then(() => {
          next();
        })
        .catch((err) => {
          console.error("Erreur lors de l'enregistrement de l'image :", err);
          next(err);
        });
    }
  }
};

module.exports = convertImage;
