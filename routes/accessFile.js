var router = require("express").Router();
const logger = require("../util/logger");
const mime = require("mime");
const fs = require("fs");

const os = require('os');
const platform = os.platform();



router.get("/images/:fileName?dwnload=true", async function (req, res) {
  getFile(req, res, true , "/public/images/");
});
router.get("/images/:fileName", async function (req, res) {
  getFile(req, res, false , "/public/images/");
});

router.get("/thumbnail/:fileName", async function (req, res) {
  getFile(req, res, false , "/public/thumbnail/");
});

function getFile(req, res, download , path ) {
  logger.debug("Route ::  server.getFile");
  const fileName = req.params.fileName;
  let dir = __dirname;

  if (platform === 'linux') {
    dir = __dirname.slice(0, __dirname.lastIndexOf("\/"))    
  }
  else{
    dir =  __dirname.slice(0, __dirname.lastIndexOf("\\"));
  } 
  
  const filePath =
  dir +
  path +
    fileName;
  const exists = fs.existsSync(filePath);

  if (exists) {
    logger.info("found the file : " + filePath);
    if (req.query.download === "true") {
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileName}"`
      );
    }

    const fileExtension = filePath.slice(
      ((filePath.lastIndexOf(".") - 1) >>> 0) + 2
    );
    const mimeType = mime.getType(fileExtension);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With,Content-Type,Accept"
    );
    res.setHeader(
      "Access-Control-Allow-Methos",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", mimeType);
    res.sendFile(filePath);
  } else {
    logger.warn("file is not found in path : " + filePath);
    res.status(404).send("Not found");
  }
}

module.exports = router;
