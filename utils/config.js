const admin = require('firebase-admin');
var serviceAccount = require("./serAcc.json");

const firebaseConfig  = {
    apiKey: "AIzaSyA5JEM2O2zwONPE1hnhL-xb7pNeFGtmRH0",
    authDomain: "vous-31919.firebaseapp.com",
    databaseURL: "https://vous-31919.firebaseio.com",
    projectId: "vous-31919",
    storageBucket: "vous-31919.appspot.com",
    messagingSenderId: "323318575674",
    appId: "1:323318575674:web:688597f797e55dac4bbb03",
    measurementId: "G-S0NRNXFT3H"
};

const serviceConfig = {
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://vous-31919.firebaseio.com"
};


module.exports = {firebaseConfig, serviceConfig};
// export default firebaseConfig;

