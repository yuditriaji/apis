module.exports = (req, res) => {
    const { id, status, external_id, amount, payment_method } = req.body;

    // Log the webhook payload for debugging
    console.log('Received webhook:', req.body);

    // Handle the webhook notification
    if (status === 'SETTLED') {
        // Update your database or perform actions based on the settled invoice
        console.log(`Invoice ${external_id} is settled with amount ${amount} using ${payment_method}`);
        // Example: updateInvoiceStatus(external_id, 'SETTLED');
    }

    // Respond to Xendit to acknowledge receipt of the webhook
    res.status(200).send('Webhook received');
};
