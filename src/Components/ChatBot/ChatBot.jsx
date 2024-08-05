import React, { useState, useEffect, useRef } from "react";
import DOMPurify from "dompurify";
import axios from "axios";
import { webURL } from "../../constantx";
const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      from: "agent",
      text: "Hi Agent, I want to get the Sales Data analyzed. Can you help me?",
    },
  ]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollChat = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const addMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const handleScrapeHtml = async () => {
    setBotTyping(true);
    try {
      const response = await axios.post(webURL+"api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "token": localStorage.getItem('token')
        },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      const htmlContent = data.summary;

      if (htmlContent) {
        const cleanHtml = DOMPurify.sanitize(htmlContent);
        const parser = new DOMParser();
        const doc = parser.parseFromString(cleanHtml, "text/html");

        const combineAndCleanContent = (selector) => {
          const element = doc.querySelector(selector);
          if (element) {
            element.querySelectorAll("svg").forEach((svg) => svg.remove());
            return element.innerHTML;
          }
          return "";
        };

        const ingredients = combineAndCleanContent(".recipe-ingredients");
        const directions = combineAndCleanContent(".recipe-directions");
        const combinedContent = `
          <div>
            ${ingredients ? ingredients : ""}
            ${directions ? directions : ""}
          </div>
        `;
        setRecipe(combinedContent);
        addMessage({ from: "bot", text: combinedContent });
      }
    } catch (error) {
      console.error("Error fetching and processing HTML:", error);
      addMessage({ from: "bot", text: "Error processing the request. Please try again." });
    } finally {
      setBotTyping(false);
      addMessage({
        from: "bot",
        text: "Hi there! I'd be happy to help you analyze your sales data. Please provide the URL or file to analyze the sales data, and I'll get started right away.",
      });
    }
  };

  const generateFormatted = async () => {
    setBotTyping(true);
    try {
      const response = await fetch("http://localhost:8000/format-scrapped-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      setRecipe(data.summary);
    } catch (error) {
      console.error("Error formatting scrapped data:", error);
      addMessage({ from: "bot", text: "Error formatting data. Please try again." });
    } finally {
      setBotTyping(false);
    }
  };

  const handleReviewSubmit = async () => {
    setBotTyping(true);
    const endpoint = reviewType === "single" ? "/single-review" : "/multiple-review";
    const payload = reviewType === "single"
      ? { rating: avgRating, recipe }
      : { count: numberOfReviews, avgRating, recipe };

    try {
      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      setRatingContent(data.review);
      addMessage({ from: "bot", text: data.review });
    } catch (error) {
      console.error("Error submitting review:", error);
      addMessage({ from: "bot", text: "Error submitting review. Please try again." });
    } finally {
      setBotTyping(false);
    }
  };

  const handleUserInput = (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      const input = e.target.value.trim().toLowerCase();
      e.target.value = "";
    }
  };

  useEffect(() => {
    scrollChat();
  }, [messages]);

  useEffect(() => {
    if (url) handleScrapeHtml();
  }, [url]);

  return (
    <div className="flex-1 p-2 sm:p-6 flex flex-col rounded-2xl h-[85vh] bg-white">
      <div
        id="messages"
        className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
      >
        {messages.map((message, key) => (
          <div key={key} className={`flex items-end ${message.from === "bot" ? "" : "justify-end"}`}>
            <div
              className={`flex flex-col space-y-2 text-md leading-tight max-w-lg mx-2 ${
                message.from === "bot" ? "order-2 items-start" : "order-1 items-end"
              }`}
            >
              <span
                className={`px-4 py-3 rounded-xl inline-block ${
                  message.from === "bot"
                    ? "rounded-bl-none bg-gray-100 text-gray-600"
                    : "rounded-br-none bg-[#4a43db] text-white"
                }`}
                dangerouslySetInnerHTML={{ __html: message.text }}
              ></span>
            </div>
            <img
              src={
                message.from === "bot"
                  ? "https://cdn.icon-icons.com/icons2/1371/PNG/512/robot02_90810.png"
                  : "https://i.pravatar.cc/100?img=7"
              }
              alt=""
              className={`w-6 h-6 rounded-full ${message.from === "bot" ? "order-1" : "order-2"}`}
            />
          </div>
        ))}
        {botTyping && (
          <div className="flex items-end">
            <div className="flex flex-col space-y-2 text-md leading-tight mx-2 order-2 items-start">
              <img
                src="https://support.signal.org/hc/article_attachments/360016877511/typing-animation-3x.gif"
                alt="Typing..."
                className="w-16 ml-6"
              />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
        <div className="relative flex">
          <input
            type="text"
            placeholder="Type a message..."
            autoComplete="off"
            autoFocus
            onKeyDown={handleUserInput}
            className="text-md w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-5 pr-16 bg-gray-100 border-2 border-gray-200 focus:border-[#413e7c] rounded-full py-2"
            ref={inputRef}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
