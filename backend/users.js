const { User } = require("./mongo");

function createUser(req, res) {
  const { email, password } = req.body;
  const user = new User({ email, password });

  user
    .save()
    .then(() => res.send("utilisateur enregistré"))
    .catch((err) => console.log("utilisateur non enregistré", err));
}

module.exports = { createUser };
