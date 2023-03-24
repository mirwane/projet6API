const { User } = require("./mongo");
const bcrypt = require("bcrypt");

async function createUser(req, res) {
  const { email, password } = req.body;
  const hashedPassword = await hashPassword(password);
  const user = new User({ email, password: hashedPassword });

  user
    .save()
    .then(() => res.status(201).send({ message: "utilisateur créé" }))
    .catch((err) =>
      res.status(409).send({ message: "utilisateur existant :" + err })
    );
}

function hashPassword(password) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

function logUser(req, res) {
  const { email, password } = req.body;
  user.findOne({ email: email }).then((user) => {
    if (!user) {
      return res.status(403).send({ message: "Utilisateur inconnu" });
    }
    bcrypt.compare(password, user.password).then((valid) => {
      if (!valid) {
        return res.status(403).send({ message: "Mot de passe incorrect" });
      }
      res.status(200).send({ message: "Utilisateur connecté" });
    });
  });
}

module.exports = { createUser, logUser };
