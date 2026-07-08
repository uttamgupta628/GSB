const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.token;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) res.status(403).json("Token is not valid");
        req.user = user;
        next();
      });
    } else {
      return res.status(401).json("you're not authenticated");
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};

const verifyTokenandAuthorization = (req, res, next) => {
  try {
    verifyToken(req, res, () => {
      if (req.user.id === req.params.id || req.user.isAdmin) {
        next();
      } else {
        res.status(403).json("You're not allowed to do that");
      }
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const verifyTokenandAdmin = (req, res, next) => {
  try {
    verifyToken(req, res, () => {
      console.log(req.user);
      if (req.user.isAdmin) {
        next();
      } else {
        res.status(403).json("You're not allowed to do that");
      }
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = {
  verifyToken,
  verifyTokenandAuthorization,
  verifyTokenandAdmin,
};
