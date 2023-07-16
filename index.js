require('dotenv').config();
const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const path = require('path')


const User = require("./schemas/user");
const Cart = require("./schemas/cart");

const app = express();
app.use(express.json())
app.use(express.urlencoded())
app.use(bodyParser.json())
app.use(cors())



console.log(process.env.PORT);

const connectionStr = 'mongodb+srv://ecommercewebsite:Rathore123@cluster0.ggxs2nz.mongodb.net/?retryWrites=true&w=majority'


mongoose.connect(connectionStr);

mongoose.connection.on('error', error => {
    console.error(`could not connect to database, error = `, error.message)
    process.exit(1);
})

mongoose.connection.on('open', function() {
    console.error(`connected to database`)
})

app.use(express.static('public'));

app.use(function (req, res, next) {

    res.sendFile(path.join(process.cwd(), 'public', 'index.html'));

})




app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    console.log("efhdjfhbdf")
    console.log(email, password);

    try {
        const result = await User.findOne({ email, password });
        console.log("result",result);

        if (result == null) {
            console.log("object")
            res.status(401).json({
                message: "Invalid credentials"
            })
        }
        else {
            res.send({
                message: "Singin Successful",
                email: email,
            })
        }
    } catch (error) {
        res.status(401).json({
            staus: "FAILED",
            message: error.message
        })
    }

})

app.post('/register', async (req, res) => {

    const { name, email, password } = req.body;

    console.log(name, email, password)

    try {
        const user = new User({
            name,
            email,
            password,
        })

        const data = await User.findOne({ email });

        console.log("data",data);
        if (data == null) {
            User.insertMany([user]);
            res.send({
                message: "Register Successful",
            })
        }
        else {
            res.status(401).json({
                message: "Email Id already exist"
            })
        }

    } catch (error) {
        res.status(401).json({
            staus: "FAILED",
            message: error.message
        })
    }
})

app.post('/addToCart', async (req, res) => {
    const { id, email, itemNumber, title, price, discountPercentage, description, category, thumbnail, rating } = req.body;
    try {
        const data = await Cart.find({ id });
        if (data.length === 0) {
            const cart = new Cart({
                id,
                email,
                itemNumber,
                title,
                price,
                discountPercentage,
                description,
                category,
                thumbnail,
                rating
            })
            Cart.insertMany([cart]);
            res.send({
                message: "Added Successful",
            })
        }
        else {
            const data = await Cart.find({ id });
            // console.log(data);
            let number = ++data[0].itemNumber
            await Cart.updateOne({ id: id }, { itemNumber: number });
            res.send({
                message: "Added Successful",
            })
        }
    } catch (error) {
        res.status(401).json({
            staus: "FAILED",
            message: error.message
        })
    }
})


app.get("/cart/:email", async (req, res) => {
    // console.log(req.params['email']);

    try {
        const data = await Cart.find({ email: req.params['email'] });
        // console.log(data);
        res.send({
            response: data,
        })
    } catch (error) {
        res.status(401).json({
            staus: "FAILED",
            message: error.message
        })
    }
})

app.delete("/deleteCartItem/:id", async (req, res) => {
    // console.log(req.params['id']);
    try {
        const data = await Cart.deleteOne({ id: req.params['id'] });
        // console.log(data);
        console.log('User deleted successfully');
        res.send({
            message: "Deleted Successfully",
        })
    } catch (error) {
        // console.log(error);
        res.status(401).json({
            staus: "FAILED",
            message: error.message
        })
    }
})


console.log(process.env.PORT)


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Listening on port", PORT)
})