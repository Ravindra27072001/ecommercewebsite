const mongoose = require("mongoose");


const usersSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

const User = mongoose.model("user", usersSchema);
// const User = new mongoose.model("User", usersSchema);

module.exports = User;