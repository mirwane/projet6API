const express = require("express");
const saucesRouter = express.Router();
const { upload } = require("../middleware/mulder");
const { authentificatUser } = require("../middleware/auth");
const {
  getSauces,
  getSauceById,
  createSauces,
  deleteSauce,
  modifySauce,
  likeSauces,
} = require("../sauces");

saucesRouter.get("/api/sauces", authentificatUser, getSauces);
saucesRouter.post(
  "/api/sauces",
  authentificatUser,
  upload.single("image"),
  createSauces
);
saucesRouter.get("/api/sauces/:id", authentificatUser, getSauceById);
saucesRouter.delete("/api/sauces/:id", authentificatUser, deleteSauce);
saucesRouter.put(
  "/api/sauces/:id",
  authentificatUser,
  upload.single("image"),
  modifySauce
);
saucesRouter.post("/api/sauces/:id/like", authentificatUser, likeSauces);

module.exports = { saucesRouter };
