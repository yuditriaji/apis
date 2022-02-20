const firebase = require('../utils/db');
const config = require('../utils/config');
const User = require('../model/User');
const { generateUserDocument } = require('../utils/userAuth');
const auth = firebase.auth();
const admin = require('../utils/service');
const firestore = admin.firestore();

const addUser = async (req, res, user) => {
    try{
        await auth.createUserWithEmailAndPassword(req.body.email, req.body.password);
        // const data = req.body;
        // await firestore.collection('users').doc().set(data);
        // const snapshot = await firestore.collection('users').get();
        // snapshot.forEach((doc) => {
        //     console.log(doc.id, '=>', doc.data());
        // });
        if (!user) return;
        // const userRef = firestore.collection(`users/${user.uid}`).doc();
        const snapshot = await userRef.get();
        const data = req.body;
        if (!snapshot.exists) {
        //   const { email, displayName, lastName, phoneNumber, photoURL, provinceId, cityId } = user;
          try {
            await userRef.set(data);
            res.send('Record saved successfully');
          } catch (error) {
            console.error("Error creating user document", error);
          }
        }
        return getUserDocument(user.uid);
    } catch(error){
        return res.status(400).send(error.message)
    }
}

const createUser = async (req,res) => {
    admin
    .auth()
    .createUser({
        email: req.body.email,
        emailVerified: false,
        phoneNumber: req.body.phoneNumber,
        password: req.body.password,
        displayName: req.body.displayName,
        lastName: req.body.lastName,
        cityId: req.body.cityId,
        provinceId: req.body.provinceId,
        photoURL: 'http://www.example.com/12345678/photo.png',
        disabled: false,
    })
    .then((userRecord) => {
        // See the UserRecord reference doc for the contents of userRecord.
        console.log('Successfully created new user:', userRecord.uid);
        const userRef = firestore.doc(`users/${userRecord.uid}`);
        const data = req.body;
        console.log(data);
        userRef.set(data);
        console.log('Record saved successfully')

        const responseData = {body: data}
        res.send(responseData)
        console.log(responseData)
    })
    .catch((error) => {
        console.log('Error creating new user:', error);
    });
}

const userLogin = async (req, res) => {
    try {
        await auth.signInWithEmailAndPassword(req.body.email, req.body.password);
        var responseResult = req.body.email;
        console.log(responseResult)
        auth.onAuthStateChanged(async userAuth => {
            const user = await getUserDocument(userAuth);
            // var responseUser = JSON.stringify(user)
            console.log(typeof user.uid.uid)
            res.send({body: responseResult});
        });
        // res.send({body: JSON.stringify(responseResult)});
    } catch(error){
        return res.status(400).send(error.message)
    }
}

// export const generateUserDocument = async (req, res, user, additionalData) => {
//     if (!user) return;
//     const userRef = firestore.doc(`users/${user.uid}`);
//     const snapshot = await userRef.get();
//     if (!snapshot.exists) {
//       const { email, displayName, lastName, phoneNumber, photoURL, provinceId, cityId } = user;
//       try {
//         await userRef.set({
//           displayName,
//           email,
//           photoURL,
//           lastName,
//           phoneNumber,
//           provinceId,
//           cityId,
//           ...additionalData
//         });
//       } catch (error) {
//         console.error("Error creating user document", error);
//       }
//     }
//     return getUserDocument(user.uid);
//   };

const userAuthState = async (req, res) => {
    try {
        auth.onAuthStateChanged(async userAuth => {
            const user = await getUserDocument(userAuth);
            // var responseUser = JSON.stringify(user)
            console.log(typeof user.uid.uid)
            res.send({body: user.uid.uid});
        });
        // res.send({body: JSON.stringify(responseResult)});
    } catch(error){
        return res.status(400).send(error.message)
    }
}

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

module.exports = {
    createUser, userLogin, userAuthState
}