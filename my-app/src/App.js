import React, { useState } from 'react';

function App() {
  // 상태 관리
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);

  // 입력 필드 변경 핸들러
  const handleChange = (e) => {
    setInputText(e.target.value);
  };

  // 결과 버튼 클릭 시 메시지 추가 및 서버에 요청 보내기
  const handleResultClick = async () => {
    if (inputText.trim() !== '') {
      // 사용자 메시지 추가
      setMessages([...messages, { text: inputText, type: 'user' }]);

      try {
        // 서버에 요청 보내기
        const response = await fetch('http://localhost:11434/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'phi3.5',
            prompt: inputText,
          }),
        });

        if (response.ok) {
          const text = await response.text();

          // 개별 JSON 객체로 분할
          const jsonObjects = text.trim().split("\n");

          // 각 JSON 객체를 JavaScript 객체로 변환
          const parsedData = jsonObjects.map(obj => JSON.parse(obj));
          let resText = '';

          // 변환된 데이터 출력
          parsedData.forEach(item => {
            resText += item.response;
          });

          // 서버의 응답 메시지를 추가
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: resText, type: 'bot' }, // data.response 부분을 서버 응답 형식에 맞게 변경해야 함
          ]);
        } else {
          console.error('Error:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error:', error);
      }

      // 입력 필드 초기화
      setInputText('');
    }
  };

  // 엔터 키 핸들러 추가
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleResultClick();
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
          onKeyDown={handleKeyDown} // 엔터 키 핸들러 추가
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
