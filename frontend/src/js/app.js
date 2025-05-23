// app.js is the entry point for the application. It initializes the app by rendering the views and initializing the components. The App class is responsible for creating the views and components, rendering them, and initializing them. The init method is called to start the application.

import { SidebarView } from "./views/SidebarView.js";
import { ChatView } from "./views/ChatView.js";
import { FileUploader } from "./components/FileUploader.js";

export class App {
  constructor() {
    this.appContainer = document.getElementById("app");
    this.chatView = new ChatView();
    this.sidebarView = new SidebarView(this.chatView);
    this.fileUploader = new FileUploader(this.sidebarView);
  }

  init() {
    // Render views first
    this.appContainer.appendChild(this.sidebarView.render());
    this.appContainer.appendChild(this.chatView.render());

    // Initialize components after DOM exists
    this.fileUploader.init();
    this.chatView.init();
    this.sidebarView.init();
  }
}
