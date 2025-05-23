const port = 8080;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listning.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

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
app.get("/listing", async (req, res) => {
  const allListings = await Listing.find();
  res.render("listings/index.ejs", { allListings });
});

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
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  res.render("listings/editfrom.ejs", { listing });
});

// Updating the listing
app.put("/listings/:id", async (req, res) => {
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
});

// Deleting Form
app.get("/listings/:id/delete", async (req, res) => {
  const { id } = req.params;
  let listing = await Listing.findById(id);
  res.render("listings/deleteform.ejs", { listing });
});

// Listing the Particular List in show.ejs from index.ejs
app.get("/listings/:id", async (req, res) => {
  const { id } = req.params;
  let listing = await Listing.findById(id);
  res.render("listings/show.ejs", { id, listing });
});

// Deleting the listing
app.post("/listing/:id", async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listing");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
