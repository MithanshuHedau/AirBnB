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
    type: String,
    default:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    set: (v) =>
      v === ""
        ? "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
        : v,
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
});
const Listning = mongoose.model("Listning", listingSchema);
module.exports = Listning;
