import React from "react";
import { createRoot } from "react-dom/client";
import Chatroom from "./chatroom.jsx";

const container = document.getElementById("root");
const root = createRoot(container);

// This is the "Safe" way to write it without using the '<' symbol
root.render(React.createElement(Chatroom));
