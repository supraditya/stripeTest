if (process.env.NODE_ENV !== 'production') {
    // Load is no longer a function, use config instead
    require('dotenv').config()
}
const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    // const stripePublicKey = process.env.STRIPE_PUBLIC_KEY
    // console.log(stripeSecretKey)
    // console.log(stripePublicKey)

// Cross origin resource sharing
const cors = require("cors")
const express = require("express")
const stripe = require("stripe")(stripeSecretKey)

// const uuid = require("uuid/v4")
const { v4: uuidv4 } = require('uuid');
const app = express();

// Middleware
app.use(express.json())
app.use(cors())

// Routes
app.get("/", (req, res) => {
    res.send("It works!")
});

app.post("/payment", (req, res) => {

    // Pass a token from frontend (All prod +billing in, anything you need really)
    const { product, token } = req.body;
    console.log("PRODUCT:", product);
    console.log("PRICE:", product.price);

    // In order to make sure that the user is not charged twice for the same product
    const idempontencyKey = uuid()

    return stripe.customers.create({
            email: token.email,
            source: token.id
        }).then(customer => {
            // If promise is successful and a customer is returned, proceed to charge them

            stripe.charges.create({
                amount: product.price,
                currency: 'inr',
                source: 'tok_visa',
                customer: customer.id,
                receipt_email: token.email,
                description: `Purchase of ${product.name}`,
                shipping: {
                    // Using stripe card
                    name: token.card.name,
                    address: {
                        country: token.card.address_country
                    }
                }
            }, { idempontencyKey })
        }).then(result => {
            res.status(200).json(result)
            console.log("Charge Successful")
        })
        .catch(err => {
            console.log(err)
            console.log("Charge failed")
        })
})

// Listen
app.listen(8282, () => console.log("Listening on port 8282 (http://localhost:8282/)"))