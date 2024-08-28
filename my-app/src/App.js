import React, { useState } from 'react';

function App() {
  // 상태 관리
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);

  // 입력 필드 변경 핸들러
  const handleChange = (e) => {
    setInputText(e.target.value);
  };

  // 결과 버튼 클릭 시 메시지 추가
  const handleResultClick = () => {
    if (inputText.trim() !== '') {
      setMessages([...messages, { text: inputText, type: 'user' }]); // 사용자 메시지 추가
      setMessages((prevMessages) => [...prevMessages, { text: 'success', type: 'bot' }]); // ChatGPT 응답 추가
      setInputText(''); // 입력 필드 초기화
    }
  };

  return (
    <div style={styles.container}>
      {/* 상단 상태바 */}
      <div style={styles.statusBar}>상단 상태바</div>

      {/* 채팅 내용 */}
      <div style={styles.chatContainer}>
        <h1 style={styles.title}>ChatGPT Style Conversation</h1>

        <div style={styles.chatBox}>
          {messages.map((message, index) => (
            <div
              key={index}
              style={
                message.type === 'user' ? styles.messageUser : styles.messageBot
              }
            >
              {message.text}
            </div>
          ))}
        </div>
      </div>

      {/* 입력 필드와 결과 버튼이 아래에 위치 */}
      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Enter your message..."
          value={inputText}
          onChange={handleChange}
          style={styles.input}
        />
        <button onClick={handleResultClick} style={styles.button}>
          결과
        </button>
      </div>

      {/* 하단 상태바 */}
      <div style={styles.statusBar}>하단 상태바</div>
    </div>
  );
}

// 스타일 객체
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