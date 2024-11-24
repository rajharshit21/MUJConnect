/*
If you want to log conversations, integrate MongoDB:

Install MongoDB Driver:

bash
Copy code
npm install mongoose
*/

//Modify server.js to Log Conversations:

const mongoose = require("mongoose");

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/chatbot", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const chatSchema = new mongoose.Schema({
    userMessage: String,
    botReply: String,
    timestamp: { type: Date, default: Date.now },
});
const Chat = mongoose.model("Chat", chatSchema);

app.post("/api/chat", async (req, res) => {
    const userMessage = req.body.message;
    if (!model) {
        return res.status(500).send({ reply: "Model is still loading. Please try again later." });
    }

    // Process and find response
    const messages = Object.keys(responses);
    const embeddings = await model.embed([userMessage, ...messages]);
    const userEmbedding = embeddings.slice([0, 1]);
    const messageEmbeddings = embeddings.slice([1]);

    const similarities = messageEmbeddings.dot(userEmbedding.transpose()).arraySync().flat();
    const bestMatchIndex = similarities.indexOf(Math.max(...similarities));

    const reply = similarities[bestMatchIndex] > 0.5 ? responses[messages[bestMatchIndex]] : "I'm sorry, I don't understand that.";

    // Log conversation to MongoDB
    const chatLog = new Chat({ userMessage, botReply: reply });
    await chatLog.save();

    res.send({ reply });
});

