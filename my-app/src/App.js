import React, { useState, useRef, useEffect } from 'react';

function App() {
  // 상태 관리
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);

  // 마지막 메시지의 참조 생성
  const lastMessageRef = useRef(null);
  
  // 입력 필드 변경 핸들러
  const handleChange = (e) => {
    setInputText(e.target.value);
  };

  // 결과 버튼 클릭 시 메시지 추가 및 서버에 요청 보내기
  const handleResultClick = async () => {
    if (inputText.trim() !== '') {
      // 사용자 메시지 추가
      setMessages([...messages, { text: inputText, type: 'user' }]);

      // 입력 필드 초기화 - 메시지 전송 후 입력 필드를 바로 비웁니다.
      setInputText('');

      try {
        // 서버에 요청 보내기
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ', // API Key 입력
          },
          body: JSON.stringify({
            model: 'gpt-4',
            messages: [{ role: 'user', content: inputText }],
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const botMessage = data.choices[0].message.content;

          // 봇의 응답 메시지를 추가 (단일 메시지 추가)
          setMessages((prevMessages) => [
            ...prevMessages, 
            { text: botMessage, type: 'bot' }
          ]);
          
        } else {
          console.error('Error:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  // 엔터 키 핸들러 추가
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleResultClick();
    }
  };

  // 메시지가 추가될 때마다 마지막 메시지로 스크롤
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]); // messages 상태가 변경될 때마다 실행

  return (
    <div style={styles.container}>
      {/* 상단 상태바 */}
      <div style={styles.statusBar}>상단 상태바</div>

      {/* 채팅 내용 */}
      <div style={styles.chatContainer}>
        <h1 style={styles.title}>ChatGPT Conversation</h1>

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
          <div ref={lastMessageRef} />
        </div>
      </div>

      {/* 입력 필드와 결과 버튼이 아래에 위치 */}
      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Enter your message... please"
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
    backgroundColor: '#5fa5df',
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
    width: '510px',
    marginRight: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    backgroundColor: '#5fa5df',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
  },
};

export default App;
