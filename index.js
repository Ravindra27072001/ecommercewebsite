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
app.use(express.static(path.join(process.cwd(), 'public')));





// console.log(process.env);

const {NODE_ENV, DB_HOST, DB_NAME, DB_USER, DB_PASSWORD} = process.env

console.log(NODE_ENV,DB_USER,DB_HOST,DB_NAME,DB_PASSWORD)


// const connectionStr = NODE_ENV === 'development' ? 'mongodb+srv://ecommercewebsite:Rathore123@cluster0.ggxs2nz.mongodb.net/?retryWrites=true&w=majority'

const connectionStr = NODE_ENV === 'development' ? `mongodb://${DB_HOST}/${DB_NAME}` : `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/?retryWrites=true&w=majority`

mongoose.connect(connectionStr)

mongoose.connection.on('error', error => {
    console.error(`could not connect to database, error = `, error.message)
    process.exit(1);
})

mongoose.connection.on('open', function () {
    console.error(`successfully connected to database`)
    // console.log(process.env);
})



// app.use(function(req, res, next) {
//     console.log(req.url, "req.url")
//     var filePath = path.join(process.cwd(), 'public', 'index.html');
  
//     if (path.extname(filePath) === '.js') {
//       res.set('Content-Type', 'text/javascript');
//     }
  
//     res.sendFile(filePath);
//   });


app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    console.log("efhdjfhbdf")
    console.log(email, password);

    try {
        const result = await User.findOne({ email, password });
        console.log("result", result);

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

app.post('/api/register', async (req, res) => {

    const { name, email, password } = req.body;

    console.log(name, email, password)

    try {
        const user = new User({
            name,
            email,
            password,
        })

        const data = await User.findOne({ email });

        console.log("data", data);
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

app.post('/api/addToCart', async (req, res) => {
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


app.get("/api/cart/:email", async (req, res) => {
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

app.delete("/api/deleteCartItem/:id", async (req, res) => {
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



app.use(function (req, res, next) {

    console.log(req.url);
    res.sendFile(path.join(process.cwd(), 'public', 'index.html'));

})

console.log(process.env.PORT)


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("Listening on port", PORT)
})