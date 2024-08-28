import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const lastMessageRef = useRef(null);

  const handleChange = (e) => {
    setInputText(e.target.value);
  };

  const handleResultClick = async () => {
    if (inputText.trim() !== '') {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: inputText, type: 'user' }
      ]);
      setLoading(true);
      setInputText('');

      try {
        const response = await axios.post('http://localhost:11434/api/generate', {
          prompt: inputText,
          model: 'phi3'
        });

        const botResponse = response.data.text || "I'm here to help you with any relationship advice.";
        setMessages((prevMessages) => [...prevMessages, { text: botResponse, type: 'bot' }]);
      } catch (error) {
        console.error("Error fetching response from Ollama API:", error);
        setMessages((prevMessages) => [...prevMessages, { text: "Sorry, I couldn't process your request. Please try again.", type: 'bot' }]);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleResultClick();
    }
  };

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div style={styles.container}>
      <div style={styles.statusBar}>상단 상태바</div>

      <div style={styles.chatContainer}>
        <h1 style={styles.title}>ChatGPT Style Conversation</h1>

        <div style={styles.chatBox}>
          {messages.map((message, index) => (
            <div
              key={index}
              style={message.type === 'user' ? styles.messageUser : styles.messageBot}
            >
              {message.text}
            </div>
          ))}
          <div ref={lastMessageRef} />
        </div>
      </div>

      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Enter your message..."
          value={inputText}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          style={styles.input}
          disabled={loading}
        />
        <button onClick={handleResultClick} style={styles.button} disabled={loading}>
          {loading ? 'Loading...' : '결과'}
        </button>
      </div>

      <div style={styles.statusBar}>하단 상태바</div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100vh',
    backgroundColor: '#f4f4f4',
  },
  statusBar: {
    width: '100%',
    height: '50px',
    backgroundColor: '#282c34',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    flex: 1,
    width: '100%',
    overflowY: 'auto',
  },
  title: {
    marginBottom: '20px',
  },
  chatBox: {
    width: '100%',
    maxWidth: '600px',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  messageUser: {
    alignSelf: 'flex-end',
    padding: '10px 15px',
    backgroundColor: '#007bff',
    color: 'white',
    borderRadius: '20px',
    maxWidth: '60%',
    wordWrap: 'break-word',
    textAlign: 'right',
  },
  messageBot: {
    alignSelf: 'flex-start',
    padding: '10px 15px',
    backgroundColor: '#f1f0f0',
    borderRadius: '20px',
    maxWidth: '60%',
    wordWrap: 'break-word',
    textAlign: 'left',
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    backgroundColor: '#fff',
    boxShadow: '0 -2px 4px rgba(0, 0, 0, 0.1)',
    width: '100%',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    width: '70%',
    marginRight: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
  },
};

export default App;
