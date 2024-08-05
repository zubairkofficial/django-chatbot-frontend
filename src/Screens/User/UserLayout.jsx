import React from 'react';

import Header from '../../Components/Header.jsx/Header';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const UserLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-white font-roboto">
      {/* <Sidebar/> */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white mr-4 ">
          <div className=" mx-auto ">
            < Outlet/>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
