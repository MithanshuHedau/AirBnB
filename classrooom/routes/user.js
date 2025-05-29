const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("List of Users");
});

router.get("/:id", (req, res) => {
  console.log("get user by id");
  res.send("user id ");
});

router.post("/", (req, res) => {
  console.log("create user");
  res.send("User created");
});

router.delete("/:id", (req, res) => {
  console.log("delete user by id");
  res.send("User deleted");
});

module.exports = router;
