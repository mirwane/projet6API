const mongoose = require("mongoose");
const { unlink } = require("fs/promises");

const productSchema = new mongoose.Schema({
  userId: String,
  name: String,
  manufacturer: String,
  description: String,
  mainPepper: String,
  imageUrl: String,
  heat: { type: Number, min: 1, max: 5 },
  likes: Number,
  dislikes: Number,
  usersLiked: [String],
  usersDisliked: [String],
});
const Product = mongoose.model("Product", productSchema);

function getSauces(req, res) {
  Product.find({})
    .then((products) => res.send(products))
    .catch((error) => res.status(500).send(error));
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

function deleteSauce(req, res) {
  const { id } = req.params;
  Product.findByIdAndDelete(id)
    .then((product) => sendClientResponse(product, res))
    .then((item) => deleteImage(item))
    .then((res) => console.log("FILE DELETED", res))
    .catch((err) => res.status(500).send({ message: err }));
}

function modifySauce(req, res) {
  const {
    params: { id },
  } = req;

  const hasNewImage = req.file != null;
  const payload = makePayload(hasNewImage, req);

  Product.findByIdAndUpdate(id, payload)
    .then((dbResponse) => sendClientResponse(dbResponse, res))
    .then((product) => deleteImage(product))
    .then((res) => console.log("FILE DELETED", res))
    .catch((err) => console.error("PROBLEM UPDATING", err));
}

function deleteImage(product) {
  if (product == null) return;
  const imageToDelete = product.imageUrl.split("/").at(-1);
  return unlink("images/" + imageToDelete);
}

function makePayload(hasNewImage, req) {
  if (!hasNewImage) return req.body;
  const payload = JSON.parse(req.body.sauce);
  payload.imageUrl = makeImageUrl(req, req.file.fileName);
  return payload;
}

function sendClientResponse(product, res) {
  if (product == null) {
    console.log("NOTHING TO UPDATE");
    return res.status(404).send({ message: "Object not found in database" });
  }
  console.log("ALL GOOD, UPDATING:", product);
  return Promise.resolve(res.status(200).send(product)).then(() => product);
}

function makeImageUrl(req, fileName) {
  return req.protocol + "://" + req.get("host") + "/images/" + fileName;
}

function createSauces(req, res) {
  const { body, file } = req;
  const { fileName } = file;
  const sauce = JSON.parse(body.sauce);
  const { name, manufacturer, description, mainPepper, heat, userId } = sauce;

  const product = new Product({
    userId: userId,
    name: name,
    manufacturer: manufacturer,
    description: description,
    mainPepper: mainPepper,
    imageUrl: makeImageUrl(req, fileName),
    heat: heat,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  product
    .save()
    .then((message) => res.status(201).send({ message }))
    .catch((err) => res.status(500).send(err));
}

function likeSauces(req, res) {
  const { like, userId } = req.body;
  if (![1, -1, 0].includes(like))
    return res.status(403).send({ message: "Invalid like value" });

  getSauce(req, res);
  Product.findById(req.params.id)
    .then((product) => updateVote(product, like, userId, res))
    .then((pr) => pr.save())
    .then((prod) => sendClientResponse(prod, res))
    .catch((err) => res.status(500).send(err));
}

function updateVote(product, like, userId, res) {
  if (like === 1 || like === -1) return incrementVote(product, userId);
  return resetVote(product, userId, res);
}

function resetVote(product, userId, res) {
  const { userLiked, userDisliked } = product;
  if ([userLiked, userDisliked].every((arr) => arr.includes(userId)))
    return Promise.reject("User has voted");

  if (![userLiked, userDisliked].some((arr) => arr.includes(userId)))
    return Promise.reject("User has not voted");

  if (userLiked.includes(userId)) {
    --product.likes;
    product.userLiked = product.userLiked.filter((id) => id !== userId);
  } else {
    --product.dislikes;
    product.userDisliked = product.userDisliked.filter((id) => id !== userId);
  }

  let arrayToUpdate = userLiked.includes(userId) ? userLiked : userDisliked;
  arrayToUpdate = arrayToUpdate.filter((id) => id !== userId);
  return product;
}

function incrementVote(product, userId, like) {
  const { userLiked, userDisliked } = product;
  const voteArray = like === 1 ? userLiked : userDisliked;
  if (voteArray.includes(userId)) return product;
  voteArray.push(userId);

  like === 1 ? ++product.likes : ++product.dislikes;
  return product;
}

module.exports = {
  getSauce,
  getSauces,
  sendClientResponse,
  getSauceById,
  createSauces,
  deleteSauce,
  modifySauce,
  likeSauces,
};
