import React from "react";
import { createRoot } from "react-dom/client";
import Chatroom from "./chatroom.jsx"; // We are importing the Chat View directly

// This finds the <div id="root"> in your HTML and puts the app inside it
const container = document.getElementById("root");
const root = createRoot(container);
root.render(<Chatroom />);
