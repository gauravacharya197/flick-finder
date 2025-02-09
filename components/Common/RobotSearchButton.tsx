'use client'
import { Tooltip } from 'antd';
import Link from 'next/link';
import React from 'react';
import { FaRobot, FaSearch } from 'react-icons/fa';
import { getRecommendation } from '@/services/MovieService';
import { RobotSearchModal } from './RobotSearchModal';
const RobotSearchButton = () => {
  return (
   
      <RobotSearchModal />
   
  );
};

export default RobotSearchButton;