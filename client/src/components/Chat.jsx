import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import "../static/css/components/Chat.css";

const socket = io("http://localhost:3000");

const Chat = ({
  senderId,
  senderRole,
  receiverId,
  receiverRole,
  receiverUsername,
}) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    socket.emit("join", { senderId, senderRole });

    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/chat/${senderId}/${senderRole}/${receiverId}/${receiverRole}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMessages(response.data);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
        setMessages([]);
      }
    };

    fetchMessages();

    return () => {
      socket.off("receiveMessage");
    };
  }, [senderId, senderRole, receiverId, receiverRole, token, trigger]);

  const sendMessage = () => {
    const newMessage = {
      senderId,
      senderRole,
      receiverId,
      receiverRole,
      content: message,
      timestamp: new Date().toISOString(),
    };
    socket.emit("sendMessage", newMessage);
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setTrigger(!trigger);
    setMessage("");
  };

  if (!token) {
    return (
      <div>
        <h1>
          Unauthorized, Please Sign in <a href="/signin">Here</a>
        </h1>
      </div>
    );
  }

  return (
    <div className="chat_section_main">
      <div className="chat_section_main_msg_area">
        {Array.isArray(messages) && messages.length > 0 ? (
          messages.map((msg, index) => (
            <div
              className={
                msg.sender === senderId ? "sent_message" : "received_message"
              }
              key={index}
            >
              <span>{msg.content}</span>
            </div>
          ))
        ) : (
          <span>No Messages Yet With {receiverUsername}</span>
        )}
      </div>
      <div className="chat_section_main_msg_box">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
