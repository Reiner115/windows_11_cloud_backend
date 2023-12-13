const e = require("express");
var pool = require("../db/connection.js");
async function getState(name) {
  return new Promise((resolve, reject) => {
    pool.getConnection((getConnectionError, connection) => {
      if (getConnectionError) {
        reject(getConnectionError);
        return;
      }

      connection.query(
        "SELECT * FROM users WHERE name = ? limit 1",
        name,
        (queryError, data) => {
          connection.release(); // Release the connection back to the pool

          if (queryError) {
            reject(queryError);
          } else {
            if (data.length > 0) {
              resolve(data[0]);
            } else {
              resolve([]);
            }
          }
        }
      );
    });
  });
}

async function setState(userId, state) {
  return new Promise(function (resolve, reject) {
    pool.getConnection((getConnectionError, connection) => {
      if (getConnectionError) {
        reject(getConnectionError);
        return;
      }

      connection.query(
        "update users set state = ? where id = ?",
        [state, userId],
        function (err, data) {
          connection.release();
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        }
      );
    });
  });
}

module.exports = {
  setState,

  getState,
};
