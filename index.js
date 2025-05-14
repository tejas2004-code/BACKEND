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


const express = require('express');
const app = express();

app.use((req, res, next) => {
  // Set the Access-Control-Allow-Origin header to allow requests from your frontend origin
  res.setHeader('Access-Control-Allow-Origin', 'https://frontend-five-phi-97.vercel.app');
  // You might need to allow other headers and methods depending on your requests
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Your API routes here
app.get('/api/product/fetchproduct', (req, res) => {
  // ... your logic to fetch product data
  res.json({ message: 'Product data' });
});

// ... other routes

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});











app.use(express.json())
app.use(cors({
    origin: 'https://frontend-gamma-five-43.vercel.app',
    credentials: true
}));

app.use(express.static(path.join(__dirname, 'build')));

// app.get('/', function (req, res) {
//     res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
// });

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

// Root route handler
app.get('/', (req, res) => {
    res.json({ message: 'Backend is running' });
});


app.listen(port, () => {
    console.log(`E-commerce backend listening at http://localhost:${port}`)
})
