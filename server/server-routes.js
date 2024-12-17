const express = require("express");
const router = express.Router();
const authenticate = require('./middleware/auth.js');
const todoRoutes = require("./api/todos/todos.routes.js");
const userRoutes = require("./api/users/user.routes.js");


router.use("/todos", authenticate, todoRoutes);
router.use("/users", userRoutes);

module.exports = router;