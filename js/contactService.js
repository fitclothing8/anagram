window.contactService = {
    subscribeContacts: function (dotNetRef) {
        const db = firebase.firestore();
        db.collection("users").onSnapshot(snapshot => {
            const contacts = [];
            snapshot.forEach(doc => {
                contacts.push({ id: doc.id, ...doc.data() });
            });
            dotNetRef.invokeMethodAsync("UpdateContacts", contacts);
        });
    }
};
