const { User } = require("./mongo");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function createUser(req, res) {
  try {
    const { email, password } = req.body;

    const hashedPassword = await hashPassword(password);

    const user = new User({ email, password: hashedPassword });

    await user.save();
    res.status(201).send("utilisateur enregistré");
  } catch (err) {
    res.status(409).send({ message: "utilisateur non enregistré : " + err });
  }
}

function hashPassword(password) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

async function logUser(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (isPasswordCorrect) {
      const token = createToken(email);
      res.status(200).send({ userId: user._id, token: token });
    } else {
      res.status(401).send("utilisateur non connecté");
    }
  } catch (err) {
    res.status(500).send("erreur serveur");
  }
}

function createToken(email) {
  const secret = process.env.JWT_PASS;
  return jwt.sign({ email: email }, secret, { expiresIn: "24h" });
}

module.exports = { createUser, logUser };
