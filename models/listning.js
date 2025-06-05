const mongoose = require("mongoose");
const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  // filepath: c:\Users\mitha\OneDrive\Desktop\Node Js All Projects\AirBnb_Mern_Project\models\listning.js
  image: {
    url: String,
    filename: String,
  },
  price: {
    type: Number,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});
const Listning = mongoose.model("Listning", listingSchema);
module.exports = Listning;
