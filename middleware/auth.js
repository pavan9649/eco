// middleware/users.js

const jwt = require("jsonwebtoken");

module.exports = {
  validateRegister: (req, res, next) => {
    // username min length 3
    if (!req.body.username || req.body.username.length < 3) {
      return res.status(400).send({
        msg: 'Please enter a username with min. 3 chars'
      });
    }

    // password min 6 chars
    if (!req.body.password || req.body.password.length < 6) {
      return res.status(400).send({
        msg: 'Please enter a password with min. 6 chars'
      });
    }

    // password (repeat) does not match
    if (
      !req.body.confirmPassword ||
      req.body.password != req.body.confirmPassword
    ) {
      return res.status(400).send({
        msg: 'Both passwords must match'
      });
    }

    next();
  },

  validateUpdate: (req, res, next) => {
    // username min length 3

    // password min 6 chars
    if (!req.body.oldPassword ) {
      return res.status(400).send({
        msg: 'Please enter old password'
      });
    }

    // password (repeat) does not match
    if (
      !req.body.confirmPassword ||
      req.body.newPassword != req.body.confirmPassword
    ) {
      return res.status(400).send({
        msg: 'Both passwords must match'
      });
    }

    next();
  }
};