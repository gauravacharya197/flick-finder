import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, Dropdown, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";

export const LoginPartial = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const user = localStorage.getItem("user");

  useEffect(() => {
    if (user) {
      setIsLoggedIn(true);
    }
  }, [user]);

  const handleLogout = () => {
   
      localStorage.removeItem("user");
      setIsLoggedIn(false);
    
  };

 

  return (
    <>
     
      {isLoggedIn ? (
       
         <div className="group relative">
        <button className="flex cursor-pointer items-center justify-between gap-3 hover:text-primary">
        <UserOutlined />
          <span>
            <svg
              className="h-3 w-3 cursor-pointer fill-waterloo group-hover:fill-primary"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"></path>
            </svg>
          </span>
        </button>
        <ul className="dropdown ">
          <li className="hover:text-primary">
            <Link href="/watchlist">Watchlist</Link>
          </li>
          <li className="hover:text-primary">
            <Link href="/seen">Seen</Link>
          </li>
          <li className="hover:text-primary">
            <a onClick={handleLogout}>Logout</a>
          </li>
         
        </ul>
      </div>
      
      ) : (
        <Link
          href="/auth/login"
          className="flex items-center justify-center rounded-full bg-primary px-7.5 py-2.5 text-regular text-white duration-300 ease-in-out hover:bg-primaryho"
        >
          Login
        </Link>
      )}
    </>
  );
};

export default LoginPartial;
