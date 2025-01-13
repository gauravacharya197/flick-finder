import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import { Tag } from "antd";
import React from "react";

interface CustomTagProps {
  text: string;
  bordered?: boolean;
  color?: string;
}

export const CustomTag: React.FC<CustomTagProps> = ({ text, bordered = false, color = "purple" }) => {
  return (
    <Tag bordered={bordered} color={color}>
      {capitalizeFirstLetter(text)}
    </Tag>
  );
};