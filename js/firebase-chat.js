window.firebaseChat = {
    // Send a message into a specific conversation
    sendMessage: async function (conversationId, text, sender) {
        const db = firebase.firestore();
        await db.collection("conversations")
            .doc(conversationId)
            .collection("messages")
            .add({
                text: text,
                sender: sender,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
    },

    // Subscribe to messages in a specific conversation
    subscribeToMessages: function (conversationId, dotnetHelper) {
        const db = firebase.firestore();
        db.collection("conversations")
            .doc(conversationId)
            .collection("messages")
            .orderBy("timestamp")
            .onSnapshot(snapshot => {
                const messages = [];
                snapshot.forEach(doc => {
                    const data = doc.data();
                    messages.push({
                        text: data.text,
                        sender: data.sender,
                        timestamp: data.timestamp ? data.timestamp.toDate().toISOString() : null
                    });
                });
                dotnetHelper.invokeMethodAsync("ReceiveMessages", messages);
            });
    }
};
