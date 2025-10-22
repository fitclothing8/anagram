window.contactService = {
    subscribeContacts: function (dotNetRef) {
        const db = firebase.firestore();
        db.collection("users").onSnapshot(snapshot => {
            const contacts = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                contacts.push({
                    id: doc.id,
                    displayName: data.displayName || "",
                    email: data.email || "",
                    status: data.status || "Offline",
                    photoUrl: data.photoUrl || ""
                });
            });
            dotNetRef.invokeMethodAsync("UpdateContacts", contacts);
        });
    }
};