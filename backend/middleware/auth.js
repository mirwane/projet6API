const jwt = require("jsonwebtoken");

function authentificatUser(req, res, next) {
  const header = req.header("Authorization");
  if (!header) {
    return res.status(403).send({ message: "header absent" });
  }

  const token = header.split(" ")[1];
  if (!token) {
    return res.status(403).send({ message: "token absent" });
  }

  jwt.verify(token, process.env.JWT_PASS, (err, decoded) => {
    if (err) return res.status(403).send({ message: "token invalid" + err });
    console.log("token valid");
    next();
  });
}

module.exports = { authentificatUser };
