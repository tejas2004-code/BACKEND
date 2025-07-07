const connectToMongo = require('./config');
const bodyParser = require('body-parser')
const express = require('express')
const cors = require('cors')
const path = require('path');

const auth = require('./routes/auth');
const cart = require('./routes/cart')
const wishlist = require('./routes/wishlist')
const product = require('./routes/product')
const review = require('./routes/review')
const paymentRoute = require('./routes/paymentRoute')
const forgotPassword = require('./routes/forgotPassword')
const AdminRoute = require('./routes/Admin/AdminAuth')
const dotenv = require('dotenv');
dotenv.config()

connectToMongo();

const port = 5000

const app = express()

// create application/json parser
app.use(bodyParser.json())
// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.urlencoded({ extended: true }))



app.use(express.json())
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://shopstop-five.vercel.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// Add a root route for better UX
app.get('/', (req, res) => {
    res.json({ 
        message: 'E-commerce Backend API is running!',
        status: 'success',
        timestamp: new Date().toISOString(),
        endpoints: {
            auth: '/api/auth',
            products: '/api/product',
            cart: '/api/cart',
            wishlist: '/api/wishlist',
            reviews: '/api/review',
            admin: '/api/admin',
            payments: '/api',
            password: '/api/password'
        }
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Available Routes
app.use('/api/auth', auth)
app.use('/api/product', product)
app.use('/api/cart', cart)
app.use('/api/wishlist', wishlist)
app.use('/api/review', review)
app.use('/api/admin', AdminRoute)
// payment route
app.use('/api', paymentRoute)
// forgot Password route
app.use('/api/password', forgotPassword)

// Export the app for Vercel serverless functions
module.exports = app;

// Only start the server if not in a serverless environment
if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'vercel') {
    app.listen(port, () => {
        console.log(`E-commerce backend listening at http://localhost:${port}`)
    });
}
