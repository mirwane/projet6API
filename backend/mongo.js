const mongoose = require("mongoose");
const password = process.env.DB_PASS;
const username = process.env.DB_USER;
const DB = process.env.DB_NAME;
const uri = `mongodb+srv://${username}:${password}@cluster0.xevkt4r.mongodb.net/${DB}?retryWrites=true&w=majority`;

mongoose
  .connect(uri)
  .then(() => console.log("Connecté to MongoDB"))
  .catch((err) => console.error("erreur MongoDB", err));

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

module.exports = { mongoose, User };
