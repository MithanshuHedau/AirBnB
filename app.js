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

// ---------------------------------API ROUTES--------------------------------------

app.get("/", (req, res) => {
  res.render("listings/home.ejs");
});

// Listing All Lists in index.ejs
app.get(
  "/listing",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
  })
);

// Creating a new listing
app.get("/listings/newlist", (req, res) => {
  res.render("listings/form.ejs");
});

// Posting the new listing to the database
app.post("/listings", (req, res) => {
  const { title, description, image, location, country, price } = req.body;
  const newData = new Listing({
    title: title,
    description: description,
    image: image,
    location: location,
    country: country,
    price: price,
  });
  newData
    .save()
    .then((res) => {
      console.log("Data saved successfully");
    })
    .catch((err) => {
      console.log("Error saving data", err);
    });
  res.redirect("/listing");
});

// Edit Form Rendering
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/editfrom.ejs", { listing });
  })
);

// Updating the listing
app.put(
  "/listings/:id",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const { title, description, image, location, country, price } = req.body;
    let updatedData = await Listing.findByIdAndUpdate(id, {
      title: title,
      description: description,
      image: image,
      location: location,
      country: country,
      price: price,
    });
    res.redirect(`/listings/${id}`);
  })
);

// Deleting Form
app.get(
  "/listings/:id/delete",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/deleteform.ejs", { listing });
  })
);

// Listing the Particular List in show.ejs from index.ejs
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { id, listing });
  })
);

// Deleting the listing
app.post(
  "/listing/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listing");
  })
);

// app.all("*", (req, res, next) => {
//   next(new ExpressError(404, "Page Not Found"));
// });
app.post(
  "/listings/:id/reviews",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const { rating, comment } = req.body;
    let listing = await Listing.findById(id);
    const newreview = new Review({ rating, comment });
    listing.reviews.push(newreview);
    await newreview.save();
    await listing.save();
    console.log("Review added successfully");
    res.redirect(`/listings/${id}`);
  })
);

// Deleting the review
app.post(
  "/listings/:listingId/deleteReview/:reviewId",
  wrapAsync(async (req, res) => {
    const { listingId, reviewId } = req.params;

    try {
      await Review.findByIdAndDelete(reviewId);
      await Listing.findByIdAndUpdate(listingId, {
        $pull: { reviews: reviewId },
      });
      console.log("Review deleted successfully");
      res.redirect(`/listings/${listingId}`);
    } catch (err) {
      console.error("Error deleting review:", err);
      res.status(500).send("Something went wrong");
    }
  })
);

app.use((err, req, res, next) => {
  let { statuscode = 500, message = "Something went wrong" } = err;
  res.render("listings/error.ejs", { statuscode, message });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
