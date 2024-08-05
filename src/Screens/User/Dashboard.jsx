import React, { useState, useEffect, useRef } from "react";
import { webURL } from "../../constantx";
import { backendStreamingRequest } from "../../utiils/streamingResponse";
import { useParams } from "react-router-dom";

const Dashboard = () => {
  const { chat_id } = useParams();
  const [messages, setMessages] = useState([]);
  const [botTyping, setBotTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const userId = localStorage.getItem('user_id');

  const suggestions = [
    "Find a good movie to watch tonight",
    "Can you recommend a good book?",
    "Type 'help' to see what I can do for you",
    "How do I change my email preferences?",
  ];

  const scrollChat = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const addMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const handleUserInput = async (e) => {
    if (e.key === "Enter" || e.type === "click") {
      const userInput = inputRef.current.value.trim();
      if (!userInput) return;

      // Hide suggestions after the first user input
      setShowSuggestions(false);

      inputRef.current.value = "";
      addMessage({ from: "user", text: userInput });
      setBotTyping(true);

      try {
        addMessage({ from: "bot", text: "" });
        const response = backendStreamingRequest("POST", `${webURL}api/chatbot`, {
          input_query: userInput,
          user_id: userId
        });
        let buffer = "";
        for await (const chunk of response) {
          buffer += chunk;
          setMessages(oldMessages => {
            const newMessages = [...oldMessages];
            newMessages[newMessages.length - 1].text = buffer;
            return newMessages;
          });
        }
      } catch (error) {
        console.error("Error fetching chatbot response:", error);
        addMessage({
          from: "bot",
          text: "Sorry, I couldn't process your request. Please try again later.",
        });
      }

      setBotTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (inputRef.current) {
      inputRef.current.value = suggestion;
      inputRef.current.focus();
    }
    setShowSuggestions(false);
  };

  const fetchChatHistory = async () => {
    try {
      const response = await fetch(`${webURL}api/chatbot?user_id=${userId}`);
      const data = await response.json();
      if (response.ok) {
        const historyMessages = data.chat_history.map((entry) => [
          { from: "user", text: entry.user_query },
          { from: "bot", text: entry.bot_response }
        ]).flat();
        setMessages(historyMessages);
      } else {
        console.error("Error fetching chat history:", data.errors);
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  const resetChat = () => {
    setMessages([]);
    setShowSuggestions(true);
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    fetchChatHistory();
  }, [chat_id]);  // Re-fetch chat history whenever chat_id changes

  useEffect(() => {
    scrollChat();
  }, [messages]);

  return (
    <div className="flex-1 p-2 sm:p-6 justify-between flex flex-col rounded-2xl h-[85vh] bg-white">
      <div
        id="messages"
        className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
      >
        {messages.length === 0 ? (
          <div className="text-center text-gray-500">No previous messages</div>
        ) : (
          messages.map((message, key) => (
            <div key={key}>
              <div
                className={`flex items-end ${
                  message.from === "bot" ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`flex flex-col space-y-2 text-md leading-tight max-w-lg mx-2 ${
                    message.from === "bot"
                      ? "order-2 items-start"
                      : "order-1 items-end"
                  }`}
                >
                  <div>
                    <span
                      className={`px-4 py-3 rounded-xl inline-block ${
                        message.from === "bot"
                          ? "rounded-bl-none bg-gray-100 text-gray-600"
                          : "rounded-br-none bg-[#413e7c] text-white"
                      }`}
                      dangerouslySetInnerHTML={{ __html: message.text }}
                    ></span>
                  </div>
                </div>
                <img
                  src={
                    message.from === "bot"
                      ? "https://cdn.icon-icons.com/icons2/1371/PNG/512/robot02_90810.png"
                      : "https://i.pravatar.cc/100?img=7"
                  }
                  alt=""
                  className={`w-6 h-6 rounded-full ${
                    message.from === "bot" ? "order-1" : "order-2"
                  }`}
                />
              </div>
            </div>
          ))
        )}
        {botTyping && (
          <div className="flex items-end">
            <div className="flex flex-col space-y-2 text-md leading-tight mx-2 order-2 items-start">
              <div>
                <img
                  src="https://support.signal.org/hc/article_attachments/360016877511/typing-animation-3x.gif"
                  alt="Typing..."
                  className="w-16 ml-6"
                />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t-2 px-4 pt-1 mb-2 sm:mb-0">
        <div className="relative flex flex-col mt-4">
          {showSuggestions && messages.length === 0 && (
            <div className="mb-6">
              <div className="no-opacity-scroll flex space-x-4 overflow-x-auto max-w-full scrollbar-hide p-4 rounded-lg shadow-inner">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-6 py-3 bg-gradient-to-r from-[#413e7c] to-[#7269c3] text-sm text-white rounded-full transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl whitespace-nowrap"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="relative flex">
            <input
              type="text"
              placeholder="Type a message..."
              autoComplete="off"
              autoFocus
              onKeyDown={handleUserInput}
              className="text-md w-full focus:outline-none text-gray-600 placeholder-gray-600 pl-5 pr-16 bg-gray-100 border-2 border-gray-200 focus:border-[#413e7c] rounded-full py-2"
              ref={inputRef}
            />
            <button
              type="submit"
              onClick={handleUserInput}
              className="text-white bg-[#413e7c] m-1 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
