import logo from './logo.svg';
import './App.css';

import React, {useEffect, useState} from "react";
import socketIOClient from 'socket.io-client';

const ENDPOINT = "http://localhost:4000";


const ChatWindow = () => {
    const [receivedMessages, setReceivedMessages] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
    const [socket, setSocket] = useState(null)


    useEffect(() => {
        if(socket === null)
        {
            setSocket(socketIOClient(ENDPOINT))
        }
        else {
        const handleMessage = (newMessage) =>{
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
        socket.on('message',handleMessage)
        socket.on('connection', socket => {console.log(socket)})

        return () => {
            socket.disconnect();
        };}
    }, [socket]);

  const handleSubmit = (e) => {
    e.preventDefault();

    socket.emit('sendMessage', newMessage);
    setMessages([...messages, newMessage]);
    setNewMessage("");
  };

  return (
      <div className="chat-window">
        <div className="chat-header">Chat</div>
        <div className="chat-messages">
          {messages.map((message, index) => (
              <div key={index} className="chat-message">
                {message}
              </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="chat-input">
          <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
          />
          <button type="submit">Send</button>
        </form>
      </div>
  );
};

export default ChatWindow;



