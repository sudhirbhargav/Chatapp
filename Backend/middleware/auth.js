require("dotenv").config();
const jwt = require("jsonwebtoken");

exports.verifyAuth = async (req, res, next) => {
  const token = req.headers["token"];
  jwt.verify(token, process.env.JWT_SECRET, (err, authdata) => {
    if (err) {
      res.json({ msg: "invalid token or expired token" });
      console.log("invalid token or expired token");
    } else {
      req.user = authdata?.userDetail;
      next();
    }
  });
};
