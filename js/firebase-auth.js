window.firebaseAuth = {
    signUp: async function (email, password) {
        try {
            const result = await firebase.auth().createUserWithEmailAndPassword(email, password);
            return result.user.uid;
        } catch (error) {
            return `error:${error.message}`;
        }
    },

    login: async function (email, password) {
        try {
            const result = await firebase.auth().signInWithEmailAndPassword(email, password);
            return result.user.uid;
        } catch (error) {
            return `error:${error.message}`;
        }
    }
};
window.firebaseAuth.logout = async function () {
    try {
        await firebase.auth().signOut();
        return "success";
    } catch (error) {
        return `error:${error.message}`;
    }
};

window.firebaseAuth.getCurrentUser = function () {
    const user = firebase.auth().currentUser;
    return user ? user.uid : null;
};

window.firebaseAuth.onAuthStateChanged = function (dotnetHelper) {
    firebase.auth().onAuthStateChanged(function (user) {
        dotnetHelper.invokeMethodAsync("UpdateAuthState", user ? user.uid : null);
    });
};
window.firebaseAuth.saveUserProfile = async function (uid, displayName, photoUrl, email) {
    await firebase.firestore().collection("users").doc(uid).set({
        displayName: displayName,
        photoUrl: photoUrl,
        email: email
    });
};

window.firebaseAuth.getUserProfile = async function (uid) {
    const doc = await firebase.firestore().collection("users").doc(uid).get();
    return doc.exists ? doc.data() : null;
};

