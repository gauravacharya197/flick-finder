// ErrorMessage.tsx
import React from "react";

interface ErrorMessageProps {
  message: string;
  className?: string; // Optional for additional styling
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, className }) => {
  return (
    <div
      className={`flex items-center gap-2 rounded-md border border-red-500 bg-red-100 p-4 text-red-700 dark:bg-red-900 dark:text-red-200 ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.054 0 1.502-1.281.732-1.962L13.732 9.962c-.77-.681-2.024-.681-2.794 0L5.34 17.038c-.77.681-.322 1.962.732 1.962z"
        />
      </svg>
      <span>{message}</span>
    </div>
  );
};

export default ErrorMessage;
