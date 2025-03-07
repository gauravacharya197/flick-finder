// components/player/ServerSelector.tsx
import { useState, useEffect } from "react";
import { VIDEO_SERVERS } from "@/constants/videoServers";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { FaServer } from "react-icons/fa";

interface ServerSelectorProps {
  selectedServer: number;
  onServerChange: (serverId: number) => void;
}

const ServerSelector = ({ selectedServer, onServerChange }: ServerSelectorProps) => {
  return (
    <Select
      value={selectedServer.toString()}
      onValueChange={(value) => onServerChange(parseInt(value))}
    >
      <SelectTrigger className="max-w-xs border-gray-700 bg-gray-800 ring-gray-700 lg:w-[200px] text-white">
        <div className="flex items-center gap-3">
          <FaServer className="h-4 w-4 text-primary" />
          <SelectValue placeholder="Choose Server" />
        </div>
      </SelectTrigger>
      <SelectContent className="border-gray-700 bg-gray-800 text-gray-100">
        <SelectGroup>
          {VIDEO_SERVERS.map((server) => (
            <SelectItem
              key={server.id}
              value={server.id.toString()}
              className="cursor-pointer data-[highlighted]:bg-gray-700 data-[highlighted]:text-white"
            >
              <div className="flex items-center gap-3">
                <span className="font-medium">{server.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default ServerSelector;