"use client";
import { Toaster } from "react-hot-toast";

const ToasterContext = () => {
  return (
    <div>
      <Toaster 
        position="bottom-center" 
        reverseOrder={false}
        
        toastOptions={{
          duration: 2000, // Duration in milliseconds (5 seconds)
          style: {
            background: "black",
            color: "white",
          },
        }}
      />
    </div>
  );
};

export default ToasterContext;