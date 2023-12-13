const logger = require("../util/logger");
const auth = require("../Authentication/auth");

var router = require("express").Router();

router.use("/", function (req, res, next) {
  logger.debug("Route :: / ");
  var authorization = req.headers.authorization;
  if (authorization == undefined) {
    logger.warn("reques it not authorized , no token found");
    res.status(401).send("token not found");
    return;
  }
  var token;
  if (authorization.split(" ")[0] == "Bearer") {
    token = authorization.split(" ")[1];
  } else {
    token = authorization;
  }

  try {
    var user = auth.verifyUser(token);
    req.user = user;
    next();
  } catch (err) {
    logger.warn("reques it not authorized , no token found");
    logger.warn(err);
    err.statusCode = 401;
    next(err);
    return;
  }
});

module.exports = router;
