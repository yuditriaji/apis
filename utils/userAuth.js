const firebase = require('firebase');
const config = require('./config');
const firestore = firebase.firestore();

const generateUserDocument = async (req, res, user, additionalData) => {
    if (!user) return;
    const userRef = firestore.doc(`users/${user.uid}`);
    const snapshot = await userRef.get();
    const data = req.body;
    if (!snapshot.exists) {
    //   const { email, displayName, lastName, phoneNumber, photoURL, provinceId, cityId } = user;
      try {
        await userRef.set(data);
      } catch (error) {
        console.error("Error creating user document", error);
      }
    }
    return getUserDocument(user.uid);
};

const getUserDocument = async uid => {
    if (!uid) return null;
    try {
        const userDocument = await firestore.doc(`users/${uid}`).get();
        return {
        uid,
        ...userDocument.data()
        };
    } catch (error) {
        console.error("Error fetching user", error);
    }
};

module.exports = {generateUserDocument, getUserDocument};