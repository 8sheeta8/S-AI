import React, { useState, useRef, useEffect } from 'react';

function App() {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [typingIntervalId, setTypingIntervalId] = useState(null); // 타이핑 인터벌 ID 관리
  const [isTyping, setIsTyping] = useState(false); // GPT 출력 중 여부 관리
  const lastMessageRef = useRef(null);
  const [fileContent, setFileContent] = useState('');

  const handleChange = (e) => {
    setInputText(e.target.value);
  };

  useEffect(() => {
    const fileUrl = '/prompt(mix).txt';

    fetch(fileUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('파일을 가져오는 데 실패했습니다.');
        }

        return response.text(); // 텍스트 형태로 응답을 변환합니다.
      })
      .then((text) => {
        setFileContent(text); // 파일 내용을 상태에 저장합니다.
      })
      .catch((error) => {
        console.error('파일을 읽는 도중 오류가 발생했습니다:', error);
      });
  }, []);

  const handleResultClick = async () => {
    if (inputText.trim() !== '' && !isTyping) {
      const newMessage = { text: inputText, type: 'user' };
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      setInputText('');
      setIsTyping(true);

      try {
        const combinedPrompt = `${fileContent}\n\n<<< 사용자 입력 >>>\n\n${inputText}\n\n<<< 답변 >>>\n`;
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`, // .env 파일에서 API 키 가져오기
          },
          body: JSON.stringify({
            model: 'gpt-4',
            messages: [{ role: 'user', content: combinedPrompt }],
          }),
        });

        //console.log(combinedPrompt);

        if (response.ok) {
          const data = await response.json();
          const text = data.choices[0].message.content;

          let index = -1;
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: '', type: 'bot' }, 
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
              clearInterval(typingInterval); 
              setTypingIntervalId(null); 
              setIsTyping(false); 
            }
          }, 200);

          setTypingIntervalId(typingInterval); 
        } else {
          console.error('Error:', response.status, response.statusText);
          setIsTyping(false); 
        }
      } catch (error) {
        console.error('Error:', error);
        setIsTyping(false); 
      }
    }
  };

  const handleStopClick = () => {
    if (typingIntervalId) {
      clearInterval(typingIntervalId);
      setTypingIntervalId(null);
      setIsTyping(false);
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
      <div style={styles.statusBar}>연애 상담소</div>
      <div style={styles.chatContainer}>
        <h1 style={styles.title}>💫💘💗💌💞💝✨</h1>
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
          placeholder={isTyping ? "고민중...💭" : "입력해...💌"}
          value={inputText}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          style={styles.input}
          disabled={isTyping} 
        />
        <button onClick={handleResultClick} style={styles.button} disabled={isTyping}>
          ❤️
        </button>
        <button onClick={handleStopClick} style={styles.button}>
          💔 
        </button>
      </div>
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
    backgroundColor: '#da9df2',
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
    backgroundImage: "url('/pink.png')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
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
    backgroundColor: '#da9df2',
    color: 'white',
    borderRadius: '20px',
    maxWidth: '60%',
    wordWrap: 'break-word',
    textAlign: 'left',
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
    backgroundColor: '#ffffff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    marginLeft: '5px',
  },
};

export default App;
