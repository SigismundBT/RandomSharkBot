const admin = require('firebase-admin');
const serviceAccount = require('../json/2112.json');

function firebaseAdminInit () {
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    } else {
        admin.app();
    }
}
  
module.exports = firebaseAdminInit