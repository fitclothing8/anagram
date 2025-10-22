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
            // update status to Online
            await firebase.firestore().collection("users").doc(result.user.uid).set({
                status: "Online",
                lastSeen: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
            return result.user.uid;
        } catch (error) {
            return `error:${error.message}`;
        }
    },

    logout: async function () {
        try {
            const user = firebase.auth().currentUser;
            if (user) {
                await firebase.firestore().collection("users").doc(user.uid).set({
                    status: "Offline",
                    lastSeen: firebase.firestore.FieldValue.serverTimestamp()
                }, { merge: true });
            }
            await firebase.auth().signOut();
            return "success";
        } catch (error) {
            return `error:${error.message}`;
        }
    },

    getCurrentUser: function () {
        const user = firebase.auth().currentUser;
        return user ? user.uid : null;
    },

    onAuthStateChanged: function (dotnetHelper) {
        firebase.auth().onAuthStateChanged(function (user) {
            dotnetHelper.invokeMethodAsync("UpdateAuthState", user ? user.uid : null);
        });
    },

    saveUserProfile: async function (uid, displayName, photoUrl, email) {
        await firebase.firestore().collection("users").doc(uid).set({
            displayName: displayName,
            photoUrl: photoUrl,
            email: email,
            status: "Online",
            lastSeen: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
    },

    getUserProfile: async function (uid) {
        const doc = await firebase.firestore().collection("users").doc(uid).get();
        return doc.exists ? doc.data() : null;
    }
};