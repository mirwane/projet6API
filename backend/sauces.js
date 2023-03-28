const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  userId: String,
  name: String,
  manufacturer: String,
  description: String,
  mainPepper: String,
  imageUrl: String,
  heat: Number,
  likes: Number,
  dislikes: Number,
  usersLiked: [String],
  usersDisliked: [String],
});
const Product = mongoose.model("Product", productSchema);

function getSauces(req, res) {
  console.log("getSauces");
  // console.log("token valid", decoded);
  Product.find({}).then((products) => res.send({ products }));
  // res.send({ message: [{ sauce: "sauce1" }, { sauce: "sauce2" }] });
}

function createSauces(req, res) {
  const product = new Product({
    userId: req.body.userId,
    name: req.body.name,
    manufacturer: req.body.manufacturer,
    description: req.body.description,
    mainPepper: req.body.mainPepper,
    imageUrl: req.body.imageUrl,
    heat: req.body.heat,
    likes: req.body.likes,
    dislikes: req.body.dislikes,
    usersLiked: req.body.usersLiked,
    usersDisliked: req.body.usersDisliked,
  });
  product
    .save()
    .then((res) => console.log("sauce saved", res))
    .catch((err) => console.log(err));
}

module.exports = { createSauces, getSauces };
