
{{ /*Frontend Integration with Vue.js
  Install Axios:
  npm install axios
  */
  /*
  Chatbox Component (Chatbox.vue):
  */}}
<template>
  <div>
    <div id="chat-box">
      <div v-for="message in chatHistory" :key="message.id" :class="message.sender">
        {{ message.text }}
      </div>
    </div>
    <form @submit.prevent="sendMessage">
      <input v-model="userMessage" placeholder="Type your message..." required />
      <button type="submit">Send</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      userMessage: "",
      chatHistory: [],
    };
  },
  methods: {
    async sendMessage() {
      const message = this.userMessage;
      this.chatHistory.push({ id: Date.now(), text: message, sender: "user-msg" });
      this.userMessage = "";

      try {
        const response = await axios.post("http://localhost:5000/api/chat", { message });
        this.chatHistory.push({ id: Date.now(), text: response.data.reply, sender: "bot-msg" });
      } catch (error) {
        console.error("Error communicating with chatbot API:", error);
        this.chatHistory.push({ id: Date.now(), text: "Error: Unable to reach chatbot.", sender: "bot-msg" });
      }
    },
  },
};
</script>

<style>
#chat-box {
  width: 300px;
  height: 400px;
  overflow-y: auto;
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
}
.user-msg {
  text-align: right;
  color: blue;
  margin: 5px;
}
.bot-msg {
  text-align: left;
  color: green;
  margin: 5px;
}
</style>

