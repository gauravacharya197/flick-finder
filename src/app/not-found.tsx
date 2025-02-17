import React from "react";
import { FaHome, FaRocket } from "react-icons/fa";
import Link from "next/link";
import RootLayout from "./(site)/layout";
import { Metadata } from "next";
import { siteConfig } from "@/config/siteConfig";
export const metadata: Metadata = {
  title:  `404 - ${siteConfig.title}`,
  description: siteConfig.description,
  // other metadata
};
export default function NotFound() {
  return (
    <RootLayout>
      <div className="md:pt-20 bg-background flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-lg">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 500 300" 
            className="mx-auto mb-8 w-full max-w-md"
          >
            <path 
              d="M250 50 Q350 150, 250 250 Q150 150, 250 50" 
              fill="none" 
              stroke="#FF6B6B" 
              strokeWidth="10"
            />
            <circle cx="250" cy="150" r="100" fill="#4ECDC4" opacity="0.5"/>
            <text 
              x="250" 
              y="170" 
              textAnchor="middle" 
              fontSize="120" 
              fontWeight="bold" 
              fill="#FF6B6B"
            >
              404
            </text>
          </svg>
          
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            Houston, We Have a Problem!
          </h1>
          
          
          
         
          
          <p className="text-lg text-primary-800 mb-6">
            "I'm sorry, Dave. I'm afraid I can't find that page." 
            <br/>- HAL 9000 (with a 404 twist)
          </p>
          
          <div className="flex justify-center space-x-4">
            <Link 
              href="/" 
              className="flex items-center text-sm bg-primary-500 text-white px-6 py-3 rounded-full hover:bg-primary-600 transition"
            >
              <FaHome className="mr-2"/> Return to Base
            </Link>
            
            <Link 
              href="/explore/movies" 
              className=" text-sm flex items-center bg-primary-500 text-white px-6 py-3 rounded-full hover:bg-primary-600 transition"
            >
              <FaRocket className="mr-2"/> Explore Universe
            </Link>
          </div>
        </div>
      </div>
    </RootLayout>
  );
};

