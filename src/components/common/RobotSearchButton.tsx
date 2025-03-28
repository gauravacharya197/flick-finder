import React from "react";
import { RiSparkling2Line } from "react-icons/ri";
import { MyTooltip } from "../ui/MyTooltip";

const RobotSearchButton = ({ onClick, isModalOpen }) => {
  const handleClick = (event) => {
    
    onClick(event); // Call the original onClick function
    if (window.umami) {
      window.umami.track("ai_search_click", {
        category: "Button Interaction",
        label: "AI Search",
      });
    }
  };

  return (
    <MyTooltip content="Search With AI">
      <button
        onClick={handleClick}
        className={`group relative flex items-center rounded-md px-4 py-2 transition-all duration-300
          ${isModalOpen ? "bg-primary/20" : "bg-gray-800/50"}
          hover:bg-white/30 hover:shadow-lg hover:shadow-primary/20`}
      >
        <RiSparkling2Line
          className={`h-5 w-5 transition-all duration-300 text-yellow-300
            ${isModalOpen ? "text-yellow-400" : "text-yellow-300"}
            group-hover:rotate-12 group-hover:scale-110 group-hover:text-yellow-200`}
        />
      </button>
    </MyTooltip>
  );
};

export default RobotSearchButton;
