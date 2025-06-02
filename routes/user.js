const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({
        email: email,
        username: username,
      });
      const registeredUser = await User.register(newUser, password);
      req.login(registeredUser, (err) => {  
        if (err) {
          console.error("Login error after registration:", err);
          req.flash("error", "Login failed. Please try again.");
          return res.redirect("/signup");
        }
        console.log("User registered successfully:", registeredUser); // for debugging
        req.flash("success", "Welcome to Wanderlust , Signup Done 🥳 ");
        res.redirect("/");
      });
    } catch (e) {
      console.log("Signup error:", e.message); // for debugging

      if (e.name === "UserExistsError") {
        req.flash("error", "Username already exists. Please log in.");
        return res.redirect("/login");
      }

      req.flash("error", "Signup failed. Please try again.");
      res.redirect("/signup");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", "welcome Back !!");
    res.redirect("/");
  }
);

router.get("/logout", (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    req.flash("success", "You are already logged out.");
    return res.redirect("/");
  }

  req.logout((err) => {
    if (err) {
      console.error("Logout error:", err);
      req.flash("error", "Logout failed. Please try again.");
      return res.redirect("/");
    }
    req.flash("success", "Logged out successfully!");
    res.redirect("/");
  });
});

router.get("/profile", (req, res) => {
  if (req.isAuthenticated() == true) {
    let username = req.user.username;
    let email = req.user.email;
    console.log(req.user);
    res.render("users/profile.ejs", { username, email });
  } else {
    req.flash("error", "You need to be logged in to view your profile.");
    res.redirect("/login");
  }
});

module.exports = router;
