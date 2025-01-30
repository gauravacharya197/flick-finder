import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import { Tag } from "antd";
import React from "react";

interface CustomTagProps {
  text: string;
  small?: boolean;
  color?: string;
}

export const CustomTag: React.FC<CustomTagProps> = ({ text, small = true,color="bg-primary" }) => {
  return (

<span className={` rounded ${color} px-2 py-1 ${small? 'text-xs':''}`}>{capitalizeFirstLetter(text)}</span>

  );
};