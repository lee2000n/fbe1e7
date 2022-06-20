const jwt = require('jsonwebtoken');

function notFound(req, res) {
  res.status(404);
  res.json({
    error: 'The route is not defined',
  });
}
const { User } = require('./db/models');

/* eslint-disable-next-line no-unused-vars */
function errorHandler(err, req, res, next) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '' : err.stack,
  });
}

/* eslint-disable-next-line no-unused-vars */
function auth(req, res, next) {
  const token = req.headers['x-access-token'];
  if (!token) {
    return res.status(401).send({
      message: "Unauthorized! No token provided!"
    });
  }
  else {
    jwt.verify(token, process.env.SESSION_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Unauthorized! Got invalid credentials!"
        });
      }
      req.userId = decoded.id;
      next();
    });
  }
}
function isAdmin  (req, res, next)  {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let role of roles) {
        if (role.name === "Admin") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Admin Role!"
      });
      
    });
  });
};

function isUser  (req, res, next)  {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let role of roles) {
        if (role.name === "User") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require User Role!"
      });
    });
  });
};

function isGuest(req, res, next) {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let role of roles) {
        if (role.name === "Guest") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Guest Role!"
      });
    });
  });
}
module.exports = {
  notFound,
  errorHandler,
  auth,
  isAdmin,
  isGuest,
  isUser
};
