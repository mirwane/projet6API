const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const password = process.env.DB_PASS;
const username = process.env.DB_USER;
const dbName = process.env.DB_NAME;
const uri = `mongodb+srv://${username}:${password}@cluster0.xevkt4r.mongodb.net/${dbName}?retryWrites=true&w=majority`;

mongoose
  .connect(uri)
  .then(() => console.log("Connecté à MongoDB"))
  .catch((err) => console.error("erreur de connection mongodb :", err));

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
userSchema.plugin(uniqueValidator);
const User = mongoose.model("User", userSchema);

module.exports = { mongoose, User };
