if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const port = 8080;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listning.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/review.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const MONGO_URL =
  "mongodb+srv://hedaumithanshu:hedaumithanshu@cluster0.om5rn.mongodb.net/wanderLust";
``;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

main()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });
async function main() {
  await mongoose.connect(MONGO_URL);
}

const sessionOptions = {
  secret: "MysuperSecretCode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 1 day
    maxAge: 7 * 24 * 60 * 60 * 1000, // 1 day
    httpOnly: true, // Helps prevent XSS attacks
  },
};

app.use(session(sessionOptions));
app.use(flash());

// Authentication setup Via Passport.js
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user; // Make currentUser available in all templates
  next();
});

app.get("/", (req, res) => {
  res.render("listings/home.ejs");
});
/* ---------------------------------API ROUTES Start--------------------------------------*/

app.use("/listings", listingsRouter);
app.use("/listings/:id", reviewsRouter);
app.use("/", userRouter);

/* ---------------------------------API ROUTES End--------------------------------------*/

app.use((err, req, res, next) => {
  let { statuscode = 500, message = "Something went wrong" } = err;
  res.render("listings/error.ejs", { statuscode, message });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
