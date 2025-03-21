const jwt = require("jsonwebtoken");

const isAdminAuthenticated = async (req, res, next) => {
  //!Geth the token from the header
  const headerObj = req.headers;
  const token = headerObj?.authorization?.split(" ")[1];

  //!Verify the token
  const verifyToken = jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
    if (err) {
      return false;
    } else {
      return decode;
    }
  });

  if (verifyToken) {
    req.admin = verifyToken.id;
    next();
  } else {
    const err = new Error("Token expired, login");
    next(err);
  }
};

module.exports = isAdminAuthenticated;
