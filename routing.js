const express = require('express');
// const cors = require("cors");

const User = require("./db")

const app = express();

app.use(express.json());
// app.use(cors);


app.get('/', (req,res) => {
    res.send("Home Page")
});

app.post("/register", async (req,res) => {
    console.log("Its coming here")
    const {name,email,password} = req.body

    const data = {
        name: name,
        email: email,
        password: password,
    }

    console.log(data, "data");
    

    await User.insertMany([data]);
})

app.get('/about', (req,res) => {
    res.send("About Page");
})

app.get('/contact', (req,res) => {
    res.send("Contact Page");
})

const PORT = 5000;
app.listen(PORT, () => {
    console.log("Server listening on Port:", PORT);
})