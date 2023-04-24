const { app, express } = require("./server");
const { saucesRouter } = require("./routes/saucesrouter");
const port = 3000;
const path = require("path");

// Database
require("./mongo");

// Controllers
const { createUser, logUser } = require("./users");

// Middleware
app.use(" /api/sauces", saucesRouter);

// Routes
app.post("/api/auth/signup", createUser);
app.post("/api/auth/login", logUser);

// Listen
app.use("/images", express.static(path.join(__dirname, "images")));
app.listen(port, () => console.log("listening on port " + port));
