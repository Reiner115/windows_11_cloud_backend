const router = require("express").Router();
const connection = require("../db/connection.js");
const User = require("../models/stateModel.js");
const auth = require("../Authentication/auth");
const logger = require("../util/logger.js");
const {
  INTERNAL_SERVER_ERROR,
  STATE_NOT_FOUND,
} = require("../util/responses.js");

router.get("/", (req, res) => {
  logger.debug("Route :: GET /state/");
  const user = req.user;
  User.getState(user.id)
    .then((data) => {
      console.log(data);
      res.send(data);
    })
    .catch((err) => {
      logger.error("could not get the satate , error :: ", err);
      res.status(500).send(INTERNAL_SERVER_ERROR);
    });
});

router.post("/", (req, res) => {
  const user = req.user;
  const state = req.body.state;
  if (state == undefined || state == null || state == "") {
    res.status(400).send(STATE_NOT_FOUND);
    return;
  }

  User.setState(user.id, JSON.stringify(state))
    .then((result) => {
      res.status(200).send(result);
      return;
    })
    .catch((err) => {
      logger.error("could not save the satate , error :: ", err);
      res.status(500).send(INTERNAL_SERVER_ERROR);
    });
});

module.exports = router;
