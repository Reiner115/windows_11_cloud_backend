var router = require("express").Router();
var User = require("../models/userModel");
var initState = require("../db/initState");
const State = require("../models/stateModel.js");
var Auth = require("../Authentication/auth");
const logger = require("../util/logger");
const {
  INTERNAL_SERVER_ERROR,
  NAME_FIELD_NOT_FOUND_IN_REQUEST,
  USER_WITH_THIS_NAME_ALREADY_EXSITS,
  PASSWORD_FIELD_NOT_FOUND_IN_REQUEST,
  USERNAME_OR_PASSWORD_IS_WRONG
} = require("../util/responses");
const connection = require("../db/connection");

router.post("/login", (req, res) => {
  logger.debug("Route :: /user/login");

  const name = req.body.name;
  const password = req.body.password;
  if (name === null || name === undefined || name === "")
    return res.status(NAME_FIELD_NOT_FOUND_IN_REQUEST.responseCode).json(NAME_FIELD_NOT_FOUND_IN_REQUEST).send();
  if (password === null || password === undefined || password === "")
    return res.status(PASSWORD_FIELD_NOT_FOUND_IN_REQUEST.responseCode).json(PASSWORD_FIELD_NOT_FOUND_IN_REQUEST).send();
    
  State.getState(name)
    .then((result) => {
      if( result instanceof Array && result.length === 0 ){
        logger.info(`username ${name} not found in DB`);
         res.status(USERNAME_OR_PASSWORD_IS_WRONG.responseCode).json(USERNAME_OR_PASSWORD_IS_WRONG).send();
         return;
      }

      const savedPassword = result.password;
      const compareResult = Auth.compare(  password , savedPassword);
      if(  ! compareResult )     {
        logger.info("password is wrong")
        return res.status(USERNAME_OR_PASSWORD_IS_WRONG.responseCode).json(USERNAME_OR_PASSWORD_IS_WRONG).send();
      }

      logger.info("State retrived successfauly");
      const obj = { name: result.name, id: result.id };
      const token = Auth.signIn(obj);
      let files = JSON.parse(result.state);
      let state1 = {
        files: files,
        user: {
          isLoggedIn: true,
          token: token,
          username : name
        },
      };
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

      res.status(200).json(state1).send();
      return;
    })
    .catch((err) => {
      logger.error("could not save the sate to db , error :: ", err);
      res.status(500).send(INTERNAL_SERVER_ERROR);
      return;
    })
    .finally(() => {});
});
router.post("/signup", function (req, res, next) {
  logger.debug("Route :: /user/login");

  const name = req.body.name;
  const password = req.body.password;
  if (name === null || name === undefined || name === "")
    return res.status(NAME_FIELD_NOT_FOUND_IN_REQUEST.responseCode).json(NAME_FIELD_NOT_FOUND_IN_REQUEST).send();
  if (password === null || password === undefined || password === "")
    return res.status(PASSWORD_FIELD_NOT_FOUND_IN_REQUEST.responseCode).json(PASSWORD_FIELD_NOT_FOUND_IN_REQUEST).send();

  const hashedPassword = Auth.hash(password);
  let state1 = initState.initState;

  State.getState(name).then((getUserData, rejected) => {
    if( getUserData instanceof Array ){
      if( (getUserData.length > 0) ){
        return res.status(USER_WITH_THIS_NAME_ALREADY_EXSITS.responseCode).send(USER_WITH_THIS_NAME_ALREADY_EXSITS);
      }
    }else{
      return res.status(USER_WITH_THIS_NAME_ALREADY_EXSITS.responseCode).send(USER_WITH_THIS_NAME_ALREADY_EXSITS); 
    }
    User.inserUser(name, hashedPassword, JSON.stringify(state1.files))
      .then((data) => {
        logger.info("User signed up successfauly");
        state1.user.id = data.insertId;
        const obj = { name: name, id: data.insertId };
        const token = Auth.signIn(obj);
        state1.user.token = token;
        const state = JSON.stringify(state1);
        res
          .status(200)
          .type("application/json")
          .json({ responseCode: 200, state: initState.initState })
          .send();
      })
      .catch((err) => {
        logger.error("could not save the sate to db , error :: ", err);
        res.status(500).send(INTERNAL_SERVER_ERROR);
        return;
      });
  });
});


router.post("/activate" , ( req , res , next )=>{

});
module.exports = router;
