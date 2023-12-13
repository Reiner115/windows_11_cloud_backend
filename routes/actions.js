const router = require("express").Router();
const User = require("../models/stateModel.js");
const createFolder = require("../actions/createFolder");
const { deleteFile } = require("../actions/deleteFile.js");
const renameFile = require("../actions/renameFile");
const logger = require("../util/logger");
const { INTERNAL_SERVER_ERROR } = require("../util/responses");

router.post("/createFolder", (req, res) => {
  logger.debug("Route :: POST /actions/createFolder");
  const user = req.user;
  let files = req.body.files;

  let folderName = req.body.folderName;
  const newFilesState = createFolder.createFolder( files , folderName);

  User.setState( user.id , JSON.stringify(newFilesState))
    .then((resp) => {
      logger.info(`Folder ${folderName} has been created successfuly`);
      const response = {
        responseCode: 200,
        responseStatus: "successfull",
        responseMessage: "Folder has been created Successfully",
        files: newFilesState,
      };
      res.json(response).status(200).send();
    })
    .catch((err) => {
      logger.error(
        "error while saving the satate after creating folder , error :: ",
        err
      );
      res.status(500).json(INTERNAL_SERVER_ERROR).send();
    });
});

router.post("/rename", (req, res) => {
  logger.debug("Route :: POST /actions/rename");
  const user = req.user;
  let files = req.body.files;
  const oldName = req.body.oldName;
  const newName = req.body.newName;
  let newFiles = renameFile.renameFile(files, oldName, newName);
  User.setState(user.id, JSON.stringify(newFiles))
    .then((resp) => {
      logger.info(`File ${oldName} has been renamed to ${newName} successfuly`);
      const response = {
        responseCode: 200,
        responseStatus: "successfull",
        responseMessage: "file name has been changed Successfully",
        files: newFiles,
      };
      res.json(response).status(200).send();
    })
    .catch((err) => {
      logger.error(
        "error while saving the satate after renaming file , error :: ",
        err
      );
      res.status(500).json(INTERNAL_SERVER_ERROR).send();
    });
});

router.post("/delete", (req, res) => {
  logger.debug("Route :: POST /actions/delete");
  const user = req.user;
  let files = req.body.files;
  const path = req.body.path;
  let newFiles = deleteFile(files, path);
  User.setState(user.id, JSON.stringify(newFiles))
    .then((resp) => {
      logger.info(`File ${path[path.length]} has been deleteds successfuly`);
      const response = {
        responseCode: 200,
        responseStatus: "successfull",
        responseMessage: "file has been deleted Successfully",
        files: newFiles,
      };
      res.json(response).status(200).send();
    })
    .catch((err) => {
      logger.error(
        "error while saving the satate after deleting file , error :: ",
        err
      );
      res.status(500).json(INTERNAL_SERVER_ERROR).send();
    });
});

module.exports = router;
