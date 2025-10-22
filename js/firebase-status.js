window.firebaseStatus = {
    postStatus: async function (author, content) {
        await firebase.firestore().collection("statusUpdates").add({
            author: author,
            content: content,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            likes: 0,
            comments: 0
        });
    },

    subscribeToStatusFeed: function (dotnetHelper) {
        firebase.firestore().collection("statusUpdates")
            .orderBy("timestamp", "desc")
            .onSnapshot(snapshot => {
                const updates = [];
                snapshot.forEach(doc => {
                    const data = doc.data();
                    updates.push({
                        author: data.author,
                        content: data.content,
                        timestamp: data.timestamp?.toDate().toISOString(),
                        likes: data.likes,
                        comments: data.comments
                    });
                });
                dotnetHelper.invokeMethodAsync("ReceiveStatusUpdates", updates);
            });
    }
};
