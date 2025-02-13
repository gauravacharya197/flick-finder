import React from 'react';
import { PiSpinnerBold } from "react-icons/pi";

type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface SpinnerProps {
  size?: SpinnerSize;
}

const sizes: Record<SpinnerSize, string> = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
};

const Spinner: React.FC<SpinnerProps> = ({ size = 'md' }) => {
  return (
    <div className="flex items-center justify-center">
      <PiSpinnerBold 
        className={`${sizes[size]} animate-spin text-primary`}
        aria-label="Loading"
      />
    </div>
  );
};

export default Spinner;