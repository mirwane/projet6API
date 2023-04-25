const express = require("express");
const {
  getSauces,
  getSauceById,
  createSauces,
  deleteSauce,
  modifySauce,
  likeSauces,
} = require("../controllers/sauces");

const { authentificatUser } = require("../middleware/auth");
const { upload } = require("../middleware/mulder");
const saucesRouter = express.Router();

const bodyParser = require("body-parser");

saucesRouter.use(bodyParser.json());
saucesRouter.use(authentificatUser);

saucesRouter.get("/", getSauces);
saucesRouter.post("/", upload.single("image"), createSauces);
saucesRouter.get("/:id", getSauceById);
saucesRouter.delete("/:id", deleteSauce);
saucesRouter.put("/:id", upload.single("image"), modifySauce);
saucesRouter.post("/:id/like", likeSauces);

module.exports = { saucesRouter };
