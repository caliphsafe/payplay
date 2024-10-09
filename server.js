const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Stripe = require('stripe');
const stripe = Stripe('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'); // Use your live secret key here

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: 'http://localhost:8080' // Allow requests from your frontend
}));
app.use(bodyParser.json()); // Parse JSON requests

// Create Payment Intent endpoint
app.post('/create-payment-intent', async (req, res) => {
    const amount = 100; // amount in cents ($1.00)
    const currency = 'usd'; // or your desired currency

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
        });

        // Send the client secret to the front end
        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).send({ error: 'Failed to create payment intent' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
