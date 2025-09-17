const messagesDiv = document.getElementById("messages");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const newChatBtn = document.getElementById("newChat");
const clearChatBtn = document.getElementById("clearChat");
const chatList = document.getElementById("chatList");
const themeToggle = document.getElementById("themeToggle");

let chats = JSON.parse(localStorage.getItem("chats")) || {};
let activeChat = "default";

if (!chats[activeChat]) chats[activeChat] = [];

function saveChats() {
  localStorage.setItem("chats", JSON.stringify(chats));
}

function renderMessages() {
  messagesDiv.innerHTML = "";
  chats[activeChat].forEach(msg => {
    const div = document.createElement("div");
    div.className = message ;{msg.role};
    div.textContent = msg.content;
    messagesDiv.appendChild(div);
  });
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function addMessage(role, content) {
  chats[activeChat].push({ role, content });
  saveChats();
  renderMessages();
}

function botReply(userText) {
  const loading = document.createElement("div");
  loading.className = "message bot";
  loading.textContent = "Typing...";
  messagesDiv.appendChild(loading);

  setTimeout(() => {
    loading.remove();
    addMessage("bot", "🤖 Echo: " + userText);
  }, 1000);
}

function sendMessage() {
  const text = input.value.trim();
  if (!text) return;
  addMessage("user", text);
  input.value = "";
  botReply(text);
}

sendBtn.addEventListener("click", sendMessage);

input.addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault(); // prevent new line
    sendMessage();
  }
});

newChatBtn.addEventListener("click", () => {
  const id = "chat_" + Date.now();
  chats[id] = [];
  activeChat = id;
  saveChats();
  renderChatList();
  renderMessages();
});

clearChatBtn.addEventListener("click", () => {
  chats[activeChat] = [];
  saveChats();
  renderMessages();
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// Keyboard shortcuts
document.addEventListener("keydown", e => {
  if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "n") {
    e.preventDefault();
    newChatBtn.click();
  }
});

function renderChatList() {
  chatList.innerHTML = "";
  Object.keys(chats).forEach(id => {
    const li = document.createElement("li");
    li.textContent = id === "default" ? "Main Chat" : id;
    li.onclick = () => {
      activeChat = id;
      renderMessages();
    };
    chatList.appendChild(li);
  });
}

renderChatList();
renderMessages();