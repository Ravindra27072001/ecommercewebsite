const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    id: String,
    email: String,
    itemNumber: String,
    title: String,
    price: String,
    discountPercentage:String,
    description: String,
    category: String,
    thumbnail: String,
    rating: String
});

const Cart = mongoose.model("cart", cartSchema)

module.exports = Cart;