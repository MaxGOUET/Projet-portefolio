const multer = require("multer");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const storage = multer.memoryStorage();

const fileFilter = (req, file, callback) => {
  if (!MIME_TYPES[file.mimetype]) {
    return callback(new Error("Type de fichier non autorisé"), false);
  }
  callback(null, true);
};

module.exports = multer({ storage: storage, fileFilter: fileFilter }).single(
  "image",
);
