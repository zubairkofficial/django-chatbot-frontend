import React, { useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden"
        ></div>
      )}

      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 rounded-lg p-4 m-4 overflow-y-auto transition duration-300 transform bg-primary-light lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? "translate-x-0 ease-out" : "-translate-x-full ease-in"
        }`}
      >
        <div className="flex items-center justify-center mt-8">
          <div className="flex items-center">
            <span className="mx-2 text-2xl  font-semibold text-white">
              ChatBot
            </span>
          </div>
        </div>

     
      </div>
    </>
  );
};

export default Sidebar;
