const jwt = require("jsonwebtoken");

// verify token
const verifyToken = (req, res, next) => {
  const authToken = req.headers.authorization;
  if (authToken) {
    const token = authToken.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(403).json("Token is not valid!");
    }
  } else {
    return res.status(401).json("You are not authenticated!");
  }
};

// veryfying token & admin
const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return res
        .status(403)
        .json({ message: "Unauthorized , only admin can access" });
    }
  });
};

// veryfying token & user himself
const verifyTokenAndOnlySameUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id) {
      next();
    } else {
      return res.status(403).json({ message: "not allowed , only same user" });
    }
  });
};

// veryfying token & Authorization
const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return res
        .status(403)
        .json({ message: "not allowed , only same user or admin" });
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndOnlySameUser,
  verifyTokenAndAuthorization,
};
