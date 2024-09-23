const express = require('express');
const { createInvoice, getPaymentMethods, simulatePayment } = require('../controller/paymentController.js');
const { validateVirtualAccount, validateDigitalPayment, validateCreditCard } = require('../middleware/validationMiddleware.js');

const router = express.Router();

// Define routes and apply validation middleware
router.post('/create-invoice', (req, res, next) => {
    console.log('Request Body Route:', req.body); // Log the request body for debugging
    console.log('Name:', req.body.name); // Log the request body for debugging

    const { type } = req.body;
    if (!type) {
        return res.status(400).send('Payment type is required');
    }

    switch (type.toUpperCase()) {
        case 'BANK TRANSFER':
            return validateVirtualAccount(req, res, next);
        case 'DIGITAL PAYMENT':
            return validateDigitalPayment(req, res, next);
        case 'CARD':
            return validateCreditCard(req, res, next);
        default:
            return res.status(400).send('Invalid payment method');
    }
}, createInvoice);

router.get('/payment-methods', getPaymentMethods);
router.post('/simulate-payment', simulatePayment);

module.exports = {
    router: router
};
