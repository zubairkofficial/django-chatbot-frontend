import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { webURL } from '../../constantx';

const Header = () => {
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const resetChat = async () => {
    try {
      const user_id = localStorage.getItem('user_id');
      const response = await fetch(`${webURL}api/chatbot/delete_chathistory/${user_id}`);
      if (response.ok) {
        setNotification({ message: 'Chat history has been reset.', type: 'success' });
        window.location.reload();
      } else {
        setNotification({ message: 'Chat history has not been reset.', type: 'error' });
      }
    } catch (error) {
      console.error('Failed to reset chat history:', error);
      setNotification({ message: 'An error occurred while resetting chat history.', type: 'error' });
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${webURL}auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        navigate('/login');
      } else {
        console.error('Logout failed:', response.statusText);
      }
    } catch (error) {
      console.error('Logout request failed:', error);
    }
  };

  return (
    <header className="flex flex-row items-center justify-between px-6 py-4 bg-white mt-4 rounded-md shadow-md">
      <h3 className="text-gray-700 text-3xl font-medium">ChatBot</h3>
      <div className="flex items-center gap-6">
        <div className="hidden lg:flex items-center gap-4">
          
          <button onClick={resetChat} className="text-red-600 bg-red-50 py-2 px-4 rounded-md hover:bg-red-100 transition">
            Reset
          </button>
        </div>
        <div className="relative">
          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="relative block w-10 h-10 overflow-hidden rounded-full shadow focus:outline-none">
            <img className="object-cover w-full h-full" src="https://images.unsplash.com/photo-1528892952291-009c663ce843?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=296&q=80" alt="Your avatar" />
          </button>
          {dropdownOpen && (
            <>
              <div onClick={() => setDropdownOpen(false)} className="fixed inset-0 z-10 w-full h-full"></div>
              <div className="absolute right-0 z-20 w-48 mt-2 overflow-hidden bg-white rounded-md shadow-xl">
                <div className="font-semibold block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-primary-light hover:text-white rounded-md">
                  {localStorage.getItem('user_name')}
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-primary-light hover:text-white rounded-md"
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      {notification.message && (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg text-white ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {notification.message}
        </div>
      )}
    </header>
  );
};

export default Header;
