const { app, express } = require("./server");
const port = 3000;
const path = require("path");

// Database
require("./mongo");

// Controllers
const { createUser, logUser } = require("./users");
const {
  getSauces,
  getSauceById,
  createSauces,
  deleteSauce,
} = require("./sauces");

// Middleware
const { upload } = require("./middleware/mulder");
const { authentificatUser } = require("./middleware/auth");

// Routes
app.post("/api/auth/signup", createUser);
app.post("/api/auth/login", logUser);
app.get("/api/sauces", authentificatUser, getSauces);
app.post(
  "/api/sauces",
  authentificatUser,
  upload.single("image"),
  createSauces
);
app.get("/api/sauces/:id", authentificatUser, getSauceById);
app.delete("/api/sauces/:id", authentificatUser, deleteSauce);

// Listen
app.use("/images", express.static(path.join(__dirname, "images")));
app.listen(port, () => console.log("listening on port " + port));
