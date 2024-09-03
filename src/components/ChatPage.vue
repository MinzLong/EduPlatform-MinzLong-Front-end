<template>
  <div class="chat-container">
    <h1>Chat</h1>
    <div v-if="error" class="error">{{ error }}</div>
    <div class="user-selection">
      <label>Select a user to chat with:</label>
      <select v-model="selectedUserId" @change="startChat">
        <option v-for="user in users" :key="user._id" :value="user._id">
          {{ user.firstName }} {{ user.lastName }}
        </option>
      </select>
    </div>
    <div v-if="chattingWith" class="chat-box">
      <div class="chat-header">
        <h2>{{ chattingWith.firstName }} {{ chattingWith.lastName }}</h2>
      </div>
      <div class="messages" ref="messagesContainer">
        <div v-for="(msg, index) in messages" :key="index" :class="['message', msg.senderId === currentUserId ? 'sent' : 'received']">
          <strong>{{ msg.senderName }}:</strong> {{ msg.text }}
        </div>
      </div>
      <div class="chat-input">
        <textarea v-model="message" placeholder="Type your message..."></textarea>
        <button @click="sendMessage">Send</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      socket: null,
      selectedUserId: null,
      chattingWith: null,
      message: '',
      messages: [],
      error: null,
      currentUserId: this.$store.state.user._id, // Thêm ID người dùng hiện tại
      currentUserName: `${this.$store.state.user.firstName} ${this.$store.state.user.lastName}`,
    };
  },
  computed: {
    users() {
      // Lọc ra user hiện tại để không hiển thị trong danh sách lựa chọn
      return this.$store.getters.users.filter(user => user._id !== this.$store.state.user._id);
    }
  },
  methods: {
    async startChat() {
      try {
        this.chattingWith = this.users.find(user => user._id === this.selectedUserId);
        this.messages = []; // Clear previous messages
        await this.fetchChatHistory();
        this.connectSocket(); // Kết nối WebSocket khi bắt đầu chat
      } catch (error) {
        console.error('Failed to start chat:', error);
        this.error = 'Failed to start chat. Please try again.';
      }
    },
    async sendMessage() {
      try {
        if (this.message.trim() === '') return;

        const messageData = {
          senderId: this.currentUserId,
          senderName: this.currentUserName,
          text: this.message,
          receiverId: this.chattingWith._id
        };

        // Gửi tin nhắn qua WebSocket
        this.socket.send(JSON.stringify(messageData));

        // Lưu tin nhắn vào server
        await axios.post(`http://localhost:3000/api/chat/${this.chattingWith._id}`, messageData, {
          headers: { 'x-auth-token': this.$store.state.token }
        });

        // Sau khi gửi, bạn chỉ cần xóa nội dung trong ô nhập tin nhắn
        this.message = '';
        this.scrollToBottom(); // Tự động cuộn xuống cuối cùng
      } catch (error) {
        console.error('Failed to send message:', error);
        this.error = 'Failed to send message. Please try again.';
      }
    },
    async fetchChatHistory() {
      try {
        const url = `http://localhost:3000/api/chat/${this.chattingWith._id}`;
        const response = await axios.get(url, {
          headers: { 'x-auth-token': this.$store.state.token }
        });

        this.messages = response.data.messages.map(msg => ({
          senderId: msg.sender._id,
          senderName: `${msg.sender.firstName} ${msg.sender.lastName}`,
          text: msg.text
        }));

        this.scrollToBottom(); // Tự động cuộn xuống cuối cùng
      } catch (error) {
        if (error.response && error.response.status === 404) {
          this.messages = []; // Handle case where no chat history exists
        } else {
          this.error = 'Failed to fetch chat history. Please try again.';
        }
      }
    },
    connectSocket() {
      if (this.socket) {
        this.socket.close();
      }

      this.socket = new WebSocket(`ws://localhost:3000/${this.chattingWith._id}`);

      this.socket.onmessage = (event) => {
        const messageData = JSON.parse(event.data);
        this.messages.push(messageData); // Cập nhật giao diện khi nhận được tin nhắn mới
        this.scrollToBottom(); // Tự động cuộn xuống cuối cùng
      };


      this.socket.onclose = () => {
        console.log('WebSocket connection closed');
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.error = 'WebSocket connection failed. Please try again.';
      };
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const messagesContainer = this.$refs.messagesContainer;
        if (messagesContainer) {
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
      });
    }
  },
  async created() {
    try {
      await this.$store.dispatch('fetchUsers');
    } catch (error) {
      this.error = 'Failed to load users. Please try again.';
    }
  },
  beforeDestroy() {
    if (this.socket) {
      this.socket.close();
    }
  }
};
</script>

<style scoped>
.chat-container {
  max-width: 600px;
  margin: 0 auto;
  font-family: 'Arial', sans-serif;
  border: 1px solid #ccc;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
}

.error {
  color: red;
  text-align: center;
  font-weight: bold;
  margin: 10px 0;
}

.user-selection {
  padding: 20px;
  background-color: #f8f8f8;
  border-bottom: 1px solid #ddd;
}

select {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  margin-top: 10px;
}

.chat-box {
  display: flex;
  flex-direction: column;
  height: 500px;
}

.chat-header {
  padding: 15px;
  background-color: #007bff;
  color: white;
  text-align: center;
}

.messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #f1f1f1;
}

.message {
  padding: 10px 15px;
  margin-bottom: 10px;
  border-radius: 20px;
  max-width: 75%;
  clear: both;
}

.sent {
  background-color: #007bff;
  color: white;
  float: left;
  text-align: left;
}

.received {
  background-color: #e9ecef;
  color: #333;
  float: right;
  text-align: right;
}

.chat-input {
  display: flex;
  padding: 15px;
  background-color: #f8f8f8;
  border-top: 1px solid #ddd;
}

textarea {
  flex: 1;
  padding: 10px;
  border-radius: 20px;
  border: 1px solid #ccc;
  resize: none;
  margin-right: 10px;
}

button {
  padding: 10px 20px;
  border-radius: 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

textarea, button, select {
  font-family: 'Arial', sans-serif;
}
</style>
