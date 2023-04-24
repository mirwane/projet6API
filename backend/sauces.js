const mongoose = require("mongoose");
const { unlink } = require("fs/promises");

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

function getSauce(req, res) {
  const { id } = req.params;
  return Product.findById(id);
}

function getSauceById(req, res) {
  getSauce(req, res)
    .then((product) => sendClientResponse(product, res))
    .catch((err) => res.status(500).send({ message: err }));
}

function createSauces(req, res) {
  const { body, file } = req;
  const { fileName } = file;
  const sauce = JSON.parse(body.sauce);
  const { userId, name, manufacturer, description, mainPepper, heat } = sauce;
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

function modifySauce(req, res) {
  const {
    params: { id },
  } = req;

  let payload;

  const hasNewImage = req.file != null;
  const paylod = makePayload(hasNewImage, req);

  Product.findByIdAndUpdate(id, payload)
    .then((product) => sendClientResponse(product, res))
    .catch((err) => res.status(500).send({ message: err }));
}

function deleteImage(product) {
  if (product == null) return;
  const imageToDelete = product.imageUrl.split("/images/")[1];
  unlink("images/" + imageToDelete);
}

function makePayload(hasNewImage, req) {
  if (!hasNewImage) return req.body;
  const payload = JSON.parse(req.body.sauce);
  payload.imageUrl = makeImageURL(req, req.file.filename);
  return payload;
}
function sendClientResponse(dbReponse, res) {
  if (product == null) {
    return res.status(404).send({ message: "Sauce not found" });
  } else {
    return Promise.resolve(res.status(200).send(product)).then(() => product);
  }
  function makeImageURL(req, file) {
    return req.protocol + "://" + req.get("host") + "/images/" + file.filename;
  }
}

function deleteSauce(req, res) {
  const { id } = req.params;

  Product.findByIdAndDelete(id)
    .then((product) => sendClientResponse(product, res))
    .then((item) => deleteImage(item))
    .then((res) => console.log("file delted", res))
    .catch((err) => res.status(500).send({ message: err }));
}

function deleteImage(product) {
  const { imageUrl } = product;
  const filename = imageUrl.split("/images/")[1];
  return unlink(`images/${filename}`).then(() => product);
}
function likeSauces(req, res) {
  const {like, useId } = req.body
  if (![1, -1, 0].includes(like)) return res.status(403).send({ message: "invalid"})
  
  getsauce(req, res)
  .then((product) => updateLike(product, like, userId))
  .catch((err) => res.status(500).send(err))

function updateVote(product, like, userId) {
  if (like --- 1 ) incrementLike(product, userId)
} 

function incrementLike(product, userId){
const {userLiked } = product
if (userLiked.includes(userId)) return
userLiked.push(userId) 
porudct.likes++
}

module.exports = {
  getSauces,
  getSauceById,
  createSauces,
  deleteSauce,
  modifySauce,
  likeSauces,
}