export class FileUploader {
  constructor() {
    this.dropZone = document.getElementById("drop-zone");
    this.fileInput = document.getElementById("file-input");
    this.chatList = document.getElementById("chatList");
  }

  init() {
    if (this.dropZone) {
      this.dropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        this.dropZone.classList.add("border-blue-500", "bg-blue-50");
      });

      this.dropZone.addEventListener("dragleave", (e) => {
        e.preventDefault();
        this.dropZone.classList.remove("border-blue-500", "bg-blue-50");
      });

      this.dropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        this.dropZone.classList.remove("border-blue-500", "bg-blue-50");
        this.handleFileSelect(e.dataTransfer.files);
      });
    }

    if (this.fileInput) {
      this.fileInput.addEventListener("change", (e) => {
        this.handleFileSelect(e.target.files);
        e.target.value = "";
      });
    }

    // Load the last active chat when the page loads
    this.restoreLastActiveChat();
  }

  async handleFileSelect(files) {
    const file = files[0];
    if (file && this.validateFile(file)) {
      await this.uploadFileToBackend(file);
    }
  }
  async uploadFileToBackend(file) {
    const formData = new FormData();
    formData.append("file", file);

    try {
      // 🔹 Show loading spinner in UI
      this.showLoading(); // You’ll define this method
      console.log("before fetch");
      const response = await fetch("http://127.0.0.1:8000/upload/", {
        method: "POST",
        body: formData,
      });
      // Simulate a delay for demo purposes

      console.log("before setTimeout");

      const result = await response.json();
      if (!response.ok) throw new Error(result.detail || "Upload failed");

      console.log("after setTimeout");

      // 🔹 Check if the file was uploaded successfully
      const fileId = result.file_id;
      const filename = file.name;
      // console.log("before polling");
      // const success = await this.streamStatus(fileId); // Polling for status
      // console.log("after polling");
      // if (success) {
        // 🔹 Store file metadata in Local Storage
        let storedFiles =
        JSON.parse(localStorage.getItem("uploadedFiles")) || [];
        storedFiles.push({ id: fileId, name: filename });
        localStorage.setItem("uploadedFiles", JSON.stringify(storedFiles));
        console.log("File uploaded successfully:", result);
        // 🔹 Update Sidebar UI
        this.addChatEntry(fileId, filename);
        console.log("File ID:", fileId);
      // } else {
    //     try {
    //         fileId = parseInt(fileId);
    //       await fetch(`http://127.0.0.1:8000/delete/${fileId}`, {
    //         method: "DELETE",
    //       });
    //     } catch (error) {
    //       console.error("Error deleting file:", error);
    //       alert("File Processing Failed.", error.message);
    //     }
    //   }
    // } catch (error) {
    //   console.error("File upload error:", error);
    //   alert(`File upload error: ${error.message}`);
    } finally {
      this.hideLoading(); // Hide loading after 3 seconds for demo purposes
      console.log("after finally executes");
    }
  }
  async streamStatus(fileId) {

    fileId = parseInt(fileId);
    return new Promise((resolve) => {
      const eventSource = new EventSource(
        `http://127.0.0.1:8000/upload/stream_status/${fileId}`
      );

      eventSource.addEventListener("message", (event) => {
        const data = event.data;
        console.log("Received:", data);

        if (data === "done") {
          eventSource.close();
          resolve(true);
        } else if (data === "failed") {
          eventSource.close();
          resolve(false);
        } else {
          console.log("File is still being processed...");
          return;
        }
        // Keep connection open for "Processing" and other non-terminal statuses
      });

      eventSource.addEventListener("error", (err) => {
        console.error("SSE error:", err);
        debugger;
        eventSource.close();
        resolve(false);
      });
    });
  }

  showLoading() {
    const loader = document.getElementById("loading-indicator");
    if (loader) loader.classList.remove("hidden");
  }

  hideLoading() {
    const loader = document.getElementById("loading-indicator");
    if (loader) loader.classList.add("hidden");
  }

  validateFile(file) {
    const MAX_SIZE_MB = 10;
    const allowedTypes = ["application/pdf", "text/plain"];

    if (!allowedTypes.includes(file.type)) {
      alert("Only PDF and TXT files allowed");
      return false;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      alert(`File size exceeds ${MAX_SIZE_MB}MB`);
      return false;
    }

    return true;
  }

  addChatEntry(fileId, filename) {
    // Create a new chat entry
    const chatItem = document.createElement("div");
    chatItem.className =
      "p-2 mt-2 bg-gray-700 rounded cursor-pointer max-w-64 hover:bg-gray-800 relative overflow-hidden whitespace-nowrap text-ellipsis";
    chatItem.dataset.fileId = fileId;

    const fileName = document.createElement("span");
    fileName.textContent = filename;
    fileName.classList.add("truncate", "mr-2", "flex-grow");

    // ✅ Attach right-click event for delete option
    chatItem.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      this.showDeleteMenu(event, fileId);
    });

    // ✅ Handle chat selection
    chatItem.addEventListener("click", () => {
      this.selectChat(fileId, chatItem);
    });

    // Append elements
    chatItem.appendChild(fileName);

    // ✅ Add new chat entry to sidebar
    if (this.chatList) {
      this.chatList.prepend(chatItem);
    }

    // ✅ Select the newly uploaded file
    this.selectChat(fileId, chatItem);

    // ✅ Dispatch events
    document.dispatchEvent(
      new CustomEvent("chatSwitched", { detail: { fileId } })
    );
    document.dispatchEvent(
      new CustomEvent("newFileUploaded", { detail: { fileId } })
    );
  }

  // ✅ Extracted function to select a chat
  selectChat(fileId, chatItem) {
    document
      .querySelectorAll("#chatList div")
      .forEach((el) => el.classList.remove("selected-chat"));
    chatItem.classList.add("selected-chat");
    localStorage.setItem("currentChatId", fileId);
    document.dispatchEvent(
      new CustomEvent("chatSwitched", { detail: { fileId } })
    );
  }

  highlightActiveChat(fileId) {
    // ✅ Remove highlight from all chat entries
    document.querySelectorAll(".chat-entry").forEach((entry) => {
      entry.classList.remove("selected-chat");
    });

    // ✅ Highlight the new selected chat
    const selectedChat = document.querySelector(
      `.chat-entry[data-file-id="${fileId}"]`
    );
    if (selectedChat) {
      selectedChat.classList.add("selected-chat");
    }

    // ✅ Store active chat in localStorage
    localStorage.setItem("currentChatId", fileId);
  }

  restoreLastActiveChat() {
    const lastActiveChatId = localStorage.getItem("currentChatId");
    if (lastActiveChatId) {
      this.highlightActiveChat(lastActiveChatId);
      document.dispatchEvent(
        new CustomEvent("chatSwitched", {
          detail: { fileId: lastActiveChatId },
        })
      );
    }
  }
}

// Initialize FileUploader when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const fileUploader = new FileUploader();
  fileUploader.init();
});
