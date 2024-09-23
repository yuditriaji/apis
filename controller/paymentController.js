const express = require('express');
const axios = require('axios');
const { validateVirtualAccount, validateDigitalPayment, validateCreditCard } = require('../middleware/validationMiddleware.js');

const router = express.Router();
const XENDIT_API_KEY = 'xnd_development_KPkOIxEpavd2bZPbwq5Bv8NK9BF8O53GqoEK2UQUDjsoWIeWHlsdAaM11V9aV70'; // Replace with your Xendit API key

async function createInvoice(req, res) {
    try {
        const { type, externalID, amount, phone, bankCode, name } = req.body;
        let requestData = {};

        console.log('Request Body here:', req.body); // Log the request body for debugging

        if (!type || !externalID || !amount) {
            console.error('Missing required fields:', { type, externalID, amount });
            return res.status(400).send('Missing required fields');
        }

        switch (type.toUpperCase()) {
            case 'BANK TRANSFER':
                requestData = {
                    type: type,
                    external_id: externalID,
                    amount: amount,
                    phone: phone,
                    bank_code: bankCode,
                    name: name,
                    currency: "IDR",
                    description: "description",
                    payment_method: {
                        reusability: "ONE_TIME_USE",
                        type: "VIRTUAL_ACCOUNT",
                        virtual_account: {
                            channel_code: bankCode,
                            channel_properties: {
                                customer_name: name,
                                expires_at: "2024-09-26T02:37:00Z"
                            }
                        }
                    }
                };
                break;
            case 'DIGITAL PAYMENT':
                requestData = {
                    amount: amount,
                    currency: "IDR",
                    description: "description",
                    payment_method: {
                        reusability: "ONE_TIME_USE",
                        type: "EWALLET",
                        ewallet: {
                            channel_code: "SHOPEEPAY",
                            channel_properties: {
                                success_return_url: "https://your-redirect-website.com/success"
                            }
                        }
                    }
                };
                break;
            // case 'CARD':
            //     requestData = {
            //         token_id: tokenID,
            //         external_id: externalID,
            //         amount
            //     };
            //     break;
            default:
                return res.status(400).send('Invalid payment method');
        }

        console.log('Request Data Here:', requestData);

        const response = await axios.post('https://api.xendit.co/payment_requests', requestData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${Buffer.from(XENDIT_API_KEY + ':').toString('base64')}`
            }
        });

        res.status(200).send(response.data);
    } catch (error) {
        console.error('Error creating invoice:', error.response ? error.response.data : error.message);
        res.status(500).send(error.response ? error.response.data : error.message);
    }
}

async function getPaymentMethods(req, res) {
    try {
        // Xendit does not have a direct endpoint to list all payment methods. You'll need to 
        // either display them manually or integrate with Xendit's APIs for each type.
        const paymentMethods = [
            { bankCode: 'OVO',id: 1, method: 'OVO', type: 'Digital Payment' },
            { bankCode: 'GOPAY',id: 2, method: 'GoPay', type: 'Digital Payment' },
            { bankCode: 'SHOPEEPAY',id: 3, method: 'ShopeePay', type: 'Digital Payment' },
            { bankCode: 'DANA',id: 4, method: 'DANA', type: 'Digital Payment' },
            { bankCode: 'BCA',id: 5, method: 'BCA Virtual Account', type: 'Bank Transfer' }, // For VA: Call bank list
            { bankCode: 'MANDIRI',id: 6, method: 'Mandiri Virtual Account', type: 'Bank Transfer' }, // For VA: Call bank list
            { bankCode: 'BNI',id: 7, method: 'BNI Virtual Account', type: 'Bank Transfer' }, // For VA: Call bank list
            { bankCode: 'BRI',id: 8, method: 'BRI Virtual Account', type: 'Bank Transfer' }, // For VA: Call bank list
            { bankCode: 'PERMATA',id: 9, method: 'Permata Virtual Account', type: 'Bank Transfer' }, // For VA: Call bank list
            { bankCode: 'CREDIT_CARD',id: 10, method: 'Credit Card', type: 'Card' }
        ];
        res.json(paymentMethods);
    } catch (error) {
        console.error('Error fetching payment methods:', error.response ? error.response.data : error.message);
        res.status(500).send('Error fetching payment methods');
    }
}

async function simulatePayment(req, res) {
    const { paymentMethodId, amount, externalID } = req.body; // Expecting paymentMethodId, amount, and externalID in the request body

    try {
        const response = await axios.post(`https://api.xendit.co/v2/payment_methods/${paymentMethodId}/payments/simulate`, {
            amount: amount,
            external_id: externalID,
            // Add any other required fields based on the API documentation
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${Buffer.from(XENDIT_API_KEY + ':').toString('base64')}`
            }
        });

        res.status(200).send(response.data);
    } catch (error) {
        console.error('Error simulating payment:', error.response ? error.response.data : error.message);
        res.status(500).send(error.response ? error.response.data : error.message);
    }
}

// Define routes and apply validation middleware
router.post('/create-invoice', (req, res, next) => {
    const { type } = req.body;
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

module.exports = {
    createInvoice,
    getPaymentMethods,
    simulatePayment
};
