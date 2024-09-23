const { firestore } = require('../utils/config');
const admin = require('firebase-admin');

async function addItemToCart(req, res) {
    try {
        const item = req.body;
        if (!item || Object.keys(item).length === 0) {
            console.error('Request body is empty');
            return res.status(400).send('Request body is empty');
        }
        const description = `T-Shirt ${item.colorDescription} ${item.material}`;
        const cartItem = {
            description: description,
            blobImage: item.blobImage || null,
            material: item.material || '',
            images: item.images || [], // Array of images
            size: item.size || '',
            quantity: item.quantity || 1,
            texts: item.texts || [], // Array of text values
            textFontSizes: item.textFontSizes || [], // Array of font sizes
            textFontFamilies: item.textFontFamilies || [], // Array of font families
            colorHexCode: item.colorHexCode || '',
            colorDescription: item.colorDescription || '',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            totalPrice: item.totalPrice || 0
        };

        const docRef = await firestore.collection('cart').add(cartItem);
        console.log('Item added to cart with ID: ', docRef.id);
        console.log('Item: ', cartItem);
        res.status(200).send({ id: docRef.id });
    } catch (error) {
        console.error('Error adding item to cart: ', error);
        res.status(500).send('Error adding item to cart');
    }
}

async function getCartItems(req, res) {
    try {
        const cartSnapshot = await firestore.collection('cart').get();
        const cartItems = cartSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).send(cartItems);
        console.log('Cart items: ', cartItems);
    } catch (error) {
        console.error('Error fetching cart items: ', error);
        res.status(500).send('Error fetching cart items');
    }
}

async function deleteCartItem(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            console.error('No ID provided');
            return res.status(400).send('No ID provided');
        }

        const docRef = firestore.collection('cart').doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            console.error('No such document with ID: ', id);
            return res.status(404).send('No such document');
        }

        await docRef.delete();
        console.log('Item deleted from cart with ID: ', id);
        res.status(200).send({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error('Error deleting item from cart: ', error);
        res.status(500).send('Error deleting item from cart');
    }
}

module.exports = {
    addItemToCart,
    getCartItems,
    deleteCartItem
};