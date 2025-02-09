import React, { useState } from 'react';
import { Modal, Spin, Tooltip } from 'antd';
import { IoMdClose } from "react-icons/io";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { FaRobot, FaSearch } from 'react-icons/fa';
import Link from 'next/link';
import Home from '../Home';
import MovieSuggestions from '../Movie/MovieSuggestions';
import ErrorMessage from './ErrorMessage';

const QUERY_KEY = ["movieSearch"];

export const RobotSearchModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-4 relative">
        <Tooltip title="Search With AI">
          <Link
            href={"/"}
            className="group flex items-center gap-2 rounded-md bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-2 text-white transition-all hover:shadow-lg hover:translate-y-[-2px]"
          >
            <FaRobot className="h-4 w-4 transition-transform group-hover:rotate-12" />
            <FaSearch className="h-3 w-3" />
          </Link>
        </Tooltip>
      </div>

      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={640}
        centered
        className="custom-modal" // Add this class for custom styling
       
        
        
      >
        <div className="max-h-[80vh] overflow-auto bg-background">
          <Home showHomeLink={false} />
        </div>
      </Modal>
    </>
  );
};