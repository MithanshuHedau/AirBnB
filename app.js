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
const listings = require("./routes/listing.js");
const reviews = require("./routes/reviews.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

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

/* ---------------------------------API ROUTES Start--------------------------------------*/

app.get("/", (req, res) => {
  res.render("listings/home.ejs");
});

/* -------------------------------------------Listing Router -------------------------------- */
app.use("/listings", listings);
/*----------------------------------------------------------------------------------------- */

/*--------------------------------------------------Reviews----------------------------------------------*/
app.use("/listings/:id", reviews);
/*-------------------------------------------------------------------------------------------- */

/* ---------------------------------API ROUTES End--------------------------------------*/

app.use((err, req, res, next) => {
  let { statuscode = 500, message = "Something went wrong" } = err;
  res.render("listings/error.ejs", { statuscode, message });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
