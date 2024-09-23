const express = require('express');
const { addItemToCart, getCartItems, deleteCartItem } = require('../controller/cartController');
const router = express.Router();

router.post('/addtocart', (req, res) => addItemToCart(req, res));
router.get('/getcartitems', (req, res) => getCartItems(req, res));
router.delete('/deletecartitem/:id', (req, res) => deleteCartItem(req, res));

module.exports = {
    router: router
};