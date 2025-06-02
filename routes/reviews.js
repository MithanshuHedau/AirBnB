const express = require("express");
const router = express.Router({ mergeParams: true });

const Listing = require("../models/listning.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");

// ✅ Route: /listings/:id/reviews
router.post(
  "/reviews",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const listing = await Listing.findById(id);
    const newreview = new Review({ rating, comment });
    if (req.isAuthenticated() == true) {
      listing.reviews.push(newreview);
      await newreview.save();
      await listing.save();

      console.log("Review added successfully");
      req.flash("success", "Review added successfully!");
      req.flash("success", "New listing created successfully!");
      res.redirect(`/listings/${id}`);
    } else {
      req.flash("error", "You need to be logged in to add a review.");
      res.redirect("/login");
    }
  })
);

// ✅ Route: /listings/:id/deleteReview/:reviewId
router.post(
  "/deleteReview/:reviewId",
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    if (req.isAuthenticated() == true) {
      await Review.findByIdAndDelete(reviewId);
      await Listing.findByIdAndUpdate(id, {
        $pull: { reviews: reviewId },
      });

      console.log("Review deleted successfully");
      req.flash("error", "Review deleted successfully!");
      res.redirect(`/listings/${id}`);
    } else {
      req.flash("error", "You need to be logged in to delete a review.");
      res.redirect("/login");
    }
  })
);

module.exports = router;
