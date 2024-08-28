// src/ChatMessage.js
import React from 'react';
import './ChatMessage.css';

const ChatMessage = ({ message }) => {
    const { text, sender } = message;
    const messageClass = sender === 'user' ? 'user-message' : 'bot-message';

    return (
        <div className={`chat-message ${messageClass}`}>
            <p>{text}</p>
        </div>
    );
};

export default ChatMessage;