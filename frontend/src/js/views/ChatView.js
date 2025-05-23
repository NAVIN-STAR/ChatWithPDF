import { ChatMessage } from "../components/ChatMessage.js";
import { ChatService } from "../services/chatService.js";

export class ChatView {
    constructor() {
        this.element = document.createElement("div");
        this.element.id = "chat-view";
        this.element.className =
            "absolute top-0 h-screen bottom-0 left-64 right-0 flex flex-col bg-gray-800 transition-all duration-300 ease-in-out z-20 p-8";
    }

    render() {
        this.element.innerHTML = `
            <div id="chat-container" class="w-full max-w-5xl mx-auto flex-1 flex flex-col overflow-y-auto p-4 rounded-lg scrollbar-hidden mt-4"></div>
            <div class="flex justify-center w-full max-w-3xl mb-4 mx-auto mt-auto p-4">
                <div class="relative w-full">
                    <textarea id="message-input"
                              class="w-full rounded-lg px-4 pr-14 py-3 focus:outline-none focus:ring-1 focus:ring-gray-700 bg-gray-600 resize-none shadow-md text-white font-medium"
                              placeholder="Send a message..."
                              rows="1"></textarea>
                    <button id="send-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="white" class="w-5 h-5 m-auto" transform="rotate(270)">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M12 5l7 7-7 7"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `;
        return this.element;
    }

    init() {
        const sendBtn = this.element.querySelector("#send-btn");
        const messageInput = this.element.querySelector("#message-input");
        const chatContainer = this.element.querySelector("#chat-container");

        document.addEventListener("newFileUploaded", () => this.showPlaceholderMessage());
        document.addEventListener("chatSwitched", (event) => this.loadChatHistory(event.detail.fileId));
        document.addEventListener("allChatsDeleted", () => {
            chatContainer.innerHTML = "";
            this.showUploadPlaceholder();
        });
        

        messageInput.addEventListener("input", () => {
            this.adjustInputHeight(messageInput);
            this.clearPlaceholderMessage();
        });

        messageInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                this.handleSendMessage(messageInput, chatContainer);
            }
        });

        sendBtn.addEventListener("click", () => this.handleSendMessage(messageInput, chatContainer));

        const lastChatId = localStorage.getItem("currentChatId");
        lastChatId ? this.loadChatHistory(lastChatId) : this.showUploadPlaceholder();
    }

    async handleSendMessage(messageInput, chatContainer) {
        const message = messageInput.value.trim();
        if (!message) return;

        const fileId = localStorage.getItem('currentChatId');
        if (!fileId) {
            alert("No chat selected. Please upload a file first.");
            return;
        }

        const sendBtn = this.element.querySelector('#send-btn');
        sendBtn.disabled = true;
        sendBtn.classList.add("opacity-50", "cursor-not-allowed");

        // ✅ Add user message
        this.addMessage(chatContainer, message, true);
        messageInput.value = '';
        this.adjustInputHeight(messageInput);

        // ✅ Show animated assistant loader
        const loadingMessage = new ChatMessage("", false, true).render();
        chatContainer.appendChild(loadingMessage);
        chatContainer.scrollTop = chatContainer.scrollHeight;

        try {
            const response = await ChatService.sendMessage(message,fileId);
            if (!response.success) {
                throw new Error(response.answer || "Failed to get response from assistant");
            }
            loadingMessage.innerHTML = `<div class=" content whitespace-pre-wrap text-white p-3 rounded-lg break-words max-w-full sm:max-w-md md:max-w-lg lg:max-w-prose"></div>`;
            this.typeText(loadingMessage.querySelector(".content"), response.answer);
            this.saveChatHistory(fileId, [
                { sender: "user", text: message, timestamp: Date.now() },
                { sender: "assistant", text: response.answer, timestamp: Date.now() }
            ]);
        } catch (error) {
            loadingMessage.innerHTML = `<p class="content text-red-400">⚠️ Error processing request</p>`;
        }

        sendBtn.disabled = false;
        sendBtn.classList.remove("opacity-50", "cursor-not-allowed");
    }

    typeText(element, text) {
        let index = 0;
        element.innerHTML = "";
        const interval = setInterval(() => {
            if (index < text.length) {
                element.innerHTML += text[index++];
            } else {
                clearInterval(interval);
            }
        }, 10);
    }

    saveChatHistory(fileId, newMessages) {
        let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || {};
        chatHistory[fileId] = (chatHistory[fileId] || []).concat(newMessages);
        chatHistory[fileId].sort((a, b) => a.timestamp - b.timestamp);
        localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
    }

    loadChatHistory(fileId) {
        const chatContainer = this.element.querySelector("#chat-container");
        chatContainer.innerHTML = "";

        const chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || {};
        const messages = chatHistory[fileId] || [];

        if (!messages.length) {
            this.showPlaceholderMessage();
            return;
        }

        messages.forEach(({ sender, text }) => {
            this.addMessage(chatContainer, text, sender === "user");
        });
    }

    addMessage(container, content, isUser) {
        const message = new ChatMessage(content, isUser).render();
        container.appendChild(message);
        container.scrollTop = container.scrollHeight;
    }

    adjustInputHeight(input) {
        input.style.height = "auto";
        input.style.height = `${input.scrollHeight}px`;
        input.style.overflowY = input.scrollHeight > 150 ? "auto" : "hidden";
    }

    showUploadPlaceholder() {
        this.showMessage(`
            <p class="text-2xl font-semibold text-white mb-2">📂 Upload a file to start chat!</p>
            <p class="text-base text-gray-300">I'll help you analyze and answer questions about it.</p>
        `);
    }

    showPlaceholderMessage() {
        this.showMessage(`
            <p class="text-2xl font-semibold text-white mb-2">📄 New Document Uploaded!</p>
            <p class="text-base text-gray-300">Ask me anything about it.</p>
        `);
    }
    clearPlaceholderMessage() {
      const placeholder = this.element.querySelector("#placeholder-message");
      if (placeholder) {
          placeholder.remove();
      }
  }

    showMessage(content) {
        this.element.querySelector("#chat-container").innerHTML = `
            <div id="placeholder-message" class="flex flex-col items-center justify-center h-full text-gray-400 opacity-100">
                <div class="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md text-center border border-gray-700">
                    ${content}
                </div>
            </div>
        `;
    }
}
