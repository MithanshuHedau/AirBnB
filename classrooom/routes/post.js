const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("List of post");
});

router.get("/:id", (req, res) => {
  console.log("get post by id");
  res.send("post id ");
});

router.post("/", (req, res) => {
  console.log("create post");
  res.send("post created");
});

router.delete("/:id", (req, res) => {
  console.log("delete post by id");
  res.send("post deleted");
});

module.exports = router;
