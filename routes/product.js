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
router.post('/c', async (req, res) => {
    const { userType, userCategory } = req.body
  
      try {
            const product = await Product.find({ type: userType, category: userCategory })
            res.send(product);
     
    } catch (error) {
        res.status(500).send("Something went wrong")
        console.log(error);
    }
})




module.exports = router