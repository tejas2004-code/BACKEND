const express = require('express');
const router = express.Router();
const Product = require('../models/Product')

// to fetch all products
router.get('/fetchproduct', async (req, res) => {
    try {

        const product = await Product.find()
        res.send(product)
        console.log(product);
    }
    catch (error) {

        res.status(500).send("Something went wrong")
    }
})
// To get Single product
router.get('/fetchproduct/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        
        res.send(product)
    } catch (error) {
        res.status(500).send("Something went wrong")
    }
})
// to get products for single category
router.post('/fetchproduct/type', async (req, res) => {
    const { userType } = req.body;
    console.log(userType);
   
    try {
        const product = await Product.find({ type: userType })
        res.send(product)
    } catch (error) {
        res.status(500).send("Something went wrong")
    }
})
// to get products category wise
router.get('/category/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const products = await Product.find({ category: { $regex: new RegExp(category, 'i') } }); // case-insensitive
        res.json(products);
    } catch (error) {
        console.error('Error fetching products by category:', error.message);
        res.status(500).json({ message: 'Server error fetching category products' });
    }
});




module.exports = router
