import React from 'react';
import { useChat } from './ChatContext';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const Sidebar = () => {
  const { chats, addChat } = useChat();
  const navigate = useNavigate();

  const addNewChat = () => {
    const unique_id = uuidv4();
    const newChat = { id: unique_id, name: `Chat ${chats.length + 1}` };
    addChat(newChat);
    navigate(`/dashboard/${unique_id}`);
  };

  return (
    <div className='bg-[#413e7c] rounded-r-lg text-center max-h-max w-60 p-5'>
      <button
        onClick={addNewChat}
        className='text-white font-semibold py-2 px-4 rounded mb-4 w-full'
      >
        Add New Chat
      </button>
      <ul className='text-left'>
        {chats.map(chat => (
          <li
            key={chat.id}
            className='bg-[#5653a4] text-white py-2 px-4 rounded mb-2 cursor-pointer'
            onClick={() => navigate(`/dashboard/${chat.id}`)}
          >
            {chat.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
