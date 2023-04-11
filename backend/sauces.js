const mongoose = require("mongoose");
const unlink = require("fs").promises.unlink;

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
  Product.find({}).then((products) => res.send(products));
}

function getSauceById(req, res) {
  const { id } = req.params;
  Product.findById(id)
    .then((product) => res.send(product))
    .catch((err) => console.log(err));
}

function createSauces(req, res) {
  const { body, file } = req;
  const { fileName } = file;
  const sauce = JSON.parse(body.sauce);
  const { userId, name, manufacturer, description, mainPepper, heat } = sauce;
  function makeImageURL(req, file) {
    return req.protocol + "://" + req.get("host") + "/images/" + file.filename;
  }
  const product = new Product({
    userId: userId,
    name: name,
    manufacturer: manufacturer,
    description: description,
    mainPepper: mainPepper,
    imageUrl: makeImageURL(req, file),
    heat: heat,
    likes: 0,
    dislikes: 0,
    usersLiked: [0],
    usersDisliked: [0],
  });
  product
    .save()
    .then((message) => {
      res.status(201).send({ message: message });
      return console.log("sauce saved", message);
    })
    .catch((err) => console.log(err));
}

function deleteSauce(req, res) {
  const { id } = req.params;

  Product.findByIdAndDelete(id)
    .then(deleteImage)
    .then((product) => res.status(200).send({ message: product }))
    .catch((err) => res.status(500).send({ message: err }));
}

function deleteImage(product) {
  const { imageUrl } = product;
  const filename = imageUrl.split("/images/")[1];
  return unlink(`images/${filename}`);
}

module.exports = { getSauces, getSauceById, createSauces, deleteSauce };
