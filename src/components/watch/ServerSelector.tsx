// components/player/ServerSelector.tsx
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { FaServer } from "react-icons/fa";
import { VideoServer } from "@/constants/videoServers";

interface ServerSelectorProps {
  selectedServer: number;
  onServerChange: (serverId: number) => void;
  servers:VideoServer[];
}

const ServerSelector = ({ selectedServer, onServerChange,servers }: ServerSelectorProps) => {
  return (
    <Select
      value={selectedServer.toString()}
      onValueChange={(value) => onServerChange(parseInt(value))}
    >
<SelectTrigger className="max-w-xs border-gray-700 bg-gray-800 ring-0 focus:ring-0 focus:ring-offset-0 lg:w-[200px] text-white">
<div className="flex items-center gap-3">
          <FaServer className="h-4 w-4 text-primary" />
          <SelectValue placeholder="Choose Server" />
        </div>
      </SelectTrigger>
      <SelectContent className="border-gray-700 bg-gray-800 text-gray-100">
        <SelectGroup>
          {servers.sort((a, b) => a.id - b.id).map((server) => (
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