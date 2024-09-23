const express = require('express');
const router = express.Router();
const webhookHandler = require('../controller/webhookController'); // Adjust the path as necessary
const { validateVirtualAccount, validateDigitalPayment, validateCreditCard } = require('../middleware/validationMiddleware'); // Adjust the path as necessary

// Use the appropriate validation middleware before the webhook handler
router.post('/virtual-account', validateVirtualAccount, webhookHandler);
router.post('/digital-payment', validateDigitalPayment, webhookHandler);
router.post('/credit-card', validateCreditCard, webhookHandler);

module.exports = {
    router: router
};