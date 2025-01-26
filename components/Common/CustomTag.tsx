import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import { Tag } from "antd";
import React from "react";

interface CustomTagProps {
  text: string;
  bordered?: boolean;
  color?: string;
}

export const CustomTag: React.FC<CustomTagProps> = ({ text, bordered = false }) => {
  return (
    <Tag bordered={bordered}   className="bg-primary text-white" // Example: Use the primary color as the background and text color
>
      {capitalizeFirstLetter(text)}
    </Tag>
  );
};