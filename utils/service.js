const admin = require('firebase-admin');
const serviceAccount = require('./serAcc.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://vous-31919.firebaseio.com"
    });
}

module.exports = admin;