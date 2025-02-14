import React from 'react';
import { RiSparkling2Line } from "react-icons/ri";
import { MyTooltip } from '../ui/MyTooltip';

const RobotSearchButton = ({ onClick, isModalOpen }) => {
  return (
    <MyTooltip content="Search With AI">
      <button
        onClick={onClick}
        className={`group relative flex items-center rounded-lg px-4 py-2 transition-all duration-300
          ${isModalOpen 
            ? 'bg-primary/20' 
            : 'bg-gray-800/50'
          }
          hover:bg-primary/30 hover:shadow-lg hover:shadow-primary/20`}
      >
        <RiSparkling2Line 
          className={`h-5 w-5 transition-all duration-300
            ${isModalOpen 
              ? 'text-primary animate-pulse' 
              : 'text-primary/80'
            }
            group-hover:rotate-12 group-hover:scale-110`}
        />
      </button>
    </MyTooltip>
  );
};

export default RobotSearchButton;