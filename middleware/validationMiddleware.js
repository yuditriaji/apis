function validateVirtualAccount(req, res, next) {
    const { externalID, bankCode, name, amount } = req.body;
    console.log('Validating Virtual Account:', { externalID, bankCode, name, amount }); // Log the fields being validated
    if (!externalID || !bankCode || !name || !amount) {
        return res.status(400).send('Missing required fields for Virtual Account payment');
    }
    next();
}

function validateDigitalPayment(req, res, next) {
    const { externalID, amount, phone, ewalletType } = req.body;
    console.log('Validating Digital Payment:', { externalID, amount, phone, ewalletType }); // Log the fields being validated
    if (!externalID || !amount || !ewalletType) {
        return res.status(400).send('Missing required fields for Digital Payment');
    }
    if (ewalletType.toUpperCase() === 'OVO' && !phone) {
        return res.status(400).send('Phone number is required for OVO payment');
    }
    next();
}

function validateCreditCard(req, res, next) {
    const { tokenID, externalID, amount } = req.body;
    console.log('Validating Credit Card:', { tokenID, externalID, amount }); // Log the fields being validated
    if (!tokenID || !externalID || !amount) {
        return res.status(400).send('Missing required fields for Credit Card payment');
    }
    next();
}

module.exports = {
    validateVirtualAccount,
    validateDigitalPayment,
    validateCreditCard
};
