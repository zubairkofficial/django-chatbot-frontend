import React, { createContext, useState, useContext } from 'react';

// Create the Context
const ChatContext = createContext();

// Create a provider component
export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);

  const addChat = (chat) => {
    setChats((prevChats) => [...prevChats, chat]);
  };

  const value = {
    chats,
    addChat
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

// Create a custom hook to use the context
export const useChat = () => {
  return useContext(ChatContext);
};
