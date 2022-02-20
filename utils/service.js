const admin = require('firebase-admin');
const serviceAdmin = require('./config');

const serAcc = admin.initializeApp(serviceAdmin.serviceConfig);

module.exports = serAcc;