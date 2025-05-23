// SidebarView Class
// The SidebarView class is responsible for rendering the sidebar view and handling the sidebar toggle button click event. The render method creates the sidebar view and returns the element. The init method initializes the sidebar view by adding the toggle button to the DOM and attaching a click event listener to it to toggle the sidebar view.

export class SidebarView {
  constructor() {
    this.element = document.createElement("div");
    this.element.className =
    "sidebar w-64 h-screen bg-gray-900 text-white p-4 flex flex-col transition-all duration-300 ease-in-out overflow-hidden";
    this.element.id = "sidebar";
    

    this.toggleButton = document.createElement("button");
    this.toggleButton.className =
      "toggle-button absolute top-4 z-30 left-64 text-white p-2 rounded-lg  transition-all duration-300 ease-in-out";
    this.toggleButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
      </svg>
    `;
  }

  render() {
    this.element.innerHTML = `
        
            <!-- Top Section (Placeholder for future content) -->
           <div class="flex items-center justify-center p-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl shadow-lg mb-4 font-semibold text-lg tracking-wide space-x-2">
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-file-pdf" viewBox="0 0 16 16">
  <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1"/>
  <path d="M4.603 12.087a.8.8 0 0 1-.438-.42c-.195-.388-.13-.776.08-1.102.198-.307.526-.568.897-.787a7.7 7.7 0 0 1 1.482-.645 20 20 0 0 0 1.062-2.227 7.3 7.3 0 0 1-.43-1.295c-.086-.4-.119-.796-.046-1.136.075-.354.274-.672.65-.823.192-.077.4-.12.602-.077a.7.7 0 0 1 .477.365c.088.164.12.356.127.538.007.187-.012.395-.047.614-.084.51-.27 1.134-.52 1.794a11 11 0 0 0 .98 1.686 5.8 5.8 0 0 1 1.334.05c.364.065.734.195.96.465.12.144.193.32.2.518.007.192-.047.382-.138.563a1.04 1.04 0 0 1-.354.416.86.86 0 0 1-.51.138c-.331-.014-.654-.196-.933-.417a5.7 5.7 0 0 1-.911-.95 11.6 11.6 0 0 0-1.997.406 11.3 11.3 0 0 1-1.021 1.51c-.29.35-.608.655-.926.787a.8.8 0 0 1-.58.029m1.379-1.901q-.25.115-.459.238c-.328.194-.541.383-.647.547-.094.145-.096.25-.04.361q.016.032.026.044l.035-.012c.137-.056.355-.235.635-.572a8 8 0 0 0 .45-.606m1.64-1.33a13 13 0 0 1 1.01-.193 12 12 0 0 1-.51-.858 21 21 0 0 1-.5 1.05zm2.446.45q.226.244.435.41c.24.19.407.253.498.256a.1.1 0 0 0 .07-.015.3.3 0 0 0 .094-.125.44.44 0 0 0 .059-.2.1.1 0 0 0-.026-.063c-.052-.062-.2-.152-.518-.209a4 4 0 0 0-.612-.053zM8.078 5.8a7 7 0 0 0 .2-.828q.046-.282.038-.465a.6.6 0 0 0-.032-.198.5.5 0 0 0-.145.04c-.087.035-.158.106-.196.283-.04.192-.03.469.046.822q.036.167.09.346z"/>
</svg>
    <span>Chat with PDF</span>
</div>

    <div id="chatList" class="flex-grow overflow-y-auto scrollbar-hidden">
      <!-- Chats will be added here dynamically -->
    </div>


            <!-- Upload Section at Bottom -->
            <div class="mt-auto">
                <div class="flex items-center justify-center p-2  text-white rounded-xl shadow-lg m-auto font-semibold text-lg tracking-wide space-x-2">Upload a File</div>
                <div id="drop-zone" class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition-colors">
                    <input type="file" id="file-input" class="hidden" accept=".pdf,.txt">
                    <label for="file-input" class="cursor-pointer">
                        <svg class="w-8 h-8 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                        </svg>
                        <p class="text-sm text-gray-600">Drag & drop or click to upload</p>
                    </label>
                </div>
                <div id="file-info" class="mt-4 hidden">
                    <p class="text-sm font-medium truncate"></p>
                    <button id="remove-file" class="text-red-500 text-sm mt-1">Remove</button>
                </div>
            </div>
        `;
    this.chatList = this.element.querySelector("#chatList");
    return this.element;
  }

  init() {
    document.body.appendChild(this.toggleButton);
    const chatView = document.getElementById("chat-view");
    const removeFileButton = this.element.querySelector("#remove-file");

    this.toggleButton.addEventListener("click", () => {
      const isSidebarHidden = this.element.classList.contains("sidebar-hidden");
      if (isSidebarHidden) {
        this.element.classList.remove("sidebar-hidden");
        chatView.style.left = "16rem";
        this.toggleButton.classList.remove("left-2");
        this.toggleButton.classList.add("left-64");
      } else {
        this.element.classList.add("sidebar-hidden");
        chatView.style.left = "0";
        this.toggleButton.classList.remove("left-64");
        this.toggleButton.classList.add("left-2");
      }
    });

    removeFileButton.addEventListener("click", () => this.deleteCurrentFile());

    this.loadChatList();
  }

  loadChatList() {
    const storedFiles = JSON.parse(localStorage.getItem("uploadedFiles")) || [];
    let currentChatId = localStorage.getItem("currentChatId");
    this.chatList.innerHTML = ""; // Clear chat list before loading

    // ✅ Create context menu element (if not already created)
    if (!document.getElementById("context-menu")) {
      this.createContextMenu();
    }
    if (storedFiles.length === 0) {
      document.dispatchEvent(new CustomEvent("allChatsDeleted"));
    }
    else{

    storedFiles.forEach(({ id, name }) => {
      const chatItem = document.createElement("div");
      chatItem.className =
       "p-2 mt-2 bg-gray-700 rounded cursor-pointer w-full max-w-64 hover:bg-gray-800 overflow-x-auto whitespace-nowrap scrollbar-hidden";
      chatItem.textContent = name;
      chatItem.dataset.fileId = id;

      if (currentChatId && id.toString() === currentChatId) {
        chatItem.classList.add("selected-chat");
      }

      // ✅ Left click selects chat
      chatItem.addEventListener("click", () => {
        document
          .querySelectorAll("#chatList div")
          .forEach((el) => el.classList.remove("selected-chat"));
        chatItem.classList.add("selected-chat");
        chatItem.scrollIntoView({ behavior: "smooth", inline: "center" });
        localStorage.setItem("currentChatId", id);
        document.dispatchEvent(
          new CustomEvent("chatSwitched", { detail: { fileId: id } })
        );
      });

      // ✅ Right-click event (opens delete menu)
      chatItem.addEventListener("contextmenu", (event) => {
        event.preventDefault(); // Prevent default right-click menu
        this.showContextMenu(event, id);
      });

      this.chatList.prepend(chatItem);
    });
  }
    
  }
  createContextMenu() {
    this.contextMenu = document.createElement("div");
    this.contextMenu.id = "context-menu";
    this.contextMenu.className =
      "absolute bg-red-800 border-2 border-red-700 text-white rounded-lg shadow-lg  hidden z-50";
    this.contextMenu.innerHTML = `
      <button id="delete-chat" class="block w-full text-left p-2 hover:bg-red-700 text-white flex items-center gap-2 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
          <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
        </svg> 
        Delete
      </button>
    `;
    document.body.appendChild(this.contextMenu);

    // ✅ Hide context menu when clicking outside
    document.addEventListener("click", () => {
      this.contextMenu.classList.add("hidden");
    });
  }
  showContextMenu(event, chatId) {
    event.preventDefault();

    // ✅ Position the menu at the mouse cursor
    this.contextMenu.style.left = `${event.pageX}px`;
    this.contextMenu.style.top = `${event.pageY}px`;
    this.contextMenu.classList.remove("hidden");

    // ✅ Set delete button action
    const deleteButton = this.contextMenu.querySelector("#delete-chat");
    deleteButton.onclick = () => {
      this.deleteChat(chatId);
      this.contextMenu.classList.add("hidden"); // Hide menu after deleting
    };
  }
  async deleteChat(chatId) {
    try {
      // ✅ Send DELETE request to backend
      const response = await fetch(`http://127.0.0.1:8000/delete/${chatId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.detail}`);
        return;
      }

      // ✅ Only remove from localStorage if backend deletion is successful
      let storedFiles = JSON.parse(localStorage.getItem("uploadedFiles")) || [];
      storedFiles = storedFiles.filter((file) => file.id!== chatId);
      localStorage.setItem("uploadedFiles", JSON.stringify(storedFiles));

      // ✅ Remove chat history for this file
      let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || {};
      delete chatHistory[chatId];
      localStorage.setItem("chatHistory", JSON.stringify(chatHistory));

      // ✅ Handle UI updates
      const remainingChats = storedFiles; // Get updated file list
      const currentChatId = localStorage.getItem("currentChatId");

      if (currentChatId === chatId.toString()) {
        localStorage.removeItem("currentChatId");

        if (remainingChats.length > 0) {
          const nextChatId = remainingChats[0].id;
          localStorage.setItem("currentChatId", nextChatId);
          document.dispatchEvent(
            new CustomEvent("chatSwitched", { detail: { fileId: nextChatId } })
          );
        } else {
          document.querySelector("#chat-container").innerHTML = "";
          document.querySelector("#message-input").value = "";
          document.dispatchEvent(new CustomEvent("allChatsDeleted"));
        }
      }

      this.loadChatList(); // Refresh sidebar
      alert("File deleted successfully!");
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Failed to delete file. Please try again.");
    }
  }
}
