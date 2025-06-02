const express = require("express");
const router = express.Router();
const Listing = require("../models/listning.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
  })
);

// Creating a new listing
router.get("/newlist", (req, res) => {
  if (req.isAuthenticated() == true) {
    res.render("listings/form.ejs");
  } else {
    req.flash("error", "You need to be logged in to create a listing.");
    res.redirect("/login");
  }
});

// Posting the new listing to the database
router.post("/", (req, res, next) => {
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
  req.flash("success", "New listing created successfully!");
  res.redirect("/listings");
});

// Edit Form Rendering
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (req.isAuthenticated() == true) {
      res.render("listings/editfrom.ejs", { listing });
    } else {
      req.flash("error", "You need to be logged in to edit a listing.");
      res.redirect("/login");
    }
  })
);

// Updating the listing
router.put(
  "/:id",
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
    req.flash("success", `${title} updated successfully!`);
    res.redirect(`/listings/${id}`);
  })
);

// Deleting Form
router.get(
  "/:id/delete",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    let listing = await Listing.findById(id);
    if (req.isAuthenticated() == true) {
      res.render("listings/deleteform.ejs", { listing });
    } else {
      req.flash("error", "You need to be logged in to delete a listing.");
      res.redirect("/login");
    }
  })
);

// Listing the Particular List in show.ejs from index.ejs
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { id, listing });
  })
);

// Deleting the listing
router.post(
  "/:id",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("error", `Listing deleted successfully!`);
    res.redirect("/listings");
  })
);
module.exports = router;
