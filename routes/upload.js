const path = require("path");
const multer = require("multer");
const router = require("express").Router();
var appDir = path.dirname(require.main.filename);
var State = require("../models/stateModel");
const staticImagesDir = path.join(appDir, "/public/images/");
const staticThumbnailDir = path.join(appDir, "/public/thumbnail/");
var explorer = require("../util/explorer");
const logger = require("../util/logger");
const responses = require("../util/responses");
const imageThumbnail = require("image-thumbnail");
const fs = require("fs");


if( !fs.existsSync(staticImagesDir))
  fs.mkdirSync(staticImagesDir);
if( !fs.existsSync(staticThumbnailDir))
  fs.mkdirSync(staticThumbnailDir);  

// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, staticImagesDir);
  },
  filename: function (req, file, cb) {
    var newName = `${Date.now()}` + "__" + file.originalname;
    req.fileName = newName;
    cb(null, newName);
  },
});

var upload = multer({ storage: storage });

//module.exports = upload;

router.post("/", upload.single("file"), async (req, res) => {
  logger.debug("Route :: /upload ");
  let file = req.file;

  let files = JSON.parse(req.body.files);

  const type = getFileTypeBasedOnType(file.mimetype);
  const filePath = [...files.currentPath, file.originalname];

  let insertFile = {
    name: file.originalname,
    urlName: file.filename,
    type: type,
    absolutePath: filePath,
  };

  if (type === "IMAGE" ) {
    try {
      const options = {
        percentage  : 40 ,
        width : 1200,
        height : 900,
        fit:"cover"
      }
      const thumbnail = await imageThumbnail(staticImagesDir + file.filename , options );
      fs.writeFileSync(staticThumbnailDir + file.filename, thumbnail);
    } catch (err) {
      console.error(err);
    }
  }

  let newState = explorer.addFile(files, files.currentPath, insertFile);

  State.setState(req.user.id, JSON.stringify(newState))
    .then(() => {
      logger.info(`file  ${file.originalname} uploaded successfuly`);
      let response = responses.FILE_UPLOADED_SUCCESSFULY;
      response.files = newState;
      res.status(200).json(response);
      logger.info(
        `the new state after file upladed has been saved successfuly`
      );
    })
    .catch((err) => {
      logger.error("could not save the state after the upload ", err);
      res.status(500).json(responses.INTERNAL_SERVER_ERROR).send();
    });
});

module.exports = router;

function getFileTypeBasedOnType(type) {
  if (type.includes("image")) return "IMAGE";
  if (type.includes("video")) return "VIDEO";
  if (type.includes("audio") || type.includes("mpeg")) return "AUDIO";
  if (type.includes("pdf")) return "PDF";
  if (type.includes("text")) return "TXT";
}

async function createImageThumbnail() {}
