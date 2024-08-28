// src/Chatbot.js
import React, { useState } from 'react';
import ChatMessage from './ChatMessage';
import './Chatbot.css';

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (input.trim() === '') return;

        // 사용자 메시지 추가
        const userMessage = { text: input, sender: 'user' };
        setMessages([...messages, userMessage]);

        // 챗봇 응답 추가
        const botResponse = "오 좋아요!";
        setMessages([...messages, userMessage, { text: botResponse, sender: 'bot' }]);

        // 입력 필드 초기화
        setInput('');
    };

    return (
        <div className="chatbot-container">
            <div className="chatbot-header">
                <h2>Relationship Counseling Chatbot</h2>
            </div>
            <div className="chatbot-messages">
                {messages.map((msg, index) => (
                    <ChatMessage key={index} message={msg} />
                ))}
            </div>
            <div className="chatbot-input">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <button onClick={handleSend}>
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chatbot;
