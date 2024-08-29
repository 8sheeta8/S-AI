import React, { useState, useRef, useEffect } from 'react';

function App() {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [typingIntervalId, setTypingIntervalId] = useState(null); // 타이핑 인터벌 ID 관리
  const [isTyping, setIsTyping] = useState(false); // GPT 출력 중 여부 관리
  const lastMessageRef = useRef(null);

  const handleChange = (e) => {
    setInputText(e.target.value);
  };

  const handleResultClick = async () => {
    if (inputText.trim() !== '' && !isTyping) { // GPT가 출력 중일 때는 실행하지 않음
      setMessages([...messages, { text: inputText, type: 'user' }]);
      setInputText('');
      setIsTyping(true); // GPT 출력 시작

      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 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', // API Key 입력
          },
          body: JSON.stringify({
            model: 'gpt-4',
            messages: [{ role: 'user', content: inputText }],
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const text = data.choices[0].message.content;

          let index = -1; // 함수 내부로 들어가면 index=0 부터 시작
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: '', type: 'bot' }, // 빈 bot 메시지를 추가
          ]);

          const typingInterval = setInterval(() => {
            const words = text.split(' ');

            if (index < words.length) {
              setMessages((prevMessages) => {
                const updatedMessages = [...prevMessages];
                const botMessage = { ...updatedMessages[updatedMessages.length - 1] };

                if (words[index] !== undefined && words[index] !== null) {
                  botMessage.text += (index === 0 ? '' : ' ') + words[index];
                }

                updatedMessages[updatedMessages.length - 1] = botMessage;

                return updatedMessages;
              });
              index++;
            } else {
              clearInterval(typingInterval); // 애니메이션 완료 시 인터벌 제거
              setTypingIntervalId(null); // 인터벌 ID를 null로 초기화
              setIsTyping(false); // GPT 출력 종료
            }
          }, 200); // 각 단어마다 200ms 간격으로 출력

          setTypingIntervalId(typingInterval); // 인터벌 ID를 상태로 저장
        } else {
          console.error('Error:', response.status, response.statusText);
          setIsTyping(false); // 에러 발생 시 GPT 출력 종료
        }
      } catch (error) {
        console.error('Error:', error);
        setIsTyping(false); // 에러 발생 시 GPT 출력 종료
      }
    }
  };

  const handleStopClick = () => {
    if (typingIntervalId) {
      clearInterval(typingIntervalId); // 인터벌 중지
      setTypingIntervalId(null); // 인터벌 ID를 null로 초기화
      setIsTyping(false); // GPT 출력 종료
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleResultClick();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.statusBar}>상단 상태바</div>
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
      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder={isTyping ? "GPT is typing..." : "Enter your message..."}
          value={inputText}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          style={styles.input}
          disabled={isTyping} // GPT가 출력 중일 때는 입력창 비활성화
        />
        <button onClick={handleResultClick} style={styles.button} disabled={isTyping}>
          결과
        </button>
        <button onClick={handleStopClick} style={styles.button}>
          중지
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
    width: '410px',
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
    marginLeft: '5px', // 버튼 간격 추가
  },
};

export default App;
