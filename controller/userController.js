const firebase = require('../utils/db');
const admin = require('../utils/service');
const firestore = admin.firestore();

const addUser = async (req, res, user) => {
    try {
        await firebase.auth().createUserWithEmailAndPassword(req.body.email, req.body.password);
        if (!user) return;
        const userRef = firestore.collection('users').doc(user.uid);
        const snapshot = await userRef.get();
        const data = req.body;
        if (!snapshot.exists) {
            try {
                await userRef.set(data);
                res.send('Record saved successfully');
            } catch (error) {
                console.error("Error creating user document", error);
            }
        }
        return getUserDocument(user.uid);
    } catch (error) {
        return res.status(400).send(error.message);
    }
};

const createUser = async (req, res) => {
    admin.auth().createUser({
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
        console.log('Successfully created new user:', userRecord.uid);
        const userRef = firestore.doc(`users/${userRecord.uid}`);
        const data = req.body;
        userRef.set(data);
        res.send({ body: data });
    })
    .catch((error) => {
        console.log('Error creating new user:', error);
        res.status(500).send(error.message);
    });
};

const userLogin = async (req, res) => {
    try {
        await firebase.auth().signInWithEmailAndPassword(req.body.email, req.body.password);
        firebase.auth().onAuthStateChanged(async (userAuth) => {
            const user = await getUserDocument(userAuth.uid);
            res.send({ body: user, status: "200" });
        });
    } catch (error) {
        return res.status(400).send(error.message);
    }
};

const userAuthState = async (req, res) => {
    try {
        firebase.auth().onAuthStateChanged(async (userAuth) => {
            const user = await getUserDocument(userAuth.uid);
            res.send({ body: user.uid });
        });
    } catch (error) {
        return res.status(400).send(error.message);
    }
};

const getUserDocument = async (uid) => {
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
};