const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionOptions = {
  secret: "mysuper secret secret string",
  resave: false,
  saveUninitialized: true,
};

// ------------------------------------Session & Connect Flash MiddleWare Start---------------------------------
app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) => {
  res.locals.messages = req.flash("success");
  res.locals.errors = req.flash("error");
  next();
});
// ------------------------------------Session & Connect Flash MiddleWare End---------------------------------

app.get("/register", (req, res) => {
  const { name } = req.query;
  if (!name || name.trim() === "") {
    req.session.name = "Anonymous";
    req.flash("error", "Please provide a name");
  } else {
    req.session.name = name;
    req.flash("success", "User registered successfully");
  }
  res.redirect("/hello");
});

app.get("/hello", (req, res) => {
  res.render("page.ejs", {
    name: req.session.name,
  });
});

// app.get("/reqcount", (req, res) => {
//   if (req.session.count) {
//     req.session.count++;
//   } else {
//     req.session.count = 1;
//   }
//   res.send(`You sent a request ${req.session.count} times`);
// });

app.get("/", (req, res) => {
  console.dir(req.cookies);
  res.send("Welcome to the Classroom Server");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
