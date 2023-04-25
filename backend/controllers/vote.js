const { getSauce, sendClientResponse } = require("./sauces");

function likeSauces(req, res) {
  const { like, userId } = req.body;
  if (![1, -1, 0].includes(like))
    return res.status(403).send({ message: "Invalid like value" });

  getSauce(req, res)
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

module.exports = { likeSauces };
