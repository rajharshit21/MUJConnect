
/*1. Backend Setup with Node.js
Use Node.js with Express.js to handle API requests and integrate TensorFlow.

Install Required Packages:
*/
//npm install express body-parser @tensorflow/tfjs @tensorflow-models/universal-sentence-encoder




const express = require("express");
const bodyParser = require("body-parser");
const tf = require("@tensorflow/tfjs");
const use = require("@tensorflow-models/universal-sentence-encoder");

const app = express();
app.use(bodyParser.json());

// Load TensorFlow Universal Sentence Encoder model
let model;
use.load().then((loadedModel) => {
    model = loadedModel;
    console.log("TensorFlow model loaded!");
});

// Simple chatbot logic (can be expanded with advanced APIs)
const responses = {
    "How do I create a post?": "Click on the 'Create Post' button on the homepage.",
    "What is anonymous posting?": "It allows you to post without revealing your identity.",
    "How do I recover my account?": "Go to 'Forgot Password' and follow the steps."
};

app.post("/api/chat", async (req, res) => {
    const userMessage = req.body.message;
    if (!model) {
        return res.status(500).send({ reply: "Model is still loading. Please try again later." });
    }

    // Find the closest matching response
    const messages = Object.keys(responses);
    const embeddings = await model.embed([userMessage, ...messages]);
    const userEmbedding = embeddings.slice([0, 1]);
    const messageEmbeddings = embeddings.slice([1]);

    const similarities = messageEmbeddings.dot(userEmbedding.transpose()).arraySync().flat();
    const bestMatchIndex = similarities.indexOf(Math.max(...similarities));

    const reply = similarities[bestMatchIndex] > 0.5 ? responses[messages[bestMatchIndex]] : "I'm sorry, I don't understand that.";

    res.send({ reply });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
