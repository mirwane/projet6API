require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

// Database
require("./mongo");

// Controllers
const { createUser, logUser } = require("./user");

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post("/api/auth/signup", createUser);
app.post("/api/auth/login", logUser);

// Listen
app.listen(port, () => console.log(`port http://localhost:${port}`));
