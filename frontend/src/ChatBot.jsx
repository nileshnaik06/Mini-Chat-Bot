import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { nanoid } from "nanoid";

import "./chat.css";

const ChatBot = () => {
  const [inputText, setinputText] = useState("");
  const [promptMessage, setpromptMessage] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    let socketInstance = io("http://localhost:3000/");
    setSocket(socketInstance);

    socketInstance.on("query-response", (data) => {
      const aiMessage = {
        id: nanoid(),
        text: data.response,
        sender: "bot",
      };
      setpromptMessage((prevPrompt) => [...prevPrompt, aiMessage]);
    });
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const handleSubmit = () => {
    if (inputText.trim() === "") return;

    const userPrompt = {
      id: nanoid(),
      text: inputText,
      sender: "user",
    };
    setpromptMessage((prevPrompt) => [...prevPrompt, userPrompt]);
    socket.emit("ai-message", inputText);
    setinputText("");
  };

  const handleInputChange = (e) => {
    setinputText(e.target.value);
  };

  const handleSend = () => {
    handleSubmit();
  };

  const handleKeyEvent = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form from reloading the page
      handleSubmit(inputText);
      setinputText(""); // Clear input
    }
  };

  const chat = promptMessage.map((texts) => {
    return (
      <span key={texts.id} className={texts.sender}>
        <h3>{texts.text}</h3>
      </span>
    );
  });

  return (
    <>
      <header>
        <h1>chad-gpt</h1>
        {/* <button>Login</button> */}
      </header>

      <div className="main">
        <section className="container">
          <div className="msg_container">
            {promptMessage === 0 ? (
              <div className="temp">How can i help you today...</div>
            ) : (
              chat
            )}
          </div>
          <div className="inp">
            <input
              type="text"
              value={inputText}
              onChange={handleInputChange}
              onKeyPress={handleKeyEvent}
              placeholder="Enter your message here"
            />
            <button onClick={handleSend}>send</button>
          </div>
        </section>
      </div>
    </>
  );
};

export default ChatBot;
