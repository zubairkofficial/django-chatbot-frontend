import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import { ChatProvider } from "./Screens/User/ChatContext.jsx";

import { ToastContainer } from "react-toastify";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ToastContainer />
    <ChatProvider>
    <App />
  </ChatProvider> 
  </React.StrictMode>
);
