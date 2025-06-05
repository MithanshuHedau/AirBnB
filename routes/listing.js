const express = require("express");
const router = express.Router();
const Listing = require("../models/listning.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

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
router.post(
  "/",
  upload.single("image"),
  wrapAsync(async (req, res) => {
    const { title, description, location, country, price } = req.body;

    const newListing = new Listing({
      title,
      description,
      image: {
        url: req.file.path,
        filename: req.file.filename,
      },
      location,
      country,
      price,
    });

    await newListing.save();

    req.flash("success", "New listing created successfully!");
    res.redirect("/listings");
  })
);

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
  upload.single("image"),
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const { title, description, price, location, country } = req.body;

    const listing = await Listing.findById(id);

    listing.title = title;
    listing.description = description;
    listing.price = price;
    listing.location = location;
    listing.country = country;

    // If a new image is uploaded
    if (req.file) {
      listing.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }

    await listing.save();

    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${listing._id}`);
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
