const mongoose = require("mongoose");

const jsonDataSchema = new mongoose.Schema({
    "id": String,
    "title": String,
    "description": String,
    "price": String,
    "discountPercentage": String,
    "rating": String,
    "stock": String,
    "brand": String,
    "category": String,
    "thumbnail": String,
    "images": Array,
})

const JsonData = mongoose.model("jsonData", jsonDataSchema);

module.exports = JsonData;